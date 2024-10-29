import React, { useState } from 'react';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import SimpleTaskList from './SimpleTaskList';

const MainTaskView = () => {
    const [showAddTask, setShowAddTask] = useState(false);
    const [view, setView] = useState('simple');

    const handleClose = () => {
        setShowAddTask(false);
    };

    const handleViewChange = (val) => {
        setView(val);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Task Management</h2>

            <div className="text-center mb-3">
            </div>
            <AddTaskForm show={showAddTask} handleClose={handleClose} />

            <div className="text-center mb-4">
                <ToggleButtonGroup
                    type="radio"
                    name="taskView"
                    value={view}
                    onChange={handleViewChange}
                    style={{ display: 'flex', gap: '10px' }}
                >
                    <ToggleButton id="tbg-simple" value="simple" style={{ width: 'auto' }}>
                        List View
                    </ToggleButton>
                    {/* <ToggleButton id="tbg-detailed" value="detailed" style={{ width: 'auto' }}>
                        Status View
                    </ToggleButton> */}
                </ToggleButtonGroup>
            </div>

            {view === 'simple' ? <SimpleTaskList /> : <TaskList />}
        </div>
    );
};

export default MainTaskView;
