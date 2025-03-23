import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllTodos, deleteTodo } from "../services/Api";
import toast from "react-hot-toast";

const DashBoard = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("createdByMe");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const navigate = useNavigate();

  const gradients = [
    "linear-gradient(to right, #2193b0, #6dd5ed)",
    "linear-gradient(to right, #e9b7ce, #d3f3f1)",
    "linear-gradient(to right, #f9cdc3, #f6c0ba)",
    "linear-gradient(to right, #f18158, #ffcba0)",
    "linear-gradient(to right, #ef709b, #fa9372)",
  ];
  const getRandomGradient = () =>
    gradients[Math.floor(Math.random() * gradients.length)];

  // fetch todos and filter based on selection
  const getTodos = async () => {
    let fetchedTodos = [];
    if (filter === "createdByMe") {
      const filters = { user: currentUser._id };
      fetchedTodos = await fetchAllTodos(filters);
    } else if (filter === "assignedToMe") {
      const filters = { assignedTo: `@${currentUser.username}` };
      fetchedTodos = await fetchAllTodos(filters);
    }
    setTodos(fetchedTodos || []);
  };

  // fetch todos when filter or currentUser changes
  useEffect(() => {
    getTodos();
  }, [filter, currentUser]);

  // listen for storage changes to update currentUser
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // handle delete
  const handleDelete = async (todoId) => {
    const result = await deleteTodo(todoId, currentUser._id);
    if (result) {
      toast.success("Todo deleted successfully!", { duration: 3000 });
      setTodos(todos.filter((todo) => todo._id !== todoId));
    } else {
      toast.error("Failed to delete todo!");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="text-strat">Name: {currentUser.username}</h4>
      <h4 className="mb-5 mb-md-1 text-strat">email: {currentUser.email}</h4>
      <h2 className="mb-4 text-center">My Todo</h2>
      {/* filter buttons*/}
      <div className="row justify-content-center mb-4">
        <div className="col-auto">
          <button
            className={`btn ${
              filter === "createdByMe" ? "btn-primary" : "btn-outline-primary"
            } mx-2`}
            onClick={() => handleFilterChange("createdByMe")}
          >
            Created By Me
          </button>
          <button
            className={`btn ${
              filter === "assignedToMe"
                ? "btn-secondary"
                : "btn-outline-secondary"
            } mx-2`}
            onClick={() => handleFilterChange("assignedToMe")}
          >
            Assigned To Me
          </button>
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
                    Status:{" "}
                    {todo.completed ? "✅ Completed" : "❌ Not Completed"}
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/todos/${todo._id}`)}
                    >
                      View
                    </button>
                    {currentUser?._id === todo.userId?._id && (
                      <>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(todo._id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
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

export default DashBoard;
