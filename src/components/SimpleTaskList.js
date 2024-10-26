import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../features/tasks/tasksSlice';
import { Button, Card, Modal } from 'react-bootstrap';
import AddTaskForm from './AddTaskForm';
import { FaPlus, FaTimes } from 'react-icons/fa';

const SimpleTaskList = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchTasks())
            .unwrap()
            .catch((err) => console.error("Error fetching tasks:", err));
    }, [dispatch]);

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
                setShowDeleteConfirm(false); // Close the confirm modal
                setTaskToDelete(null); // Clear the task to delete
            })
            .catch((error) => console.error("Failed to delete task:", error));
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            handleDelete(taskToDelete.id);
        }
    };

    if (loading) {
        return <div className="text-center"><h3>Loading...</h3></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

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
                {tasks.map((task) => (
                    <Card className="mb-3" key={task.id} onClick={() => handleEditTask(task)} style={{ cursor: 'pointer' }}>
                        <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                                <Card.Title style={{ margin: 0 }}>{task.title}</Card.Title>
                                <Card.Text>{task.description}</Card.Text>
                                <Card.Subtitle>{task.status}</Card.Subtitle>
                            </div>
                            <FaTimes
                                size={20}
                                style={{ cursor: 'pointer', color: 'red' }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the edit task
                                    handleDeleteClick(task);
                                }}
                                title="Delete Task"
                            />
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Confirmation Modal for Deleting Task */}
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
