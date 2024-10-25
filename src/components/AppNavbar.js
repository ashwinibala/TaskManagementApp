import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, email } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Task Management</Navbar.Brand>
                <Nav className="ml-auto">
                    {isAuthenticated && email && (
                        <Nav.Item className="mr-3">Logged in as: {email}</Nav.Item>
                    )}
                    {isAuthenticated && (
                        <Nav.Item>
                            <button onClick={handleLogout} className="btn btn-danger">
                                Logout
                            </button>
                        </Nav.Item>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
