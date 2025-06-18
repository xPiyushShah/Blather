import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Css/Home.css";
import "../assets/Css/profile.css";
import { authStore } from "../store/authStore";
import Footer from "../utils/Footer";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoginIn, logIn } = authStore();

  const handleLock = (e) => {
    alert("Not available");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const res = await logIn(formData);
    // navigate("/");
    if (res.token) {
      localStorage.setItem("auth_token", res.token);
      window.location.href = "/";
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="main-root">
      <div className="w-full h-screen absolute text-white flex-row">
        <div className="w-full h-full flex flex-col align-center bg-base-100">
          <div className="w-full h-full flex align-center justify-center bg-base-100">
            <section>
              <form
                onSubmit={handleSubmit}
                className="p-12 w-full h-full flex flex-col items-center justify-center">
                <div
                  className="flex flex-col gap-6 w-80"
                  style={{ padding: "18px" }}>
                  {/* OAuth Buttons */}
                  <div className="flex justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleLock}
                      style={{ padding: "8px" }}
                      className="flex  delay-200  transition-discrete ease-in-out transition-all items-center justify-center hover:text-black-200 w-full gap-2 bg-transparent border p-3 rounded hover:bg-red-400 hover:cursor-pointer">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 488 512"
                        fill="currentColor">
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123.6 24.1 167.4 63.7l-67.8 65.1C314.3 109.8 284.6 96 248 96c-88.4 0-160.2 74.1-160.2 160S159.6 416 248 416c77.1 0 126.4-44.2 132.2-106H248v-85h240z" />
                      </svg>
                      Google
                    </button>

                    <button
                      onClick={handleLock}
                      type="button"
                      style={{ padding: "8px" }}
                      className="flex  delay-200  transition-discrete ease-in-out transition-all items-center justify-center hover:text-black-200 w-full gap-2 bg-transparent border p-3 rounded hover:bg-blue-200 hover:cursor-pointer">
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M3.9 12a5.1 5.1 0 0 0 5.1 5.1h5a.9.9 0 1 0 0-1.8h-5a3.3 3.3 0 0 1 0-6.6h5a.9.9 0 1 0 0-1.8h-5A5.1 5.1 0 0 0 3.9 12Zm16.2-4.2h-5a.9.9 0 0 0 0 1.8h5a3.3 3.3 0 1 1 0 6.6h-5a.9.9 0 1 0 0 1.8h5a5.1 5.1 0 1 0 0-10.2Z" />
                      </svg>
                      Other
                    </button>
                  </div>

                  <div className="divider">OR</div>

                  {/* Email Input */}
                  <label className="input validator flex items-center gap-2">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="flex-1 bg-transparent outline-none"
                    />
                  </label>

                  {/* Password Input */}
                  <label className="input validator flex items-center gap-2">
                    <svg
                      className="h-[1em] opacity-50"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="flex-1 bg-transparent outline-none"
                    />
                  </label>

                  {/* Error Message */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  {/* Remember Me */}
                  <label className="label flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="checkbox"
                      style={{ width: "15px", height: "15px" }}
                    />
                    <span htmlFor="remember">Remember me</span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    style={{ padding: "8px" }}
                    disabled={isLoginIn}>
                    {isLoginIn ? "Processing..." : "Sign In"}
                  </button>

                  <div style={{ fontSize: "15px" }}>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-200">
                      Create an account
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

export default Login;
