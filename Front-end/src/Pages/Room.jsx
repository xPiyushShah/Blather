import React, { useState } from "react";
import "../assets/Css/Home.css";
import { roomStore } from "../store/useRoom";
import toast from "react-hot-toast";

function Room() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState(""); // video/audio/both
  const { isRoom, createRoom, setRoom } = roomStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email ||!name || !mode) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (mode == "true") {
      toast.error("Can't create a room in both mode or video mode.");
      return;
    }
    const roomData = {
      email,
      name,
      mode,
    };
    console.log("Room Data: ", roomData); 
    createRoom(roomData); 
  };

  return (
    <div className="main-root">
      <div className="hidden sm:flex w-full h-screen absolute text-white flex-row">
        <div
          className="w-full h-full flex flex-row align-center bg-[rgba(0,0,0,0.6)]"
          style={{ padding: "14px 22px" }}>
          {!isRoom ? (
            <div
              className="w-full h-fit flex text-white flex-row text-center gap-18 justify-center mt-18 border-b-[1px] border-b-[#dddddd35]"
              style={{ padding: "14px 22px" }}>
              <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-16 align-center items-center">
                {/* Name Field */}
                <div className="m-12" style={{marginTop:"12px"}}>
                  <label className="input validator jkl">
                    <input
                      type="text"
                      name="name"
                      placeholder="Room Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                </div>{" "}
                {/* Email Field */}
                <div className="m-12" style={{marginTop:"12px"}}>
                  <label className="input validator jkl">
                    <input
                      type="password"
                      name="password"
                      placeholder="******"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                {/* Mode Selection */}
                <div>
                  <select
                    className="select select-primary w-26 h-10"
                    style={{ padding: "12px", marginTop: "12px" }}
                    onChange={(e) => setMode(e.target.value)}>
                    <option  selected disabled>None</option>
                    <option value="true">Both</option>
                    <option value="chat">Chat</option>
                    <option value="true">Video</option>
                    <option value="false">Audio</option>
                  </select>
                </div>
                {/* Submit Button */}
                <div>
                  <button type="submit" className="btn btn-accent">
                    Create Room
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div
              className="w-full h-fit flex text-white flex-row text-center gap-18 justify-center mt-18 border-b-[1px] border-b-[#dddddd35]"
              style={{ padding: "14px 22px" }}>
              Waiting for Join Someone..
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Room;
