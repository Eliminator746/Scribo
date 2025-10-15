import { Router } from "express";
import {
  createBlog,
  getAllPublishedBlogs,
  getMyBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controller/blog.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

export const blogRouter = Router();

// Public routes
blogRouter.route("/published").get(getAllPublishedBlogs);
blogRouter.route("/:slug").get(getBlogBySlug);

// Protected routes
blogRouter.route("/me/my-blogs").get(verifyJWT, getMyBlogs);
blogRouter.route("/create-blog").post(verifyJWT, createBlog);
blogRouter
  .route("/:id")
  .put(verifyJWT, updateBlog)
  .delete(verifyJWT, deleteBlog);
