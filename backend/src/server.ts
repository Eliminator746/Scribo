import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./router/auth.router";
import { blogRouter } from "./router/blog.router";
import { userRouter } from "./router/user.router";
import { commentRouter } from "./router/comment.router";

const app = express();
const port = process.env.PORT || 3000;

// Handles the incoming request with JSON payload
app.use(express.json({ limit: "16kb" }));
// Handles the incoming request with URL encoded payload
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/blog", commentRouter);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
