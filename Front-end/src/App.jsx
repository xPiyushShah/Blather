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
import Setting from "./Pages/Settings";
import Loader from "./utils/Loader";
import "./App.css";
import { authStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";

function App() {
  const { isCheckingAuth, authUser, checkAuth, onlineUser,err } = authStore();
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setMinDelayPassed(true);
    }, 8000);
    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && authUser && minDelayPassed) {
      setShouldShowLoader(false);
    }
    if (err == false) {
      setShouldShowLoader(false);
    }
    // console.log(err);
  }, [isCheckingAuth, authUser, minDelayPassed,err]);

  useEffect(() => {
    if (authUser?.status === false) {
      setShouldShowLoader(false);
    }
  }, [authUser?.status]);

  if (shouldShowLoader) {
    return <Loader />;
  }






  // console.log("On", {onlineUser});
  // console.log("Otn", {authUser});

  // if (isCheckingAuth && !authUser) {
  //   // if (true) {
  //   return (
  //     <Loader />
  //     // <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur z-50">
  //     //   <span className="loading loading-spinner loading-xl text-accent"></span>
  //     // </div>
  //   );
  // }
  // console.log("me", authUser._id);

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
            path="/setting"
            element={authUser ? <Setting /> : <Navigate to="/" />}
          />
          <Route
            path="/room/:id"
            element={authUser ? <Room /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" reverseOrder={true} />
    </>
  );
}

export default App;