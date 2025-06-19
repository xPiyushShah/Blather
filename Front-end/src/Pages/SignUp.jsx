import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Css/Home.css";
import "../assets/Css/profile.css";
import { authStore } from "../store/authStore";
import toast from "react-hot-toast";
import Footer from "../utils/Footer";

const SignUp = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { signUp, isSigninUp } = authStore();

  // Validate input fields
  const validateForm = () => {
    const { first_name, last_name, email, password } = formData;

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!first_name || !nameRegex.test(first_name)) {
      toast.error("First name is required and must contain only letters.");
      return false;
    }

    if (!last_name || !nameRegex.test(last_name)) {
      toast.error("Last name is required and must contain only letters.");
      return false;
    }

    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await signUp(formData);
    if (success) {
      toast.success("User registered successfully");
      window.location.href = "/"
    } else {
      toast.error("Failed to register user");
    }


    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    });
  };


  const handleLock = () => toast.error("Not available");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="main-root">
      <div className="w-full h-screen absolute text-white flex-row">
        <div className="w-full h-full flex flex-col align-center bg-base-200">
          <div className="w-full h-full flex align-center justify-center bg-base-200">
            <section className="w-90 h-full">
              <form
                onSubmit={handleSubmit}
                className="p-12 w-full h-full flex flex-col items-center justify-center"
              >
                <div className="flex flex-col gap-6 w-[500px]" style={{ padding: "18px" }}>
                  {/* OAuth Buttons */}
                  <div className=" flex-row gap-4 hidden">
                    <button
                      type="button"
                      onClick={handleLock}
                      className="flex items-center justify-center gap-2 bg-transparent border p-3 rounded hover:bg-red-400"
                    >
                      <svg width="20" height="20" viewBox="0 0 488 512" fill="currentColor">
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123.6 24.1 167.4 63.7l-67.8 65.1C314.3 109.8 284.6 96 248 96c-88.4 0-160.2 74.1-160.2 160S159.6 416 248 416c77.1 0 126.4-44.2 132.2-106H248v-85h240z" />
                      </svg>
                      Google
                    </button>
                    <button
                      onClick={handleLock}
                      type="button"
                      className="flex items-center justify-center gap-2 bg-transparent border p-3 rounded hover:bg-blue-200"
                    >
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.9 12a5.1 5.1 0 0 0 5.1 5.1h5a.9.9 0 1 0 0-1.8h-5a3.3 3.3 0 0 1 0-6.6h5a.9.9 0 1 0 0-1.8h-5A5.1 5.1 0 0 0 3.9 12Zm16.2-4.2h-5a.9.9 0 0 0 0 1.8h5a3.3 3.3 0 1 1 0 6.6h-5a.9.9 0 1 0 0 1.8h5a5.1 5.1 0 1 0 0-10.2Z" />
                      </svg>
                      Other
                    </button>
                  </div>

                  <div className="divider hidden">OR</div>

                  {/* Input Fields */}
                  <div className="flex flex-row gap-6">
                    <label className="input validator flex items-center gap-2">
                      <input
                        type="text"
                        name="first_name"
                        placeholder="Enter First Name..."
                        value={formData.first_name}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none"
                      />
                    </label>
                    <label className="input validator flex items-center gap-2">
                      <input
                        type="text"
                        name="last_name"
                        placeholder="Enter Last Name..."
                        value={formData.last_name}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none"
                      />
                    </label>
                  </div>

                  <div className="flex flex-row gap-6">
                    <label className="input validator flex items-center gap-2">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none"
                      />
                    </label>
                    <label className="input validator flex items-center gap-2 relative">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none"
                      />
                    </label>
                  </div>

                  <label className="label flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="checkbox"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <span htmlFor="remember">Remember me</span>
                  </label>

                  <button
                    type="submit"
                    className="bg-green-500 text-white rounded hover:bg-green-600 w-40"
                    style={{ padding: "8px" }}
                    disabled={isSigninUp}
                  >
                    {isSigninUp ? "Processing..." : "Sign Up"}
                  </button>

                  <div style={{ fontSize: "15px" }}>
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-200">
                      Sign In
                    </Link>
                  </div>
                </div>
              </form>
            </section>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
