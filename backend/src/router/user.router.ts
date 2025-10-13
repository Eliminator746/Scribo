import express from "express";
import { registerUser } from "../controller/user.controller";

const userRouter = express.Router();

userRouter.route("/").get(registerUser);

export { userRouter };
