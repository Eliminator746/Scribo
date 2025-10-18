import { Router } from "express";
import {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
} from "../controller/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

export const commentRouter = Router();

// Comments for a post
commentRouter.route("/").post(verifyJWT, addComment);

// Get all comments for a post
commentRouter.route("/post/:postId").get(getPostComments);

// Delete comment + Update a comment (auth, owner/admin)
commentRouter
  .route("/comment/:id")
  .put(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);
