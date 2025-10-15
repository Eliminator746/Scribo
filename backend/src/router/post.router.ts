import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controller/post.controller.js";

export const postRouter = Router();

postRouter.route("/").get(getAllPosts).post(createPost);

postRouter.route("/:id").get(getPostById).put(updatePost).delete(deletePost);
