import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../features/tasks/tasksSlice';

const AddTaskForm = ({ show, handleClose, editingTask, refreshTasks }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setStatus(editingTask.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus('Pending');
        }
    }, [editingTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = { title, description, status };

        if (editingTask) {
            dispatch(updateTask({ ...taskData, id: editingTask.id }))
                .unwrap()
                .then(() => {
                    handleClose();
                    refreshTasks();
                })
                .catch((error) => console.error("Failed to update task:", error));
        } else {
            dispatch(addTask(taskData))
                .unwrap()
                .then(() => {
                    handleClose();
                    refreshTasks();
                })
                .catch((error) => console.error("Failed to add task:", error));
        }

        setTitle('');
        setDescription('');
        setStatus('Pending');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="taskTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="taskDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="taskStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pending">Pending</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit">
                        {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddTaskForm;
