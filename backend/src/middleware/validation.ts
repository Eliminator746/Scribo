import { z } from "zod";

export const UserRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: z.string(),
});

export const UserLoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});

// Enum -> PostStatus
export const PostStatusEnum = z.enum(["draft", "published"]);

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image_url: z.url("Invalid image URL").optional().nullable(),
  status: PostStatusEnum.default("draft").optional(),
});

export const querySchema = z.object({
  status: z.enum(["draft", "published"]).optional(),
});
