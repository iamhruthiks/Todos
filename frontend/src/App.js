import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllTodos from "./pages/AllTodos";
import TodoDetails from "./pages/TodoDeatils";

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
