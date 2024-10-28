import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../features/tasks/tasksSlice';
import { Button, Card, Modal, Form, Col, Row } from 'react-bootstrap';
import AddTaskForm from './AddTaskForm';
import { FaPlus, FaTimes } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import Select from 'react-select';

const SimpleTaskList = () => {
    const dispatch = useDispatch();
    const { pages, loading, error, total } = useSelector((state) => state.tasks);
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const statusOptions = [
        { value: 'Backlog', label: 'Backlog' },
        { value: 'Todo', label: 'To Do' },
        { value: 'InProgress', label: 'In Progress' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Cancelled', label: 'Cancelled' },
    ];

    useEffect(() => {
        dispatch(fetchTasks({
            page: currentPage,
            per_page: itemsPerPage,
            search: searchQuery,
            statuses: selectedStatuses
        }),
        );
    }, [dispatch, currentPage, searchQuery, selectedStatuses]);

    const fetchTasksDebounced = debounce((query) => {
        setCurrentPage(1);
        dispatch(fetchTasks({ page: 1, per_page: itemsPerPage, search: query, statuses: selectedStatuses }));
    }, 1000);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchTasksDebounced(value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchTasksDebounced.flush();
        }
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
                dispatch(fetchTasks({ page: currentPage, per_page: itemsPerPage, search: searchQuery, statuses: selectedStatuses }));
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
                    style={{
                        cursor: 'pointer',
                        margin: '0 5px',
                        fontWeight: currentPage === i ? 'bold' : 'normal',
                        textDecoration: currentPage === i ? 'underline' : 'none'
                    }}
                >
                    {i}
                </span>
            );
        }
        return <div className="pagination text-center mt-3">{pages}</div>;
    };

    if (loading) return <div className="text-center"><h3>Loading...</h3></div>;

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center">
                    Task List [{total}]
                </h2>
                <FaPlus
                    size={30}
                    style={{ cursor: 'pointer', color: '#007bff' }}
                    onClick={() => setShowAddTask(true)}
                />
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
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    boxShadow: 'none',
                                    borderColor: '#ced4da',
                                    '&:hover': {
                                        borderColor: '#80bdff',
                                    },
                                }),
                                multiValue: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#e2e6ea',
                                }),
                                multiValueLabel: (provided) => ({
                                    ...provided,
                                    color: '#495057',
                                }),
                                multiValueRemove: (provided) => ({
                                    ...provided,
                                    color: '#dc3545',
                                    '&:hover': {
                                        backgroundColor: '#f8d7da',
                                        color: '#721c24',
                                    },
                                }),
                            }}
                        />
                    </Form.Group>

                    <Form.Group as={Col} md={7} className="mb-3">
                        <Form.Label>Search Tasks</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyPress={handleKeyPress}
                            style={{
                                borderRadius: '0.375rem',
                                border: '1px solid #ced4da',
                                padding: '10px',
                            }}
                        />
                    </Form.Group>
                </Row>
            </Form>

            <AddTaskForm show={showAddTask} handleClose={handleClose} editingTask={editingTask} />

            <div className="task-list">
                {Array.isArray(pages[currentPage]) && pages[currentPage].length > 0 ? (
                    pages[currentPage].map((task) => (
                        <Card
                            className="mb-3 task-card"
                            key={task.id}
                            onClick={() => handleEditTask(task)}
                            style={{
                                cursor: 'pointer',
                                borderRadius: '8px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                borderLeft: `5px solid ${task.status === 'Completed' ? '#28a745' : task.status === 'InProgress' ? '#ffc107' : task.status === 'Cancelled' ? '#dc3545' : '#007bff'}`,
                            }}
                        >
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div style={{ flexGrow: 1 }}>
                                    <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>
                                        {task.title}
                                    </Card.Title>
                                    <Card.Text style={{ color: '#6c757d', marginBottom: '8px' }}>
                                        {task.description}
                                    </Card.Text>
                                    <div className="d-flex align-items-center">
                                        <Card.Subtitle className="me-3" style={{ color: '#495057', fontSize: '0.9rem' }}>
                                            Status: <strong>{task.status}</strong>
                                        </Card.Subtitle>
                                        <Card.Subtitle style={{ color: '#495057', fontSize: '0.9rem' }}>
                                            Priority: <strong>{task.priority}</strong>
                                        </Card.Subtitle>
                                    </div>
                                </div>
                                <FaTimes
                                    size={20}
                                    style={{ cursor: 'pointer', color: '#dc3545' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(task);
                                    }}
                                    title="Delete Task"
                                />
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div>No tasks available</div>
                )}
            </div>

            {renderPagination()}

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the task "{taskToDelete ? taskToDelete.title : ''}"?
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
