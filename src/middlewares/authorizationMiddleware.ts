import { NextFunction, Request, Response } from "express";
import { tokenType } from "../utils/types";

export const authorizationMWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: tokenType = res.locals.user;
    if (!user) {
      return res.status(403).json({ error: "Not authorized" });
    }

    console.log({ user });

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: Only admins are allowed" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
