import { Document } from "mongoose";

type tokenType = {
  id: string;
  role: "user" | "admin";
};

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class UnAuthenticatedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

interface IProduct {
  name: string;
  desc: string;
  price: number;
  comparePrice?: number;
  bundlePrice?: number;
  bundleSize?: number;
  category: string;
  images: string[];
  imageBlob: string[];
  isActive: boolean;
  isPreorder: boolean;
  isFeatured: boolean;
  colors: string[];
  sizes: string[];
  amountAvailable: number;
  sizeType: string;
}

interface OrderItem {
  productId: string;
  name: string;
  size?: string;
  color?: string;
  image: string;
  quantity: number;
  price: number;
  email: string;
}

interface IInformation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
  phone?: string;
}

interface IUser {
  _id: string;
  email: string;
  fullName: string;
  password: string;
  role: "admin" | "user";
  information: IInformation;
  createdAt: Date;
  updatedAt: Date;
}

interface WaybillDetails {
  name: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  city: string;
}

export interface IOrder {
  _id?: string;
  email: string;
  customerId: string;
  items: OrderItem[];
  weighbillAddress: WaybillDetails;
  deliveryMethod: string;
  paymentStatus: boolean;
  pickupLocation: string;
  orderStatus: string;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  role: "admin" | "user";
  information: IInformation;
}

type userInfo = {
  address: string;
  country: string;
  email: string;
  phone: string;
};

export {
  NotFoundError,
  UnAuthenticatedError,
  ForbiddenError,
  BadRequestError,
  IProduct,
  IUser,
  userInfo,
  tokenType,
};
