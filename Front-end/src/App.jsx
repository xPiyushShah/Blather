import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/SignUp";
import Room from "./Pages/Room";
import "./App.css";
import { authStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { isCheckingAuth, authUser, checkAuth, onlineUser } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log("On", {onlineUser});
  // console.log("Otn", {authUser});

  if (isCheckingAuth && !authUser) {
    // if (true) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur z-50">
        <span className="loading loading-spinner loading-xl text-accent"></span>
      </div>
    );
  }
  // console.log("heyd", authUser);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
            // element={<Home />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!authUser ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/room/:id"
            element={authUser ? <Room /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="left-center" reverseOrder={true} />
    </>
  );
}

export default App;
