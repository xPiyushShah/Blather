import React, { useState, useEffect } from "react";
import "../../assets/Css/profile.css";

export default function Profile({ data }) {
  const [formData, setFormData] = useState({
    username: "Piyush Shah",
    userid: "USR-2455",
    dob: "",
    profile: null,
  });

  const [preview, setPreview] = useState(null);

  // Load initial data from props
  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "Piyush Shah",
        userid: data.userid || "USR-2455",
        dob: data.dob || "15-08-2025",
        profile: null, // File cannot be prefilled, only image preview
      });
      if (data.profile) {
        setPreview(data.profile); // assuming data.profile is a URL
      }
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      const file = files[0];
      setFormData({ ...formData, profile: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Form submitted!");
  };

  return (
    <div className="w-full h-full  profile-cont ">
      <form onSubmit={handleSubmit} className="items-start">
        <div className="profile-header baseliner ">
          <label className="input validator jkl ">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              type="text"
              placeholder="Username"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minlength="3"
              maxlength="30"
              title="Only letters, numbers or dash"
              value={formData.userid}
              onChange={handleChange}
            />
          </label>
          <p className="validator-hint hidden">
            Must be 3 to 30 characters
            <br />
            containing only letters, numbers or dash
          </p>
          <div className="avatar">
            <div className="w-32 h-32 rounded overflow-hidden border shadow">
              <img
                src={
                  preview ||
                  "https://img.daisyui.com/images/profile/demo/superperson@192.webp"
                }
                alt="Profile Preview"
                className="object-coverw-80 h-full"
              />
            </div>
          </div>
        </div>
        <div className="profile-header baseliner mt-6 username">
          <input
            type="text"
            name="username"
            className="input input-borderedw-80"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label className="input validator jkl">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </g>
            </svg>
            <input type="email" placeholder="mail@site.com" />
          </label>
          <div className="validator jkl-hint hidden">Enter valid email address</div>
        </div>
        <div className="profile-header baseliner mt-6 date">
          <input
            type="date"
            name="dob"
            className="input input-borderedw-80"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="doj"
            className="input input-borderedw-80"
            value={formData.doj}
            onChange={handleChange}
            required
          />
        </div>
        <div className="profile-header baseliner mt-6 file">
          <input
            type="file"
            name="profile"
            accept="image/*"
            onChange={handleChange}
            className="file-input  input  file-input-borderedw-80"
          />
          <label className="input validator jkl">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16">
              <g fill="none">
                <path
                  d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                  fill="currentColor"></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                  fill="currentColor"></path>
              </g>
            </svg>
            <input
              type="tel"
              className="tabular-nums"
              required
              placeholder="Phone"
              pattern="[0-9]*"
              minlength="10"
              maxlength="10"
              title="Must be 10 digits"
            />
          </label>
          <p className="validator jkl-hint hidden">Must be 10 digits</p>
        </div>
        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
          <button type="submit" className="btn btn-primary px-6">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
