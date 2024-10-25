import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask, updateTaskStatus } from '../features/tasks/tasksSlice';
import { Card, Button } from 'react-bootstrap';
import './TaskList.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AddTaskForm from './AddTaskForm';

function TaskList() {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    const [showAddTask, setShowAddTask] = useState(false);

    useEffect(() => {
        dispatch(fetchTasks())
            .unwrap()
            .then(() => console.log("Tasks fetched successfully"))
            .catch((err) => console.error("Error fetching tasks:", err));
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteTask(id))
            .unwrap()
            .then(() => {
                dispatch(fetchTasks());
            })
            .catch((error) => {
                console.error("Failed to delete task status:", error);
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
            .then(() => {
                dispatch(fetchTasks());
            })
            .catch((error) => {
                console.error("Failed to update task status:", error);
            });
    };

    const handleClose = () => setShowAddTask(false);
    const handleShow = () => setShowAddTask(true);


    if (loading) {
        return <div className="text-center"><h3>Loading...</h3></div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const groupedTasks = {
        Pending: tasks.filter(task => task.status === 'Pending'),
        InProgress: tasks.filter(task => task.status === 'InProgress'),
        Completed: tasks.filter(task => task.status === 'Completed'),
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Task List</h2>
            <div className="text-center mb-3">
                <Button variant="primary" onClick={handleShow} className="mb-3" style={{ width: '100px' }}>
                    Add Task
                </Button>
            </div>
            <AddTaskForm show={showAddTask} handleClose={handleClose} />
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
                                                    <Card className="mb-3" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <Card.Body>
                                                            <Card.Title>{task.title}</Card.Title>
                                                            <Card.Text>{task.description}</Card.Text>
                                                            <div className="d-flex justify-content-between">
                                                                <Button variant="danger" onClick={() => handleDelete(task.id)}>Delete</Button>
                                                            </div>
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
        </div>
    );
}

export default TaskList;
