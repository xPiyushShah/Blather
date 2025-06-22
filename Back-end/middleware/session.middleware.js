import redisClient from "../libs/redisClient.js";

export const sessionMiddleware = async (req, res, next) => {
    
  const sessionId = req.cookies.sessionId;
  if (!sessionId)
    return res.status(401).json({ message: "Unauthorized", status: false });

  const session = await redisClient.get(sessionId);
  if (!session)
    return res
      .status(401)
      .json({ message: "Session expired or invalid", status: false });

  req.user = JSON.parse(session);
  next();
};
