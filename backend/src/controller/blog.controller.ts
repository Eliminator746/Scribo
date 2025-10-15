import { RequestHandler } from "express";
import { PostSchema as BlogSchema } from "../middleware/validation";
import prisma from "../db";
import { slugify } from "../utils/stringUtils";
import { title } from "process";
import { ApiResponse } from "../utils/ApiResponse";

export const createBlog: RequestHandler = async (req, res) => {
  const userId = (req as any).user.user_id; // verifyJWT to get loggedin User id
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validatedData = BlogSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res.status(400).json({ errors: validatedData.error });
  }

  const blogData = validatedData.data;

  const slug = slugify(blogData.title);

  // Check if the user already has a post with the same slug
  const existingPost = await prisma.post.findFirst({
    where: {
      user_id: userId,
      slug: slug,
    },
  });

  if (existingPost) {
    return res
      .status(409)
      .json({ message: "You have already created a post with this title." });
  }

  const blog = await prisma.post.create({
    data: {
      user_id: userId,
      title: blogData.title,
      slug: slug,
      image_url: blogData.image_url,
      status: blogData.status,
    },
  });

  return res.json(new ApiResponse(201, blogData, "Blog created successfully"));
};

export const getAllBlogs: RequestHandler = async (req, res) => {
  // Get all posts logic here
};

export const getBlogById: RequestHandler = async (req, res) => {
  // Get single post logic here
};

export const updateBlog: RequestHandler = async (req, res) => {
  // Update post logic here
};

export const deleteBlog: RequestHandler = async (req, res) => {
  // Delete post logic here
};
