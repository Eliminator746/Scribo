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
