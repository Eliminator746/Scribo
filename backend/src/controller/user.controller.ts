import { Request, Response } from "express";
const registerUser = (req: Request, res: Response): void => {
  res.send("User route is working!");
};

export { registerUser };
