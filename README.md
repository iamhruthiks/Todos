# 📁 Project Title: Todos

## 💡 Overview

**Todos** is a full-featured task management application built with the MERN stack. It allows users to manage their daily tasks, collaborate with others, and organize work efficiently with sorting, filtering, notes, and export features.

---

## ✨ Features

- **CRUD Operations**: Create, read, update, and delete todos.
- **Switch Users**: Seamlessly switch between five different users.
- **Sorting**: Sort todos by priority.
- **Filtering**: Filter by tags and assigned users.
- **Notes Modal**: Add notes to each todo using a modal.
- **User Dashboard**: View todos created by or assigned to the current user.
- **Export Data**: Download todos in JSON or CSV format.
- **Swagger UI**: Explore API documentation via Swagger.
  
---

## 🛠️ Tech Stack Used

- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Others**: Axios, React Router, Swagger

---

## 🚀 How to Run the Application

### Prerequisites

- Node.js (v16 or later)
- MongoDB (local or cloud)
- npm

### **Open your terminal or command prompt.**

### Clone the Repository

```bash
git clone https://github.com/iamhruthiks/Todos.git
```

### Backend Setup

### Navigate inside Backend Directory
```bash
cd Todos/backend
```

### Set up environment variables
Create a `.env` file in the root directory of the backend folder and add the following environment variables:
```bash
MONGO_URI=<your_mongodb_uri>
```

### Seed initial data (optional)
```bash
npm run seed
```

### Start the Backend Server

```bash
npm run start
```

### Access the Backend Server

- Base URL: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/api-docs`

### Frontend Setup

### Navigate inside Frontend Directory
```bash
cd Todos/frontend
```

### Set up environment variables
Create a `.env` file in the root directory of the frontend folder and add the following environment variables:
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

### Start the Frontend App

```bash
npm run start
```

### Access the frontend App

- Base URL: `http://localhost:3000`

---

## 📁 Project Structure

- `backend`
  - `config`
  - `controllers`
  - `models` 
  - `routes`
  - `scripts`
  - `security`
- `frontend`
   - `public`
   - `src`
     - `components`
     - `pages`
     - `services`
---

## 🌐 Deployment

- 🌱 Both the frontend and backend are deployed on **Vercel**.
- 🔴 Live App: https://todosapp-flax.vercel.app
---

## 📷 Screenshots
<img width="959" alt="home" src="https://github.com/user-attachments/assets/429c7e4d-11bf-4d51-ba2e-c5a4bac9b8cd" /><hr>
<img width="959" alt="all todos" src="https://github.com/user-attachments/assets/50af8719-c044-422e-81e6-50cded7936ff" /><hr>
<img width="959" alt="filter" src="https://github.com/user-attachments/assets/00a7f183-79c7-4879-adc5-1b7235ebf766" /><hr>
<img width="959" alt="read" src="https://github.com/user-attachments/assets/b9fff489-4f52-479b-b483-8f9297a946d7" /><hr>
<img width="959" alt="create" src="https://github.com/user-attachments/assets/7673131d-9285-4400-9a28-aef69877ee76" /><hr>
<img width="959" alt="note" src="https://github.com/user-attachments/assets/7140b3f2-c9f2-4874-8704-8367df47f63a" /><hr>
<img width="959" alt="update" src="https://github.com/user-attachments/assets/bbb75a34-79f2-46fb-9c39-9b07dca084dd" /><hr>
<img width="955" alt="create by me" src="https://github.com/user-attachments/assets/46473d94-0895-4627-880c-f47bcc65a19e" /><hr>
<img width="959" alt="assigned to me" src="https://github.com/user-attachments/assets/8ef8f382-4d30-4867-a205-3976dd71fa66" /><hr>
<img width="959" alt="users" src="https://github.com/user-attachments/assets/154d2d92-c0bb-4d63-bc37-3072bf5cd663" /><hr>
<img width="959" alt="export data" src="https://github.com/user-attachments/assets/767eb98c-d88a-4ca3-9884-a1a98e66c49e" /><hr>
<img width="959" alt="responsive design 1" src="https://github.com/user-attachments/assets/644a25b1-b503-4814-95ce-33e09139b8c8" /><hr>
<img width="959" alt="responsive design 2" src="https://github.com/user-attachments/assets/47d5c768-fc2f-440a-9ee3-fd833496a2d7" /><hr>
<img width="959" alt="backend" src="https://github.com/user-attachments/assets/4fbfb4e6-1761-4223-8bbd-f3f859b44603" />

---

## Author

[Hruthik S](https://github.com/iamhruthiks)

---

## Contact

For questions or support, please connect with me on [LinkedIn](https://www.linkedin.com/in/hruthiks).
