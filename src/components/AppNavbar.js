import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import './styles/AppNavbar.css';

const AppNavbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, email } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Navbar bg="light" expand="lg" className="navbar-custom fixed-top">
            <Container>
                <Navbar.Brand href="#home" className="navbar-brand">Task Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {isAuthenticated && (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" id="dropdown-basic" className="account-icon">
                                    <FaUser size={24} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item disabled>Logged in as: <strong>{email}</strong></Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout} className="logout-item">
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
