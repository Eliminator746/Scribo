import { Router } from "express";
import {
  getUserProfile,
  updateUser,
  deleteUser,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

export const userRouter = Router();

userRouter
  .route("/:id")
  .get(getUserProfile)
  .put(updateUser)
  .delete(verifyJWT, deleteUser);
