import { RequestHandler } from "express";
import { safeDeleteUser } from "../services/user.service";
import { ApiResponse } from "../utils/ApiResponse";
import prisma from "../db";

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.user_id;
    const { id } = req.params;

    // Only allow users to access their own profile
    if (Number(id) !== userId) {
      return res
        .status(403)
        .json(
          new ApiResponse(403, null, "You can only access your own profile")
        );
    }

    const user = await prisma.user.findUnique({
      where: { user_id: Number(id) },
      select: {
        user_id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error fetching user profile"));
  }
};

//------------------------------------------------------------------------------------------------------------------------
// 1. Only allow users to update their own profile
// 2. Check if email is already taken by another user
// 3. Update user
//------------------------------------------------------------------------------------------------------------------------
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.user_id;
    const { id } = req.params;
    const { username, email } = req.body;

    if (Number(id) !== userId) {
      return res
        .status(403)
        .json(
          new ApiResponse(403, null, "You can only update your own profile")
        );
    }

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            user_id: userId,
          },
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Email already in use"));
      }
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: Number(id) },
      data: {
        username,
        email,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error updating profile"));
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const response = await safeDeleteUser(Number(id));
  if (!response.success)
    return res.status(400).send("Problem occured while deleting user");

  return res
    .status(200)
    .json(new ApiResponse(201, `User - ${id} deleted successfully!`));
};
