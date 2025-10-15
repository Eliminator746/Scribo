import { RequestHandler } from "express";

export const addLikeToPost: RequestHandler = async (req, res) => {
  // Like post logic here
};

export const removeLikeFromPost: RequestHandler = async (req, res) => {
  // Unlike post logic here
};

export const getLikes: RequestHandler = async (req, res) => {
  // Get likes for a post logic here
};
