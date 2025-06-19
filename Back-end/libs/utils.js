import jwt from "jsonwebtoken";
export const gToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_PVTKEY, {
    expiresIn: "7d",
  });
  
  // res.cookie("auth_token", token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  //   path:"/",
  //   domain:".onrender.com"
  // });
  // return token;
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log("token for user:", userId, "is generated successfully", token);
};
