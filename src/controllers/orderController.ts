import type { NextFunction, Request, Response } from "express";
import { OrderModel } from "../schemas/orderSchema";
import { tokenType } from "../utils/types";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = req.body;

    if (!order) {
      return res.status(400).json({ message: "No order provided" });
    }

    const newOrder = new OrderModel(order);
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.user;

    let userOrders;

    if (userId) {
      userOrders = await OrderModel.find({ customerId: userId });

      if (userOrders.length === 0) {
        return res.status(404).json({ error: "This user has no order" });
      }

      return res.status(201).json(userOrders);
    }

    const user: tokenType = res.locals.user;

    console.log({ user });

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    userOrders = await OrderModel.find();

    res.status(201).json(userOrders);
  } catch (error: any) {
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.status(400).json({
        message: "Order id not provided",
      });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(400).json({
        message: "Order not found",
      });
    }

    res.status(201).json(order);
  } catch (error: any) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.orderId;
    const status = req.body.status;

    if (!orderId) {
      return res.status(400).json({ error: "Order Id is not provided" });
    }

    if (!status) {
      return res.status(400).json({ error: "Status is not provided" });
    }

    const result = await OrderModel.updateOne(
      { _id: orderId },
      { $set: { orderStatus: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
