import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllTodos from "./pages/AllTodos";
import TodoDetails from "./pages/TodoDeatils";
import Profile from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<AllTodos />} />
          <Route path="/todos/:id" element={<TodoDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
