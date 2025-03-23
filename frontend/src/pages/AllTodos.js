import React, { useEffect, useState } from "react";
import { fetchAllTodos } from "../services/Api";

const AllTodos = () => {
  const [todos, setTodos] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const gradients = [
    "linear-gradient(to right, #2193b0, #6dd5ed)",
    "linear-gradient(to right, #e9b7ce, #d3f3f1)",
    "linear-gradient(to right, #f9cdc3, #f6c0ba)",
    "linear-gradient(to right, #f18158, #ffcba0)",
    "linear-gradient(to right, #ef709b, #fa9372)",
  ];
  const getRandomGradient = () =>
    gradients[Math.floor(Math.random() * gradients.length)];

  // fetch todos with filters
  const getTodos = async (priority = null, tags = "", users = "") => {
    const filters = {};
    if (priority) filters.priority = priority;
    if (tags) filters.tags = tags;
    if (users) filters.assignedTo = users;

    const fetchedTodos = await fetchAllTodos(filters);
    setTodos(fetchedTodos);

    // populate tags and users
    if (!allTags.length && !allUsers.length) {
      const uniqueTags = [
        ...new Set(fetchedTodos.flatMap((todo) => todo.tags)),
      ];
      const uniqueUsers = [
        ...new Set(fetchedTodos.flatMap((todo) => todo.assignedUsers)),
      ];
      setAllTags(uniqueTags);
      setAllUsers(uniqueUsers);
    }
  };

  useEffect(() => {
    getTodos(); // fetch all todos initially
  }, []);

  // handle priority filter
  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
    getTodos(priority, selectedTags.join(","), selectedUsers.join(","));
  };

  // handle tag selection
  const handleTagToggle = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    getTodos(
      selectedPriority,
      newSelectedTags.join(","),
      selectedUsers.join(",")
    );
  };

  // handle user selection
  const handleUserToggle = (user) => {
    const newSelectedUsers = selectedUsers.includes(user)
      ? selectedUsers.filter((u) => u !== user)
      : [...selectedUsers, user];
    setSelectedUsers(newSelectedUsers);
    getTodos(
      selectedPriority,
      selectedTags.join(","),
      newSelectedUsers.join(",")
    );
  };

  return (
    <div className="container mt-4">
      {/* priority filters */}
      <div className="row d-flex justify-content-center align-items-center mb-4">
        <div
          className={`col priority-label bg-primary text-white ms-3 ${
            selectedPriority === null ? "selected" : ""
          }`}
          onClick={() => handlePriorityClick(null)}
        >
          All Todos
        </div>
        <div
          className={`col priority-label low ${
            selectedPriority === "low" ? "selected" : ""
          }`}
          onClick={() => handlePriorityClick("low")}
        >
          Low
        </div>
        <div
          className={`col priority-label medium ${
            selectedPriority === "medium" ? "selected" : ""
          }`}
          onClick={() => handlePriorityClick("medium")}
        >
          Medium
        </div>
        <div
          className={`col priority-label high me-3 ${
            selectedPriority === "high" ? "selected" : ""
          }`}
          onClick={() => handlePriorityClick("high")}
        >
          High
        </div>
      </div>

      {/* tag & assigned user filters */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary text-start dropdown-toggle w-100"
              type="button"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            >
              {selectedTags.length > 0
                ? `Selected Tags: ${selectedTags.join(", ")}`
                : "Filter by Tag"}
            </button>
            <ul
              className={`dropdown-menu ${isTagDropdownOpen ? "show" : ""}`}
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {allTags.map((tag) => (
                <li key={tag} className="dropdown-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      id={`tag-${tag}`}
                    />
                    <label className="form-check-label" htmlFor={`tag-${tag}`}>
                      {tag}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary text-start dropdown-toggle w-100"
              type="button"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              {selectedUsers.length > 0
                ? `Assigned To: ${selectedUsers.join(", ")}`
                : "Filter by Assigned User"}
            </button>
            <ul
              className={`dropdown-menu ${isUserDropdownOpen ? "show" : ""}`}
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {allUsers.map((user) => (
                <li key={user} className="dropdown-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={user}
                      checked={selectedUsers.includes(user)}
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
        </div>
      </div>

      {/* display todos */}
      <div className="row">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo._id} className="col-md-4">
              <div
                className="card mb-5"
                style={{ background: getRandomGradient() }}
              >
                <div className="card-body">
                  <h5 className="card-title">{todo.title}</h5>
                  <h6 className={`card-subtitle mb-2 text-${todo.priority}`}>
                    Priority: {todo.priority}
                  </h6>
                  <h6
                    className={`card-subtitle mb-2 ${
                      todo.completed ? "text-success" : "text-danger"
                    }`}
                  >
                    Status: {todo.completed ? "Completed" : "Not Completed"}
                  </h6>
                  <p className="card-text">
                    <strong>Created By:</strong>{" "}
                    {todo.userId?.username || "Not Found"}
                  </p>
                  <p className="card-text">
                    <strong>Tags:</strong> {todo.tags.join(", ") || "No Tags"}
                  </p>
                  <p className="card-text">
                    <strong>Assigned To:</strong>{" "}
                    {todo.assignedUsers.join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(todo.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <button className="btn btn-primary">View</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-4">
            <h4 className="text-muted">No Todos Found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTodos;
