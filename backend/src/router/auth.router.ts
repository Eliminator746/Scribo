import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/auth.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const authRouter = express.Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").post(verifyJWT, logoutUser);

export { authRouter };
