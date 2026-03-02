import mongoose, { Schema } from "mongoose";
import { IOrder } from "../interfaces/order.interface";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const trackingInfoSchema = new Schema(
  {
    carrier: { type: String, required: true },
    trackingNumber: { type: String, required: true },
    trackingUrl: { type: String },
    estimatedDelivery: { type: Date },
  },
  { _id: false }
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    note: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    items: { type: [orderItemSchema], required: true, validate: (v: any[]) => v.length > 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Confirmed",
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    trackingInfo: { type: trackingInfoSchema },
    placedAt: { type: Date, default: Date.now },
    estimatedDelivery: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
