import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async ({ page = 1, per_page = 10 } = {}, { getState }) => {
        const response = await api.get(`/api/v1/tasks?page=${page}&per_page=${per_page}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return {
            tasks: response.data.tasks,
            total: response.data.meta.total_count,
            currentPage: response.data.meta.current_page,
        };
    }
);

export const addTask = createAsyncThunk('tasks/addTask', async (taskData) => {
    const response = await api.post('/api/v1/tasks', taskData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
});

export const updateTaskStatus = createAsyncThunk('tasks/updateTaskStatus', async ({ id, status }) => {
    const response = await api.put(`/api/v1/tasks/${id}`, { status }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, title, description, status, priority }) => {
    const response = await api.put(`/api/v1/tasks/${id}`, { title, description, status, priority }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId) => {
    await api.delete(`/api/v1/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return taskId;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        pages: {},
        total: 0,
        loading: false,
        error: null,
    }, reducers: {
        resetTaskPages(state) {
            state.pages = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                const { tasks, total, currentPage } = action.payload;
                state.pages[currentPage] = tasks;
                state.total = total;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tasks';
            })
            .addCase(addTask.fulfilled, (state) => {
                state.pages = {};
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const taskId = action.payload;
                for (const page in state.pages) {
                    state.pages[page] = state.pages[page].filter((task) => task.id !== taskId);
                }
            })
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                for (const page in state.pages) {
                    const taskIndex = state.pages[page].findIndex(task => task.id === updatedTask.id);
                    if (taskIndex > -1) {
                        state.pages[page][taskIndex] = updatedTask;
                        break;
                    }
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update task';
            });
    },
});

export const { resetTaskPages } = tasksSlice.actions;
export default tasksSlice.reducer;
