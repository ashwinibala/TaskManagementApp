import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './styles/AppNavbar.css';

const AppNavbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, email } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Navbar bg="light" expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand href="#home" className="navbar-brand">Task Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {isAuthenticated && email && (
                            <Nav.Item className="nav-item">Logged in as: <strong>{email}</strong></Nav.Item>
                        )}
                        {isAuthenticated && (
                            <Nav.Item>
                                <button onClick={handleLogout} className="btn btn-danger btn-logout">
                                    Logout
                                </button>
                            </Nav.Item>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
