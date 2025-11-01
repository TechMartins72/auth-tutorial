import { NextFunction, Request, Response } from "express";
import {
  NotFoundError,
  UnAuthenticatedError,
  ForbiddenError,
  BadRequestError,
} from "./types";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map(
      (err: any) => err.message
    );
    return res.status(400).json({ errors });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json("Not Found");
  }
  if (error instanceof UnAuthenticatedError) {
    return res.status(401).json(`Unauthenticated User ${error}`);
  }
  if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: `Forbidden Access ${error}` });
  }
  if (error instanceof BadRequestError) {
    return res.status(400).json({ error: `Bad Request ${error}` });
  }
  console.log({ error });
  res.status(500).json({ error: "A server error occured" });
};
