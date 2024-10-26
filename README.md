# Task Management App

## Overview

This is the frontend component of a task management application. Built using React and Bootstrap, it provides a user-friendly interface for managing tasks, allowing users to create, edit, and categorize tasks seamlessly.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- User-friendly interface for task management
- Create, read, update, and delete tasks
- Drag-and-drop functionality for task organization
- Task categorization by status (Pending, In Progress, Completed)
- Responsive design with Bootstrap

## Technologies Used

- **Frontend**: React, React-Bootstrap, react-beautiful-dnd
- **Docker**: For containerization

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (for local development)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Clone the Repository

```bash
git clone https://github.com/ashwinibala/task-management-app.git
cd task-management-app
```

## Running the Application

### Using Docker
- Build and Run the Container
    - From the root of the project, run:

```bash
docker-compose up --build
```
    - This command builds the Docker image and starts the application.

- Access the Application
    - Open your browser and go to http://localhost:3000.

### Local Development
- If you prefer to run the app locally without Docker:
    - Install the dependencies:

```bash
npm install
```

    - Start the development server:

```bash
npm start
```

    - Open your browser and navigate to http://localhost:3000.

### Environment Variables
- To configure the backend API URL, create a .env file in the root of the project and add the following:

```bash
REACT_APP_API_URL=http://localhost:8080 # Or use the Docker service name when running with Docker
```