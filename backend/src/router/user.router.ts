import { Router } from "express";
import {
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";

export const userRouter = Router();

userRouter.route("/:id").get(getUserProfile).put(updateUser).delete(deleteUser);
