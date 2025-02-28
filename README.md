# Villa Booking Application

Welcome to the Villa Booking Application! This project allows users to book villas for their vacations. The application provides a platform where users can search, book, and manage their bookings. The platform also includes admin functionality to manage bookings, villa details, and user feedback.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation Guide](#installation-guide)
- [How to Run](#how-to-run)
- [Usage](#usage)

---

## Features

### User Features:
- Browse available villas.
- Search villas by title and address.
- Book villas for specific dates.
- View booking details.
- Manage user profile and contact information.

### Villa Owner Features:
- Manage villas (add/edit/remove).
- View and manage all bookings.
- Handle user feedback.
- View booking statistics.

### Admin Features:
- Manage villas (edit/remove).
- View and manage all bookings.
- Handle user feedback.
- View booking statistics.
- View user statistics.

### Authentication:
- User login and registration.
- Role-based access (admin, user, villa owner).

---

## Technologies Used

- **Frontend**:
  - React.js (for building the UI)
  - React Router (for page navigation)
  - Axios (for HTTP requests)
  - Tailwind CSS (for styling)

- **Backend**:
  - Node.js (server-side JavaScript)
  - Express.js (for REST API)
  - MongoDB (for database)

- **Others**:
  - Date-fns (for date manipulation)
  - JWT (for user authentication)
  - Cloudinary (for image uploads)

---

## Installation Guide

Follow these steps to set up the project locally:

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/villa-booking.git
cd villa-booking
```

### 2. Install dependencies:

#### For Frontend:

```bash
cd client
npm install
```

#### For Backend:

```bash
cd backend
npm install
```

---

## How to Run

### 1. Running the Backend:

```bash
cd backend
npm start
```

### 2. Running the Frontend:

```bash
cd client
npm run dev
```

---

## Usage

### 1. User
- Sign up or log in to the application.
- Browse and search for villas.
- Select a villa and choose available dates for booking.
- Manage bookings and view details.
- Update profile information.

### 2. Villa Owner
- Log in to the system.
- Add, edit, or remove villa listings.
- Manage bookings received from users.
- Respond to user feedback.

### 3. Admin
- Manage all villa listings.
- View and handle bookings.
- Oversee user feedback and interactions.
- View statistics related to users and bookings.

