import { Router } from "express";
import {
  addComment,
  getPostComments,
  updateComment,
  deleteComment,
} from "../controller/comment.controller.js";

export const commentRouter = Router();

// Comments for a post + Get all comments for a post
commentRouter.route("/post/:postId").get(getPostComments).post(addComment);

// Delete comment + Update a comment (auth, owner/admin)
commentRouter.route("/:id").put(updateComment).delete(deleteComment);
