import { UserModel } from "../schemas/userSchema.ts";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, userInfo } from "../utils/types.ts";
import { OrderModel } from "../schemas/orderSchema.ts";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body: IUser = req.body;
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Please, provide credentials!" });
    }
    const isRegistered = await UserModel.findOne({ email: email });

    if (isRegistered) {
      return res
        .status(409)
        .json({ message: "User already exist. Please login!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      ...body,
      password: hashedPassword,
    };

    const newUser = new UserModel(user);
    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        role: savedUser.role,
        email: savedUser.email,
        fullName: savedUser.fullName,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const { email, password } = body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required" });
    }

    const user: IUser | null = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "This user does not exist. Please register!" });
    }

    const isCorrectPwd = await bcrypt.compare(password, user.password);

    if (!isCorrectPwd) {
      return res
        .status(400)
        .json({ message: "Incorrect Password. Try again!" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Not authenticated" });
    }

    const loggedInUser: IUser | null = await UserModel.findById(user.id);

    res.status(200).json({
      success: true,
      user: loggedInUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const info: userInfo = req.body;
    const userId = req.params.userId;

    if (!info) {
      return res.status(400).json({
        succes: false,
        error: "Information not provided",
      });
    }

    if (!userId) {
      return res.status(400).json({
        succes: false,
        error: "User Id not provided",
      });
    }

    const user = res.locals.user;

    if (user.id !== userId) {
      return res.status(403).json({
        succes: false,
        error: "This is not your account",
      });
    }
    const result = await UserModel.updateOne(
      { _id: userId },
      { $set: { information: info } }
    );

    if (result.acknowledged === false) {
      return res.status(404).json({ succes: false, error: "User not found" });
    }

    res
      .status(201)
      .json({ succes: true, message: "Information updated successfully!" });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ succes: false, error: "No user id provided" });
    }

    if (!newPassword || !oldPassword) {
      return res
        .status(400)
        .json({ succes: false, error: "Please provide new and old password" });
    }

    const isUser = res.locals.user.id === userId;
    if (!isUser) {
      return res.status(401).json({
        succes: false,
        error: "Unauthorized. You are not the account owner",
      });
    }

    const user: IUser | null = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "This user does not exist. Please register!" });
    }

    const isCorrectPwd = await bcrypt.compare(oldPassword, user.password);

    if (!isCorrectPwd) {
      return res
        .status(400)
        .json({ succes: false, error: "Incorrect Password. Try again!" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.findByIdAndUpdate(userId, {
      $set: { password: hashedNewPassword },
    });

    res.status(201).json({ message: "Password update successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userPwd = req.body.password;
    const userId = req.params.userId;

    if (!userPwd) {
      return res
        .status(400)
        .json({ succes: false, error: "No password provided" });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ succes: false, error: "No user id provided" });
    }

    const isUser = res.locals.user.id === userId;

    if (!isUser) {
      return res.status(401).json({
        succes: false,
        error: "Unauthorized: You can't delete this account",
      });
    }

    const user = res.locals.user;

    if (user.role === "user") {
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ succes: false, error: "User not found" });
      }

      const isCorrectPwd = await bcrypt.compare(userPwd, user.password);

      if (!isCorrectPwd) {
        return res
          .status(400)
          .json({ succes: false, error: "incorrect password" });
      }
    }

    if (user.role === "admin") {
      const admin = await UserModel.findById(user.id);

      if (!admin) {
        return res.status(404).json({ succes: false, error: "User not found" });
      }

      const isCorrectPwd = await bcrypt.compare(userPwd, admin.password);

      if (!isCorrectPwd) {
        return res
          .status(400)
          .json({ succes: false, error: "Incorrect password" });
      }
    }

    await UserModel.findByIdAndDelete(userId);
    return res.status(201).json({
      success: true,
      message: "User has been deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "User id not provided" });
    }

    const result = await OrderModel.find({ customerId: userId });
    if (result.length > 0) {
      return res.status(201).json(result.length);
    }
  } catch (error) {
    next(error);
  }
};
