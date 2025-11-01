import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenType } from "../utils/types";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Unauithorized!" });
    }

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as tokenType;
    res.locals.user = decode;

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    console.log({ error });
    return res.status(500).json({ message: "Authentication error" });
  }
};
