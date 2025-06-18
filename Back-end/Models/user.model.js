import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profile_url: { type: String, required: true },
    dob: { type: Date },
    doj: { type: Date, default: Date.now },
    user_id: { type: String, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
