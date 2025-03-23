import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTodoById, fetchUsers } from "../services/Api";

const TodoDetails = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  useEffect(() => {
    const getTodo = async () => {
      const fetchedTodo = await fetchTodoById(id);
      setTodo(fetchedTodo);
    };

    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    getTodo();
    getUsers();
  }, [id]);

  // listen for user switch to update UI instantly
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!todo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">{todo.title}</h3>
          <p className="card-text">
            <strong>Description:</strong> {todo.description}
          </p>
          <p className={`card-subtitle mb-2 text-${todo.priority}`}>
            Priority: {todo.priority}
          </p>
          <h6
            className={`card-subtitle mb-2 ${
              todo.completed ? "text-success" : "text-danger"
            }`}
          >
            Status: {todo.completed ? "✅ Completed" : "❌ Not Completed"}
          </h6>
          <p className="card-text">
            <strong>Created By:</strong> {todo.userId?.username || "Not Found"}
          </p>
          <p className="card-text">
            <strong>Tags:</strong>{" "}
            {todo.tags.length ? todo.tags.join(", ") : "No Tags"}
          </p>
          <p className="card-text">
            <strong>Assigned Users:</strong>{" "}
            {todo.assignedUsers.length ? todo.assignedUsers.join(", ") : "None"}
          </p>
          <p className="card-text">
            <strong>Created:</strong>{" "}
            {new Date(todo.createdAt).toLocaleDateString("en-GB")}
          </p>
          <p className="card-text">
            <strong>Updated:</strong>{" "}
            {new Date(todo.updatedAt).toLocaleDateString("en-GB")}
          </p>

          {/* notes section */}
          <h6>📝 Notes:</h6>
          {todo.notes.length > 0 ? (
            <ul className="list-group">
              {todo.notes.map((note) => (
                <li key={note._id} className="list-group-item">
                  {note.content}{" "}
                  <span className="text-muted">({note.date})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notes available</p>
          )}

          {/* show Edit button only if current user is the creator */}
          {currentUser?._id === todo.userId?._id && (
            <button className="btn btn-warning mt-3">✏️ Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;
