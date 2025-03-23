import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AllTodos from "./pages/AllTodos";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<AllTodos />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
