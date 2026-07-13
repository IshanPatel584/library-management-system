# 📚 Library Management System

A full-stack **Library Management System** built using **Node.js, Express.js, MongoDB, JWT Authentication, and EJS**.
The system allows users to browse and borrow books while providing admins with a complete dashboard to manage books, users, and borrowing activities.

## 🚀 Features

### Authentication & User Management

- User Signup
- User Login / Logout
- JWT-based Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-based access (Admin/User)

### 📖 Book Management

- Add Books
- View Available Books
- Edit Books
- Delete Books
- Manage book quantity
- Search books

### 🔄 Borrow & Return System

- Borrow books
- Return books
- Track borrowed date
- Track due date
- Track returned date
- Manage borrowing history
- Handle unavailable/out-of-stock books

### 🛠 Admin Dashboard

- Admin authentication
- View and manage users
- Manage books
- Manage borrow/return records
- Control library operations through admin panel

### 🎨 UI Improvements

- Responsive user interface
- Modern dashboard design
- Improved navigation and user experience

## 🛠 Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- JSON Web Token (JWT)
- bcrypt
- Cookie Parser
- HTML
- CSS
- JavaScript

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/IshanPatel584/library-management-system.git
```

### Go to the project folder

```bash
cd library-management-system
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Start MongoDB

Make sure MongoDB is running locally or use MongoDB Atlas.

### Run the application

Using Node:

```bash
node app.js
```

or using nodemon:

```bash
nodemon app.js
```

Open your browser:

```
http://localhost:5000
```

## 📂 Project Structure

```
├── controllers
├── middleware
├── models
├── public
├── routes
├── views
├── app.js
├── package.json
└── README.md
```

## 🔮 Future Improvements

- Book image upload
- Email notifications for due dates
- Fine calculation for late returns
- Advanced search and filtering
- Deployment with cloud hosting
- API documentation

## 👨‍💻 Author

**Ishan Patel**
