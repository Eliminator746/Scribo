import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

export const blogRouter = Router();

blogRouter.route("/").get(getAllBlogs).post(verifyJWT, createBlog);

blogRouter.route("/:id").get(getBlogById).put(updateBlog).delete(deleteBlog);
