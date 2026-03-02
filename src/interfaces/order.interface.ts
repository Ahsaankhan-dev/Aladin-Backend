import { Document, Types } from "mongoose";

export type OrderStatus =
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface IOrderItem {
  productId: Types.ObjectId | string;
  name: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface ITrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
}

export interface IStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  email: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  statusHistory: IStatusHistory[];
  trackingInfo?: ITrackingInfo;
  placedAt: Date;
  estimatedDelivery?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
