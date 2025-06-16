import jwt from "jsonwebtoken";
export const gToken = (userId, res) => {
  const token = jwt.sign({ userId }, "MYSHARKTANK", {
    expiresIn: "7d",
  });
  res.cookie("auth_token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });
};
