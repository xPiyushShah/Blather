import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Db connection established: ", con.connection.host);
  } catch (err) {
    console.log("While Connection to databse err occur:", err);
  }
};
