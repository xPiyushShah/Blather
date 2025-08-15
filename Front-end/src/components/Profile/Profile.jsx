import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faCamera,
  faImage,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/Css/profile.css";
import { functionStore } from "../../store/functionStore";
import { authStore } from "../../store/authStore";
import { useChatStore } from "../../store/useChatStore";
import Webcam from "react-webcam";
import toast from "react-hot-toast";

export default function Profile() {
  const { usrID, setUsrId } = functionStore();
  const { selectedUser } = useChatStore();
  const { authUser, updateProfile, updateImage } = authStore();

  const [formData, setFormData] = useState({});
  const [chng, setChng] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [preview, setPreview] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    if (usrID) {
      console.log("f", usrID)
      setFormData({ ...usrID });
    }
    if (authUser && !usrID) {
      setFormData({ ...authUser });
    }
  }, [authUser, usrID]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profile_url: file }));
      setPreview(URL.createObjectURL(file));
      uploadServer(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured.png", { type: "image/png" });
        setFormData((prev) => ({ ...prev, profile_url: file }));
        setPreview(imageSrc);
        setShowCamera(false);
        setChng(false);
        uploadServer(file);
      });
  };

  const uploadServer = async (file) => {
    if (!file) {
      console.error("No image selected for upload");
      return;
    }

    const data = new FormData();
    data.append("image", file);

    try {
      await updateImage(data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };
  const handleDisabledInputClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      toast.error("Can't change user detail");
    }
  };
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };
  const img_url = preview ? preview : formData.profile_url || "https://res.cloudinary.com/dufcac38i/image/upload/v1750871808/user-3d-icon_642950-57_y7w2bq.jpg";
  const isDisabled = authUser?._id !== formData._id
  return (
    <div className="w-full h-full  profile-cont overflow-auto">
      {usrID && (
        <div className="flex flex-row h-18 items-center ">
          <div className=" pk rounded-xl align-start">
            <FontAwesomeIcon
              icon={faArrowLeft}
              onClick={() => setUsrId(null)}
            />
          </div>
        </div>)}
      <div className=" w-full h-full">
        <form onSubmit={handleSubmit} className="items-start">
          <div className="profile-header baseliner mb-12">
            <div className="avatar">
              <div
                className="w-32 h-32 rounded overflow-hidden border shadow relative group"
                onClick={() => {
                  if (!isDisabled) setChng(!chng);
                }}
              >
                <img
                  src={img_url}
                  alt="Profile Preview"
                  className="object-cover w-32 h-32"
                />
                {!isDisabled && (
                  <div className="absolute bottom-2 left-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="text-white bg-black/40 p-2 rounded"
                    />
                  </div>)}
              </div>
            </div>
            {chng && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <button
                  className="absolute top-2 right-2 btn btn-sm btn-circle"
                  onClick={() => setChng(false)}
                >
                  ✕
                </button>
                <div className="flex flex-col items-center p-6 rounded-lg shadow-lg relative">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCamera(!showCamera)}
                      className="btn"
                    >
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
                        className="btn mt-2"
                      >
                        Capture
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* style={{ marginTop: "4px" }} */}
          <div
            className={`collapse border border-base-300 ${activeAccordion === 'personal' ? 'collapse-open ' : 'collapse-close bg-base-300'} `}
            style={{ marginTop: '12px', padding: '16px' }}
            onClick={() => toggleAccordion('personal')}
          >
            <div className="collapse-title font-semibold text-white">Personal Info:</div>
            <div className="collapse-content text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12" style={{ marginTop: "12px" }}>
                <div>
                  <label htmlFor="first_name" className="block mb-1 font-medium">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    disabled={isDisabled}
                    style={{ padding: "14px 18px" }}
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block mb-1 font-medium">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    disabled={isDisabled}
                    style={{ padding: "14px 18px" }}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    disabled={isDisabled}
                    style={{ padding: "14px 18px" }}
                  />
                </div>

                <div>
                  <label htmlFor="dob" className="block mb-1 font-medium">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                    disabled={isDisabled}
                    style={{ padding: "14px 18px" }}
                  />
                </div>

                <div>
                  <label htmlFor="user_id" className="block mb-1 font-medium">User ID</label>
                  <input
                    type="text"
                    id="user_id"
                    name="user_id"
                    value={formData?._id || ""}
                    disabled
                    className="input input-bordered w-full"
                    placeholder="User ID"
                    style={{ padding: "14px 18px" }}
                  />
                </div>

                <div>
                  <label htmlFor="doj" className="block mb-1 font-medium">Date of Joining </label>
                  <input
                    type="text"
                    id="doj"
                    name="doj"
                    value={
                      formData?.createdAt
                        ? new Date(formData.createdAt).toLocaleDateString()
                        : ""
                    }
                    disabled
                    className="input input-bordered w-full"
                    placeholder="Date of Joining"
                    style={{ padding: "14px 18px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`collapse border border-base-300 ${activeAccordion === 'friendship' ? 'collapse-open bg-base-100' : 'collapse-close bg-base-100'}`}
            style={{ marginTop: '12px', padding: '16px' }}
            onClick={() => toggleAccordion('friendship')}
          >
            <div className="collapse-title font-semibold">Friendship Info:</div>
            <div className="collapse-content text-sm">dasdasdasdasdasdsad</div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="btn btn-primary px-6">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
