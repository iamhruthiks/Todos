import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchUsers, exportTodos } from "../services/Api";

const Navbar = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  });

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);

      // auto select the first user if none selected
      if (!currentUser && fetchedUsers.length > 0) {
        const firstUser = fetchedUsers[0];
        setCurrentUser(firstUser);
        localStorage.setItem("currentUser", JSON.stringify(firstUser));
        window.dispatchEvent(new Event("storage"));
      }
    };
    getUsers();
  }, []);

  // handel user switching
  const handleUserSelect = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));
  };

  // handle export todos
  const handleExport = (format) => {
    exportTodos(format);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Todos
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav center-nav">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/todos"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                All Todos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Create Todo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Export
              </a>
              <ul
                className="dropdown-menu"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a
                    role="button"
                    className="dropdown-item"
                    onClick={() => {
                      handleExport("json");
                    }}
                  >
                    JSON
                  </a>
                </li>
                <li>
                  <a
                    role="button"
                    className="dropdown-item"
                    onClick={() => {
                      handleExport("csv");
                    }}
                  >
                    CSV
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav right-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentUser ? `User: ${currentUser.username}` : "Switch User"}
              </a>
              <ul className="dropdown-menu dropdown-menu-switchuser">
                {users.map((user) => (
                  <li key={user._id}>
                    <a
                      role="button"
                      className="dropdown-item"
                      onClick={() => handleUserSelect(user)}
                    >
                      {user.username}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
