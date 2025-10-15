import { Router } from "express";
import {
  getLikes,
  addLikeToPost,
  removeLikeFromPost,
} from "../controller/like.controller.js";

export const likeRouter = Router();

// GET /posts/:postId/likes – Public: list all likes on a post
likeRouter.route("/posts/:postId/likes").get(getLikes);

// POST /posts/:postId/likes – Auth: like a post
likeRouter.route("/posts/:postId/likes").post(addLikeToPost);

// DELETE /posts/:postId/likes/:userId – Auth: remove a user’s like
likeRouter.route("/posts/:postId/likes/:userId").delete(removeLikeFromPost);
