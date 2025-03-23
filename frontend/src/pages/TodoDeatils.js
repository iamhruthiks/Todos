import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTodoById, fetchUsers, updateTodo } from "../services/Api";
import toast, { Toaster } from "react-hot-toast";

const TodoDetails = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState({});
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    // get the todo by id
    const getTodo = async () => {
      const fetchedTodo = await fetchTodoById(id);
      console.log("Fetched Todo:", fetchedTodo);
      setTodo(fetchedTodo);
      setUpdatedTodo(fetchedTodo);
    };

    // get all users from db
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      const formattedUsers = fetchedUsers.map((user) => `@${user.username}`);
      setUsers(formattedUsers);
    };

    getTodo();
    getUsers();
  }, [id]);

  useEffect(() => {
    // handel switching the user
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // handel edit click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // handel input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTodo((prev) => ({ ...prev, [name]: value }));
  };

  // handel task status change
  const handleCompletedChange = (e) => {
    setUpdatedTodo((prev) => ({ ...prev, completed: e.target.checked }));
  };

  // handel tag change
  const handleTagChange = (index, value) => {
    const newTags = [...updatedTodo.tags];
    newTags[index] = value;
    setUpdatedTodo((prev) => ({ ...prev, tags: newTags }));
  };

  const handleAddTag = () => {
    setUpdatedTodo((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
  };

  const handleDeleteTag = (index) => {
    const newTags = updatedTodo.tags.filter((_, i) => i !== index);
    setUpdatedTodo((prev) => ({ ...prev, tags: newTags }));
  };

  const handleUserToggle = (user) => {
    const newAssignedUsers = updatedTodo.assignedUsers.includes(user)
      ? updatedTodo.assignedUsers.filter((u) => u !== user)
      : [...updatedTodo.assignedUsers, user];
    setUpdatedTodo((prev) => ({ ...prev, assignedUsers: newAssignedUsers }));
  };

  // save the changes in the db
  const handleSave = async () => {
    const payload = {
      ...updatedTodo,
      tags: updatedTodo.tags.filter((tag) => tag.trim().length > 0),
      userId: currentUser._id,
    };
    const updatedTodoResponse = await updateTodo(id, payload);
    setTodo(updatedTodoResponse);
    setUpdatedTodo(updatedTodoResponse);
    setIsEditing(false);
    toast.success("Todo updated successfully!", {
      duration: 3000,
    });
  };

  if (!todo) {
    return <div>loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={updatedTodo.title}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              todo.title
            )}
          </h3>
          <p className="card-text">
            <strong>Description:</strong>{" "}
            {isEditing ? (
              <textarea
                name="description"
                value={updatedTodo.description || ""}
                onChange={handleInputChange}
                className="form-control"
              />
            ) : (
              todo.description || "No description"
            )}
          </p>
          <p className="card-text">
            {isEditing ? (
              <select
                name="priority"
                value={updatedTodo.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <strong className={`text-${todo.priority}`}>
                Priority: {todo.priority}
              </strong>
            )}
          </p>
          <p className="card-text">
            {isEditing ? (
              <div className="form-check">
                <input
                  type="checkbox"
                  name="completed"
                  checked={updatedTodo.completed}
                  onChange={handleCompletedChange}
                  className="form-check-input"
                  id="completed"
                />
                <label className="form-check-label" htmlFor="completed">
                  Completed
                </label>
              </div>
            ) : (
              <strong
                className={todo.completed ? "text-success" : "text-danger"}
              >
                Status: {todo.completed ? "✅ Completed" : "❌ Not Completed"}
              </strong>
            )}
          </p>
          <p className="card-text">
            <strong>Tags:</strong>{" "}
            {isEditing ? (
              <div>
                {updatedTodo.tags.map((tag, index) => (
                  <div key={index} className="d-flex mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      className="form-control me-2"
                      placeholder={`Tag ${index + 1}`}
                    />
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTag(index)}
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={handleAddTag}
                >
                  ➕ Add Tag
                </button>
              </div>
            ) : todo.tags.length ? (
              todo.tags.join(", ")
            ) : (
              "No tags"
            )}
          </p>
          <p className="card-text">
            <strong>Assigned Users:</strong>{" "}
            {isEditing ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle w-100"
                  type="button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {updatedTodo.assignedUsers.length > 0
                    ? `Assigned: ${updatedTodo.assignedUsers.join(", ")}`
                    : "Select Users"}
                </button>
                <ul
                  className={`dropdown-menu ${
                    isUserDropdownOpen ? "show" : ""
                  }`}
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {users.map((user) => (
                    <li key={user} className="dropdown-item">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={user}
                          checked={updatedTodo.assignedUsers.includes(user)}
                          onChange={() => handleUserToggle(user)}
                          id={`user-${user}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`user-${user}`}
                        >
                          {user}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : todo.assignedUsers.length ? (
              todo.assignedUsers.join(", ")
            ) : (
              "None"
            )}
          </p>
          <p className="card-text">
            <strong>Created By:</strong> {todo.userId?.username || "Not found"}
          </p>
          <p className="card-text">
            <strong>Created:</strong>{" "}
            {new Date(todo.createdAt).toLocaleDateString("en-GB")}
          </p>
          <p className="card-text">
            <strong>Updated:</strong>{" "}
            {new Date(todo.updatedAt).toLocaleDateString("en-GB")}
          </p>

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

          {currentUser?._id === todo.userId?._id &&
            (isEditing ? (
              <button className="btn btn-success mt-3" onClick={handleSave}>
                ✅ Save
              </button>
            ) : (
              <button
                className="btn btn-warning mt-3"
                onClick={handleEditClick}
              >
                ✏️ Edit
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;
