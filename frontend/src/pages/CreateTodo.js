import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTodo, fetchUsers } from "../services/Api";
import toast, { Toaster } from "react-hot-toast";

const CreateTodo = () => {
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    priority: "low",
    tags: [],
    assignedUsers: [],
    notes: [],
  });
  const [newTag, setNewTag] = useState("");
  const [newNote, setNewNote] = useState({ content: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const navigate = useNavigate();

  // fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      setAllUsers(users.map((user) => user.username));
    };
    loadUsers();
  }, []);

  // listen for storage changes to update currentUser
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTodoData((prev) => ({ ...prev, [name]: value }));
  };

  // handle tag change
  const handleTagChange = (e) => {
    setNewTag(e.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !todoData.tags.includes(newTag.trim())) {
      setTodoData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTodoData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleUserToggle = (username) => {
    const newAssignedUsers = todoData.assignedUsers.includes(username)
      ? todoData.assignedUsers.filter((u) => u !== username)
      : [...todoData.assignedUsers, username];
    setTodoData((prev) => ({ ...prev, assignedUsers: newAssignedUsers }));
  };

  // handle notes change
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNote = () => {
    if (!newNote.content) {
      toast.error("Please enter note content!");
      return;
    }
    const noteData = {
      content: newNote.content,
      date: new Date().toISOString().split("T")[0],
    };
    setTodoData((prev) => ({ ...prev, notes: [...prev.notes, noteData] }));
    setNewNote({ content: "" });
    toast.success("Note added to todo!");
  };

  // send the post request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: todoData.title,
      description: todoData.description,
      priority: todoData.priority,
      tags: todoData.tags,
      assignedUsers: todoData.assignedUsers, // Already includes @ prefixes
      notes: todoData.notes,
      userId: currentUser._id, // Explicitly send current user's ID
    };

    const result = await createTodo(payload);
    if (result) {
      toast.success("Todo created successfully!", { duration: 3000 });
      navigate("/dashboard");
    } else {
      toast.error("Failed to create todo!");
    }
  };

  return (
    <div className="container mt-4">
      <Toaster />
      <h2>Create a New Todo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={todoData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={todoData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            className="form-select"
            id="priority"
            name="priority"
            value={todoData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              value={newTag}
              onChange={handleTagChange}
              placeholder="Add a tag..."
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddTag}
            >
              ➕ Add
            </button>
          </div>
          <div>
            {todoData.tags.map((tag) => (
              <span key={tag} className="badge bg-secondary me-1 mb-1">
                {tag}{" "}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-1"
                  onClick={() => handleRemoveTag(tag)}
                ></button>
              </span>
            ))}
          </div>
        </div>
        {/* assigned users*/}
        <div className="mb-3">
          <label className="form-label">Assigned Users</label>
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary text-start dropdown-toggle w-100"
              type="button"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              {todoData.assignedUsers.length > 0
                ? `Selected: ${todoData.assignedUsers.join(", ")}`
                : "Select Users"}
            </button>
            <ul
              className={`dropdown-menu ${isUserDropdownOpen ? "show" : ""}`}
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {allUsers.map((username) => (
                <li key={username} className="dropdown-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={username}
                      checked={todoData.assignedUsers.includes(username)} // No @ prefix
                      onChange={() => handleUserToggle(username)}
                      id={`user-${username}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`user-${username}`}
                    >
                      {username}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2">
            {todoData.assignedUsers.map((user) => (
              <span key={user} className="badge bg-secondary me-1 mb-1">
                {user}{" "}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-1"
                  onClick={() => handleUserToggle(user)} // No @ prefix needed
                ></button>
              </span>
            ))}
          </div>
        </div>
        {/* notes section */}
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <br />
          <button
            type="button"
            className="btn btn-primary mb-2"
            data-bs-toggle="modal"
            data-bs-target="#addNoteModal"
          >
            ➕ Add Note
          </button>
          {todoData.notes.length > 0 && (
            <ul className="list-group mb-2">
              {todoData.notes.map((note, index) => (
                <li key={index} className="list-group-item">
                  {note.content} (
                  {new Date(note.date).toLocaleDateString("en-GB")})
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* modal for adding */}
        <div
          className="modal fade"
          id="addNoteModal"
          tabIndex="-1"
          aria-labelledby="addNoteModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addNoteModalLabel">
                  Add a Note
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="noteContent" className="form-label">
                    Note Content
                  </label>
                  <textarea
                    className="form-control"
                    id="noteContent"
                    name="content"
                    value={newNote.content}
                    onChange={handleNoteChange}
                    placeholder="Write your note here..."
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddNote}
                  data-bs-dismiss="modal"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-success mb-5">
          Create Todo
        </button>
      </form>
    </div>
  );
};

export default CreateTodo;
