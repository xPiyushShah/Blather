import React, { useState } from "react";
import "../../assets/Css/profile.css";
import "../../assets/Css/Home.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    username: "",
    userid: "",
    dob: "",
    profile: null,
  });

  const [preview, setPreview] = useState(null);

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
    console.log("Form Data:", formData);
    alert("Form submitted!");
  };
  return (
    <>
      <div className="bg-base-100 w-full h-full">
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
          <h2>User Form</h2>
          <form onSubmit={handleSubmit}>
            <label>User Name:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <br />

            <label>User ID:</label>
            <input
              type="text"
              name="userid"
              value={formData.userid}
              onChange={handleChange}
              required
            />
            <br />

            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <br />

            <label>Profile:</label>
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleChange}
            />
            <br />

            {preview && (
              <div style={{ margin: "10px 0" }}>
                <img
                  src={preview}
                  alt="Profile Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}
