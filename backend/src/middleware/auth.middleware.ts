import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse";
import prisma from "../db";

// ------------------------------------------------------------------------------------------------------------------------
//                                                          Verify JWT Logic
// ------------------------------------------------------------------------------------------------------------------------

// 1. Get token from cookies or headers
// 2. Verify token
// 3. Check if user exists, We've the access of id. While signing jwt we provided id in payload
// 4. Send user data via req.user

// ------------------------------------------------------------------------------------------------------------------------
export const verifyJWT: RequestHandler = async (req, res, next) => {
  try {
    const secretPassword = process.env.JWT_SECRET;
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized request"));
    }
    const decoded = jwt.verify(token, String(secretPassword)) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { user_id: decoded.userId },
    });

    if (!user) return res.status(401).send("User doesn't exists");

    (req as any).user = user;
    next();
  } catch (err: any) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
