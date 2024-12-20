import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../features/tasks/tasksSlice';
import { fetchTasks } from '../features/tasks/tasksSlice';

const AddTaskForm = ({ show, handleClose, editingTask, currentPage, searchQuery, selectedStatuses, selectedPriorities }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Backlog');
    const [priority, setPriority] = useState('Low');
    const [titleWarning, setTitleWarning] = useState('');
    const [descriptionWarning, setDescriptionWarning] = useState('');

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDescription(editingTask.description);
            setStatus(editingTask.status);
            setPriority(editingTask.priority);
        } else {
            setTitle('');
            setDescription('');
            setStatus('Backlog');
            setPriority('Low');
        }
    }, [editingTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setTitleWarning('');
        setDescriptionWarning('');

        if (title.length > 128) {
            setTitleWarning('Title cannot exceed 128 characters.');
            return;
        }

        if (description.length > 3000) {
            setDescriptionWarning('Description cannot exceed 3000 characters.');
            return;
        }

        const taskData = { title, description, status, priority };

        const action = editingTask
            ? updateTask({ ...taskData, id: editingTask.id })
            : addTask(taskData);

        dispatch(action)
            .unwrap()
            .then(() => {
                handleClose();
                dispatch(fetchTasks({
                    page: currentPage,
                    per_page: 10,
                    search: searchQuery,
                    statuses: selectedStatuses,
                    priorities: selectedPriorities
                }));
            })
            .catch((error) => console.error(`Failed to ${editingTask ? 'update' : 'add'} task:`, error));
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
                        {titleWarning && <div className="text-danger">{titleWarning}</div>}
                    </Form.Group>
                    <Form.Group controlId="taskDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {descriptionWarning && <div className="text-danger">{descriptionWarning}</div>}
                    </Form.Group>
                    <Form.Group controlId="taskStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Backlog">Backlog</option>
                            <option value="Todo">To Do</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="taskPriority">
                        <Form.Label>Priority</Form.Label>
                        <Form.Control
                            as="select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
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
