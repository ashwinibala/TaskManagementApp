import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { fetchTasks } from '../features/tasks/tasksSlice';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
    const { loading: tasksLoading } = useSelector((state) => state.tasks);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchTasks());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        if (isAuthenticated && !tasksLoading) {
            navigate('/tasks');
        }
    }, [isAuthenticated, tasksLoading, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit} className="mt-4 mx-auto" style={{ maxWidth: '400px' }}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
        </div>
    );
}

export default Login;
