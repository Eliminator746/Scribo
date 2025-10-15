import { RequestHandler } from "express";
import {
  PostSchema as BlogSchema,
  querySchema,
} from "../middleware/validation";
import prisma from "../db";
import { slugify } from "../utils/stringUtils";
import { ApiResponse } from "../utils/ApiResponse";
import { ZodError } from "zod";

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

  return res
    .status(201)
    .json(new ApiResponse(201, blog, "Blog created successfully"));
};

export const getAllPublishedBlogs: RequestHandler = async (req, res) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Get only published posts
    const [blogs, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: "published" },
        skip,
        take: Number(limit),
        orderBy: { created_at: "desc" },
        select: {
          post_id: true,
          title: true,
          slug: true,
          image_url: true,
          status: true,
          created_at: true,
          updated_at: true,
          user_id: true,
        },
      }),
      prisma.post.count({ where: { status: "published" } }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          blogs,
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalBlogs: total,
        },
        "Published blogs fetched successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error fetching published blogs"));
  }
};

// ------------------------------------------------------------------------------------------------------------------------
//                                                          getMyBlogs Logic
// ------------------------------------------------------------------------------------------------------------------------

// author + any blogs of their own -> show
// Filter by status is also there

// 1. Check validStatus
// 2. If status query param exists, filter by status then
// 3. Get all posts for the logged-in user

// ------------------------------------------------------------------------------------------------------------------------
export const getMyBlogs: RequestHandler = async (req, res) => {
  try {
    const { page = "1", limit = "10", status } = req.query;
    const userId = (req as any).user.user_id;
    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Authentication required"));
    }

    const skip = (Number(page) - 1) * Number(limit);

    let validStatus;
    try {
      validStatus = querySchema.parse(req.query);
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "Invalid query parameters"));
      }
      throw error;
    }

    const filterByStatus = status
      ? { user_id: userId, status: validStatus.status }
      : { user_id: userId };

    // Get all posts for the logged-in user
    const [blogs, total] = await Promise.all([
      prisma.post.findMany({
        where: filterByStatus,
        skip,
        take: Number(limit),
        orderBy: { created_at: "desc" },
        select: {
          post_id: true,
          title: true,
          slug: true,
          image_url: true,
          status: true,
          created_at: true,
          updated_at: true,
          user_id: true,
        },
      }),
      prisma.post.count({ where: filterByStatus }),
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          blogs,
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalBlogs: total,
        },
        "Your blogs fetched successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error fetching your blogs"));
  }
};

// ------------------------------------------------------------------------------------------------------------------------
//                                                          getBlogBySlug Logic
// ------------------------------------------------------------------------------------------------------------------------

// 1. First fetch the blog
// 2. Check access conditions:
// 1. slug + published -> accessible to everyone
// 2. slug + draft + author -> accessible to author

// ------------------------------------------------------------------------------------------------------------------------
export const getBlogBySlug: RequestHandler = async (req, res) => {
  const { slug } = req.params;
  const userId = (req as any).user?.user_id; // Will be undefined for non-logged in users

  try {
    // First find the blog by slug
    const blog = await prisma.post.findUnique({
      where: { slug },
      select: {
        post_id: true,
        title: true,
        slug: true,
        image_url: true,
        status: true,
        created_at: true,
        updated_at: true,
        user_id: true,
      },
    });

    if (!blog) {
      return res.status(404).json(new ApiResponse(404, null, "Blog not found"));
    }

    // Check access conditions:
    // 1. Blog is published (accessible to everyone) OR
    // 2. Blog is draft AND viewer is the author
    const isPublished = blog.status === "published";
    const isAuthor = blog.user_id === userId;

    if (!isPublished && (!isAuthor || blog.status !== "draft")) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            null,
            "You don't have permission to view this blog"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, blog, "Blog fetched successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error fetching blog"));
  }
};

export const updateBlog: RequestHandler = async (req, res) => {
  const userId = (req as any).user.user_id;
  const { id: postId } = req.params;
  const { title, image_url, status } = req.body;

  // Checks if post exists and belongs to the user
  const post = await prisma.post.findUnique({
    where: { post_id: Number(postId) },
  });

  if (!post) {
    return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  }

  if (post.user_id !== userId) {
    return res.status(403).json(new ApiResponse(403, null, "Forbidden"));
  }

  const result = await prisma.post.update({
    where: {
      post_id: Number(postId),
    },
    data: {
      title,
      slug: slugify(title),
      image_url,
      status,
    },
  });

  if (!result) {
    return res.status(400).send("Error while updating");
  }
  return res.json(new ApiResponse(200, result, "Update Successfull!"));
};

export const deleteBlog: RequestHandler = async (req, res) => {
  const { id: post_id } = req.params;

  try {
    const response = await prisma.post.delete({
      where: {
        post_id: Number(post_id),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, `Post ${post_id} deleted successfully.`));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "An error occurred while deleting the post."));
  }
};
