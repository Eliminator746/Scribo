import { RequestHandler } from "express";
import {
  UserRegistrationSchema,
  UserLoginSchema,
} from "../middleware/validation";
import { z } from "zod";
import prisma from "../db/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = UserRegistrationSchema.parse(req.body);
    const { username, email, password } = validatedData;

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: userCreated.user_id, email: userCreated.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: userCreated.user_id,
        username: userCreated.username,
        email: userCreated.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      res.status(400).send("Validation failed");
    } else {
      // Handle other errors
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

const loginUser: RequestHandler = async (req, res) => {
  try {
    const validatedData = UserLoginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser: RequestHandler = async (req, res) => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { registerUser, loginUser, logoutUser };
