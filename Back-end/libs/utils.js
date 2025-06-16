import jwt from "jsonwebtoken";
export const gToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_PVTKEY, {
    expiresIn: "7d",
  });
  res.cookie("auth_token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  console.log("token for user:", userId, "is generated successfully", token);
};
