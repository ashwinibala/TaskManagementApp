import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask, updateTaskStatus } from '../features/tasks/tasksSlice';
import { Card, Button, Modal } from 'react-bootstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';
import './TaskList.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddTaskForm from './AddTaskForm';

function TaskList() {
    const dispatch = useDispatch();
    const { tasks = [], loading, error, total } = useSelector((state) => state.tasks);
    const [editingTask, setEditingTask] = useState(null);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(total / itemsPerPage);

    const refreshTasks = () => {
        dispatch(fetchTasks({ page: currentPage, per_page: itemsPerPage }))
            .unwrap()
            .then(() => console.log("Tasks fetched successfully"))
            .catch((err) => console.error("Error fetching tasks:", err));
    };

    useEffect(() => {
        refreshTasks();
    }, [dispatch, currentPage]);

    const handleDelete = (id) => {
        dispatch(deleteTask(id))
            .unwrap()
            .then(() => refreshTasks())
            .catch((error) => {
                console.error("Failed to delete task:", error);
            });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const updatedTasks = Array.from(tasks);
        const [removed] = updatedTasks.splice(result.source.index, 1);
        updatedTasks.splice(result.destination.index, 0, removed);
        const updatedTask = {
            ...removed,
            status: result.destination.droppableId,
        };
        dispatch(updateTaskStatus(updatedTask))
            .unwrap()
            .then(() => refreshTasks())
            .catch((error) => {
                console.error("Failed to update task status:", error);
            });
    };

    const handleClose = () => {
        setShowAddTask(false);
        setEditingTask(null);
    };

    const handleCardClick = (task) => {
        setEditingTask(task);
        setShowAddTask(true);
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            handleDelete(taskToDelete.id);
            setShowDeleteConfirm(false);
            setTaskToDelete(null);
        }
    };

    // Pagination control handlers
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

    if (loading) {
        return <div className="text-center"><h3>Loading...</h3></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const groupedTasks = {
        Backlog: tasks.filter(task => task.status === 'Backlog'),
        Todo: tasks.filter(task => task.status === 'Todo'),
        InProgress: tasks.filter(task => task.status === 'InProgress'),
        Completed: tasks.filter(task => task.status === 'Completed'),
        Cancelled: tasks.filter(task => task.status === 'Cancelled'),
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-center">Task List</h2>
                <FaPlus
                    size={30}
                    style={{ cursor: 'pointer', color: '#007bff' }}
                    onClick={() => setShowAddTask(true)}
                />
            </div>
            <AddTaskForm show={showAddTask} handleClose={handleClose} editingTask={editingTask} />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="row">
                    {Object.entries(groupedTasks).map(([status]) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div className="col-md-4 mb-4" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h4 className="text-center">{status}</h4>
                                    {groupedTasks[status].length === 0 ? (
                                        <p className="text-center">No tasks available</p>
                                    ) : (
                                        groupedTasks[status].map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided) => (
                                                    <Card
                                                        className="mb-3"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => handleCardClick(task)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <Card.Body className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <Card.Title>{task.title}</Card.Title>
                                                                <Card.Text>{task.description}</Card.Text>
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
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {/* Pagination Controls */}
            <div className="pagination-controls text-center mt-4">
                {renderPagination()}
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
}

export default TaskList;
