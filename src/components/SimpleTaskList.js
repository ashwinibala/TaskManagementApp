import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../features/tasks/tasksSlice';
import { Button, Card, Modal } from 'react-bootstrap';
import AddTaskForm from './AddTaskForm';
import { FaPlus, FaTimes } from 'react-icons/fa';

const SimpleTaskList = () => {
    const dispatch = useDispatch();
    const { pages, loading, error, total } = useSelector((state) => state.tasks);
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Fetch tasks for the current page if not already in the store
        dispatch(fetchTasks({ page: currentPage, per_page: itemsPerPage }));
    }, [dispatch, currentPage]);

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
                dispatch(fetchTasks({ page: currentPage, per_page: itemsPerPage }));
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
                <Button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </Button>
            );
        }
        return <div className="pagination">{pages}</div>;
    };

    if (loading) return <div className="text-center"><h3>Loading...</h3></div>;

    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center">Task List</h2>
                <FaPlus
                    size={30}
                    style={{ cursor: 'pointer', color: '#007bff' }}
                    onClick={() => setShowAddTask(true)}
                />
            </div>

            <AddTaskForm show={showAddTask} handleClose={handleClose} editingTask={editingTask} />

            <div className="task-list">
                {Array.isArray(pages[currentPage]) && pages[currentPage].length > 0 ? (
                    pages[currentPage].map((task) => (
                        <Card className="mb-3" key={task.id} onClick={() => handleEditTask(task)} style={{ cursor: 'pointer' }}>
                            <Card.Body className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title style={{ margin: 0 }}>{task.title}</Card.Title>
                                    <Card.Text>{task.description}</Card.Text>
                                    <Card.Subtitle>{task.status}</Card.Subtitle>
                                    <Card.Subtitle>{task.priority}</Card.Subtitle>
                                </div>
                                <FaTimes
                                    size={20}
                                    style={{ cursor: 'pointer', color: 'red' }}
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
