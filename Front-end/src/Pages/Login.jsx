import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setFormData({ email: "", password: "" });
  }, []);

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
    await logIn(formData);
    setFormData({ email: "", password: "" });
  };

  return (
    <div className="main-root">
      <div className="w-full min-h-screen text-white flex">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-5xl bg-base-100 rounded-lg flex items-center justify-center px-4 py-10">
            <section className="w-full">
              <form
                autoComplete="off"
                onSubmit={handleSubmit}
                className="
                  w-full flex flex-col lg:flex-row 
                  items-center justify-center 
                  gap-10 lg:gap-32  *:select-none
                "
              >
                {/* LEFT SIDE */}
                <div className="flex flex-col gap-6 w-full max-w-sm">
                  <label className="input validator flex items-center gap-2  select-none  focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-300 ">
                    <input
                      type="email"
                      name="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Johndoe@domain.com"
                      className="flex-1 bg-transparent outline-none"
                      style={{ padding: "6px" }}
                    />
                  </label>

                  <label className="input validator flex items-center gap-2 select-none  focus-within:border-green-400 focus-within:ring-1 focus-within:ring-green-300 ">
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="********"
                      className="flex-1 bg-transparent outline-none"
                      style={{ padding: "6px" }}
                    />
                  </label>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex items-center justify-between">
                    <label className="label flex items-center gap-2 select-none">
                      <input type="checkbox" className="checkbox w-4 h-4" />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="submit"
                      className="bg-green-500 p-2 rounded w-[152px] h-[46px]  text-white shadow-lg hover:bg-transparent hover:text-green-500 hover:border hover:border-green-500 transition cursor-pointer"
                      disabled={isLoginIn}
                    >
                      {isLoginIn ? "Processing..." : "Sign In"}
                    </button>
                  </div>

                  <div className="text-md  select-none">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-200 cursor-pointer">
                      Create an account
                    </Link>
                  </div>
                </div>
                {/* DIVIDER */}
                <div className="flex items-center justify-center w-full lg:w-auto pointer-events-none select-none">
                  <div className="flex lg:flex-col items-center gap-3">
                    <div className="w-24 h-[1px] lg:w-[1px] lg:h-32 bg-gray-400/50"></div>

                    <span className="text-gray-400 text-sm font-semibold cursor-default">
                      OR
                    </span>

                    <div className="w-24 h-[1px] lg:w-[1px] lg:h-32 bg-gray-400/50"></div>
                  </div>
                </div>


                {/* RIGHT SIDE */}
                <div className="w-full max-w-xs flex items-center justify-center">
                  <div className="flex flex-col gap-5 w-[152px]">

                    <button className="h-[46px] w-full flex items-center justify-center gap-3 rounded-xl bg-red-500 text-white shadow-lg hover:bg-transparent hover:text-red-500 hover:border hover:border-red-500 transition cursor-pointer">
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="#fbbc05"
                          d="M43.611 20.083h-19.75v7.834h11.313c-1.688 4.606-6.36 7.834-11.313 7.834-6.618 0-12-5.382-12-12s5.382-12 12-12c3.062 0 5.845 1.145 7.97 3.01l5.704-5.704C34.879 4.07 29.908 2 24 2 11.85 2 2 11.85 2 24s9.85 22 22 22c12.04 0 21.834-9.815 21.834-22 0-1.42-.155-2.806-.423-4.083z"
                        />
                        <path
                          fill="#ea4335"
                          d="M6.306 14.691l6.611 4.849c1.857-3.31 5.435-5.644 9.083-5.644 3.062 0 5.845 1.145 7.97 3.01l5.704-5.704C34.879 4.07 29.908 2 24 2c-7.627 0-14.326 4.062-17.694 10.691z"
                        />
                        <path
                          fill="#34a853"
                          d="M24 46c5.908 0 10.879-2.07 14.668-5.459l-6.78-5.623c-2.115 1.864-4.908 3.01-7.888 3.01-5.108 0-9.574-3.221-11.327-7.584l-6.611 5.08C10.049 41.902 16.372 46 24 46z"
                        />
                        <path
                          fill="#4285f4"
                          d="M43.611 20.083h-19.75v7.834h11.313c-1.01 2.762-3.11 5.06-5.817 6.512l.01-.001 6.78 5.623C40.729 38.04 46 30.904 46 24c0-1.42-.155-2.806-.423-4.083z"
                        />
                      </svg>
                      Google
                    </button>

                    <button className="h-[46px] w-full flex items-center justify-center gap-3 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-transparent hover:text-blue-600 hover:border transition cursor-pointer">
                      <svg className="w-6 h-6 bg-blue-600 rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#fff" d="M24 4C12.954 4 4 12.954 4 24c0 9.993 7.368 18.25 17 19.793V30h-5v-6h5v-4.5c0-4.97 3.034-7.7 7.59-7.7 2.188 0 4.474.392 4.474.392v4.91h-2.515c-2.477 0-3.256 1.541-3.256 3.122V24h5.554l-.888 6H25.29v13.793C34.932 42.25 42 33.993 42 24 42 12.954 33.046 4 24 4z" />
                      </svg>
                      Facebook
                    </button>

                    <button className="h-[46px] w-full flex items-center justify-center rounded-xl bg-green-500 text-white shadow-lg hover:bg-transparent hover:text-green-500 hover:border hover:border-green-500 transition cursor-pointer">
                      Guest
                    </button>

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
