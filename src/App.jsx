import React, { useState, Suspense, lazy, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import './App.css'
import { Toaster } from "react-hot-toast";
import { useAuthStore } from './store/authStore';


const Home = lazy(() => import('./Pages/Home'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const CallScreen = lazy(() => import('./components/screens/CallScreen.jsx'));
const Loader = lazy(() => import('./utils/Loader'));

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    // import("./Pages/Home");
    // import("./Pages/Login");
    // import("./Pages/Register");
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={authUser ? <Navigate to="/" /> : <Register />} />
          {/* <Route path="/call" element={<CallScreen />} />hom */}
        </Routes>
      </Suspense>
    </>
  )
}

export default App
