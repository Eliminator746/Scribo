import { RequestHandler } from "express";
import { safeDeleteUser } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";

export const getUserProfile: RequestHandler = async (req, res) => {
  // Get user profile logic here
};

export const updateUser: RequestHandler = async (req, res) => {
  // Update user profile logic here
};

export const deleteUser: RequestHandler = async (req, res) => {
  // Delete user logic here
  const { id } = req.params;

  const response = await safeDeleteUser(Number(id));
  if (!response.success)
    return res.status(400).send("Problem occured while deleting user");

  return res
    .status(200)
    .json(new ApiResponse(201, `User - ${id} deleted successfully!`));
};
