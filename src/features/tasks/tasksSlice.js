import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
    const response = await api.get('/tasks', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data.tasks;
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
});

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
    const response = await api.post('/tasks', taskData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await api.delete(`/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return taskId;
});

export const updateTaskStatus = createAsyncThunk('tasks/updateTaskStatus', async ({ id, status }) => {
    const response = await api.put(`/tasks/${id}`, { status }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, title, description, status }) => {
    const response = await api.put(`/tasks/${id}`, { title, description, status }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch tasks';
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.data = state.tasks.filter((task) => task.id !== action.payload);
            });
    },
});

export default tasksSlice.reducer;
