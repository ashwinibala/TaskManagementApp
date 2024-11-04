import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../features/tasks/tasksSlice';
import { Button, Card, Modal, Form, Col, Row } from 'react-bootstrap';
import AddTaskForm from './AddTaskForm';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Tooltip } from 'bootstrap';
import debounce from 'lodash.debounce';
import Select from 'react-select';
import './styles/SimpleTaskList.css';

const SimpleTaskList = () => {
    const dispatch = useDispatch();
    const { pages, loading, error, total } = useSelector((state) => state.tasks);
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedPriorities, setSelectedPriorities] = useState([]);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const statusOptions = [
        { value: 'Backlog', label: 'Backlog' },
        { value: 'Todo', label: 'To Do' },
        { value: 'InProgress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
    ];

    const priorityOptions = [
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: 'High', label: 'High' },
    ];

    useEffect(() => {
        dispatch(fetchTasks({
            page: currentPage,
            per_page: itemsPerPage,
            search: searchQuery,
            statuses: selectedStatuses,
            priorities: selectedPriorities
        }));
    }, [dispatch, currentPage, , selectedStatuses, selectedPriorities]);

    const getBorderColor = (status) => {
        switch (status) {
            case 'Backlog':
                return '#ffc107';
            case 'Todo':
                return '#007bff';
            case 'InProgress':
                return '#28a745';
            case 'Completed':
                return '#6c757d';
            case 'Cancelled':
                return '#dc3545';
            default:
                return '#000';
        }
    };

    const fetchTasksDebounced = debounce((query) => {
        setCurrentPage(1);
        dispatch(fetchTasks({ page: 1, per_page: itemsPerPage, search: query, statuses: selectedStatuses, priorities: selectedPriorities }));
    }, 1000);

    const handleSearch = () => {
        setCurrentPage(1);
        dispatch(fetchTasks({
            page: 1,
            per_page: itemsPerPage,
            search: searchQuery,
            statuses: selectedStatuses,
            priorities: selectedPriorities
        }));
    };

    const handleClose = () => {
        setShowAddTask(false);
        setEditingTask(null);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowAddTask(true);
    };

    const handleDelete = (id) => {
        dispatch(deleteTask(id))
            .unwrap()
            .then(() => {
                dispatch(fetchTasks({ page: currentPage, per_page: itemsPerPage, search: searchQuery, statuses: selectedStatuses, priorities: selectedPriorities }));
                setShowDeleteConfirm(false);
            })
            .catch((error) => console.error("Failed to delete task:", error));
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) handleDelete(taskToDelete.id);
    };

    const totalPages = Math.ceil(total / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <span
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`pagination-item ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </span>
            );
        }

        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(start + itemsPerPage - 1, total);

        return (
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    Showing {start} to {end} out of {total} tasks
                </div>
                <div className="d-flex align-items-center">
                    <div className="pagination">
                        {pages}
                    </div>
                    {totalPages > 5 && currentPage < totalPages && (
                        <button
                            className="btn btn-link ms-2"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const truncateTitleText = (text) => {
        return text.length > 20 ? text.substring(0, 20) + '...' : text;
    };

    const truncateDescriptionText = (text) => {
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
    };

    if (loading) return <div className="text-center"><h3>Loading...</h3></div>;

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <h2 className="text-center">Task List</h2>
                    <FaPlus
                        size={30}
                        color="#495057"
                        className="add-task-icon ms-2"
                        onClick={() => setShowAddTask(true)}
                    />
                </div>
                <div className="search-container">
                    <Form.Group as={Col} md={10} className="mb-0 me-2">
                        <Form.Control
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Form.Group>
                    <button className="btn btn-primary go-button" onClick={handleSearch}>
                        Go
                    </button>
                </div>
            </div>

            <Form className="mb-4">
                <Row className="align-items-center mb-3">
                    <Form.Group as={Col} md={5} className="mb-3">
                        <Form.Label>Filter by Status</Form.Label>
                        <Select
                            isMulti
                            name="statuses"
                            options={statusOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={statusOptions.filter(option => selectedStatuses.includes(option.value))}
                            onChange={(selected) => {
                                const values = selected ? selected.map(option => option.value) : [];
                                setSelectedStatuses(values);
                                setCurrentPage(1);
                            }}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md={5} className="mb-3">
                        <Form.Label>Filter by Priority</Form.Label>
                        <Select
                            isMulti
                            name="priorities"
                            options={priorityOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={priorityOptions.filter(option => selectedPriorities.includes(option.value))}
                            onChange={(selected) => {
                                const values = selected ? selected.map(option => option.value) : [];
                                setSelectedPriorities(values);
                                setCurrentPage(1);
                            }}
                        />
                    </Form.Group>
                </Row>
            </Form>

            <AddTaskForm show={showAddTask} handleClose={handleClose} editingTask={editingTask} />

            <div className="task-list">
                {Array.isArray(pages[currentPage]) && pages[currentPage].length > 0 ? (
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Task ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages[currentPage].map((task) => (
                                <tr key={task.id}>
                                    <td>TASK-{task.id}</td>
                                    <td title={task.title}>{truncateTitleText(task.title)}</td>
                                    <td title={task.description}>{truncateDescriptionText(task.description)}</td>
                                    <td>
                                        <span className={`status-bubble ${task.status.toLowerCase()}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`priority-bubble ${task.priority.toLowerCase()}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-icons">
                                            <FaEdit
                                                className="action-icon"
                                                onClick={() => handleEditTask(task)}
                                            />
                                            <FaTrash
                                                className="action-icon ms-2"
                                                onClick={() => handleDeleteClick(task)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-tasks-message">No tasks found.</div>
                )}
            </div>

            {renderPagination()}

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete task <strong>{taskToDelete ? taskToDelete.title : ''}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SimpleTaskList;
