import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: String,
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    quantity: { type: Number },
    price: { type: Number, required: true },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const weighBillDetails = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const OrderSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    items: {
      type: [itemsSchema],
    },
    weighbillAddress: {
      type: weighBillDetails,
    },
    deliveryMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: Boolean,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OrderModel = mongoose.model("order", OrderSchema);
