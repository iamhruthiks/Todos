import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllTodos from "./pages/AllTodos";
import TodoDetails from "./pages/TodoDeatils";
import DashBoard from "./pages/Dashboard";
import CreateTodo from "./pages/CreateTodo";
import Footer from "./components/Footer";

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
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/create" element={<CreateTodo />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
