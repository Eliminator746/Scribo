import express from "express";
import { userRouter } from "./router/user.router";

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
