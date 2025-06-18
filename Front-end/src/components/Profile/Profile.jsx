import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCamera,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/Css/profile.css";
import { functionStore } from "../../store/functionStore";
import { authStore } from "../../store/authStore";
import { useChatStore } from "../../store/useChatStore";
import ImageModal from "./ImageModal";
import Webcam from "react-webcam";

export default function Profile() {
  const { usrID } = functionStore();
  const { selectedUser } = useChatStore();
  const { authUser, updateProfile, updateImage } = authStore();
  const [formData, setFormData] = useState([]);
  const [chng, setChng] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);
  useEffect(() => {
    setFormData(usrID ?? authUser);
  }, []);

  const [preview, setPreview] = useState(null);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      const file = files[0];
      setFormData({ ...formData, profile_url: file });
      setPreview(URL.createObjectURL(file));
      await uploadServer();
    } else {
      setFormData({ ...formData, [name]: value });
      handleSubmit(e);
    }
    setChng(false);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Submitted Data:", formData);
    // alert("Form submitted!");
    await updateProfile(formData);
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured.png", { type: "image/png" });
        setFormData({ ...formData, profile_url: file });
        setPreview(imageSrc);
        setShowCamera(false);
        setChng(false);
        uploadServer();
      });
  };

  const uploadServer = async () => {
    if (!formData.profile_url) {
      console.error("No image selected for upload");
      return;
    }

    const data = new FormData();
    data.append("image", formData.profile_url);

    try {
      await updateImage(data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="w-full h-full  profile-cont ">
      <form onSubmit={handleSubmit} className="items-start">
        <div className="profile-header baseliner mb-12">
          <div className="avatar">
            <div
              className="w-32 h-32 rounded overflow-hidden border shadow relative group"
              onClick={() => setChng(!chng)}>
              <img
                src={preview || formData.profile_url}
                alt="Profile Preview"
                className="object-coverw-80 h-full"
              />
              <div className="absolute bottom-2 left-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-white bg-black/40 p-2 rounded"
                />
              </div>
            </div>
          </div>
          {chng && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 btn btn-sm btn-circle"
                onClick={() => setChng(false)}>
                ✕
              </button>
              <div className="flex flex-col items-center p-6 rounded-lg shadow-lg relative">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCamera(!showCamera)}
                    className="btn">
                    <FontAwesomeIcon icon={faCamera} />
                  </button>

                  <label className="btn cursor-pointer">
                    <FontAwesomeIcon icon={faImage} />
                    <input
                      type="file"
                      name="profile"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {showCamera && (
                  <div className="mt-4">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded shadow w-64 h-48"
                    />
                    <button
                      type="button"
                      onClick={handleCapture}
                      className="btn mt-2">
                      Capture
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
          <input
            type="text"
            name="user_id"
            value={authUser?._id || ""}
            disabled
            className="input input-bordered"
            placeholder="User ID"
          />
          <input
            type="text"
            name="doj"
            value={
              authUser?.createdAt
                ? new Date(authUser.createdAt).toLocaleDateString()
                : ""
            }
            disabled
            className="input input-bordered"
            placeholder="Date of Joining"
          />
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
