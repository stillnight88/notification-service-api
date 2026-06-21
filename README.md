# Notification Service API

A backend service built with Node.js, Express, and MongoDB for managing user notifications and email delivery.

This project was created while learning backend development concepts such as notification workflows, email integration, notification lifecycle management, authentication, and service-oriented API design.

---

## Project Context

The primary goal of this project was exploring how notification systems operate beyond simple CRUD operations.

The application stores notifications, tracks notification status, delivers email notifications, and automatically manages notification lifecycle through expiration policies.

Key concepts explored include:

* Notification workflows
* Email delivery
* Read-status tracking
* Notification lifecycle management
* JWT authentication
* MongoDB indexing strategies
* Service-oriented backend design

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes

### Notification Management

* Create notifications programmatically
* Retrieve user notifications
* Mark notifications as read
* Track read timestamps
* Notification categorization
* Priority-based notifications

### Email Delivery

* Email notifications using Nodemailer
* HTML email templates
* Email validation
* Connection verification

### Notification Lifecycle

* Automatic notification expiration
* TTL-based cleanup
* Read/unread tracking
* Notification metadata support

### Security

* JWT authentication
* Helmet security middleware
* Response compression
* Protected notification routes

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt
* Helmet

### Email Delivery

* Nodemailer

### Performance

* Compression

### Validation

* validator.js

---

## Project Structure

```text
controllers/      Authentication and notification logic
middleware/       Authentication middleware
models/           User and notification schemas
routes/           Authentication and notification routes
services/         Email delivery service
utils/            Notification triggers and response helpers
app.js            Express application configuration
server.js         Server startup and graceful shutdown handling
```

---

## Installation

### Prerequisites

* Node.js
* MongoDB Atlas account or local MongoDB instance
* SMTP provider credentials

### Clone the Repository

```bash
git clone <repository-url>
cd notification-service-api
```

### Install Dependencies

```bash
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values for your environment.

Refer to `.env.example` for the complete list of required configuration variables.

### Start the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Notification Workflow

The service follows a notification pipeline:

```text
Application Event
        ↓
Trigger Notification
        ↓
Store Notification
        ↓
Send Email
        ↓
Track Read Status
        ↓
Automatic Expiration
```

Notifications are persisted in MongoDB and can optionally trigger email delivery to the associated user.

---

## Notification Types

The system supports:

```text
order
system
message
promotion
reminder
```

Notifications can also be assigned priority levels:

```text
low
medium
high
urgent
```

---

## API Overview

### Authentication Routes

```http
POST /api/auth/signup
POST /api/auth/login
```

### Notification Routes

```http
GET   /api/notifications
PATCH /api/notifications/:id/read
```

Authenticated users can retrieve their notifications and update notification status.

---

## Email Integration

Email notifications are delivered using Nodemailer through a configurable SMTP provider.

The email service includes:

* SMTP connection verification
* Email address validation
* HTML email templates
* Connection pooling
* Basic delivery error handling

---

## Lifecycle Management

Notifications support automatic lifecycle management through MongoDB TTL indexes.

This allows expired notifications to be automatically removed without requiring manual cleanup jobs.

---

## Limitations

This repository reflects an early learning project and intentionally focuses on notification-related backend concepts.

Current limitations include:

* No automated test suite
* No notification queue system
* No retry mechanism for failed email delivery
* No push notification support
* No WebSocket or real-time delivery
* No background job processing
* No API documentation (Swagger/OpenAPI)
* Limited production hardening

---

## Repository Status

This repository is preserved as a learning project demonstrating:

* Notification service design
* Email delivery workflows
* Read-status tracking
* Notification lifecycle management
* JWT authentication
* MongoDB indexing and TTL expiration
* Graceful application shutdown

The project is not actively maintained and primarily serves as a reference for the backend concepts explored during development.
