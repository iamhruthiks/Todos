import React, { useEffect, useState } from "react";
import { fetchAllTodos } from "../services/Api";

const AllTodos = () => {
  const [todos, setTodos] = useState([]);
  const gradients = [
    "linear-gradient(to right, #2193b0, #6dd5ed)",
    "linear-gradient(to right, #e9b7ce, #d3f3f1)",
    "linear-gradient(to right, #f9cdc3, #f6c0ba)",
    "linear-gradient(to right, #f18158, #ffcba0)",
    "linear-gradient(to right, #ef709b, #fa9372)",
  ];
  const getRandomGradient = () =>
    gradients[Math.floor(Math.random() * gradients.length)];

  useEffect(() => {
    const getTodos = async () => {
      const fetchedTodos = await fetchAllTodos();
      setTodos(fetchedTodos);
    };

    getTodos();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {todos.map((todo) => (
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
                <p className="card-text">
                  <strong>Created By:</strong>{" "}
                  {todo.userId.username || "Not Found"}
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
        ))}
      </div>
    </div>
  );
};

export default AllTodos;
