import { Types } from "mongoose";
import Order from "../models/order.model";
import { IOrder, OrderStatus } from "../interfaces/order.interface";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  AddTrackingInput,
  CancelOrderInput,
} from "../validation/order.validation";
import { AppError } from "../utils/appError";

// ─── Helper functions ─────────────────────────────────────────────────────────
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `#${timestamp}${random}`;
};

const calculateSubtotal = (items: { price: number; quantity: number }[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const estimateDeliveryDate = (daysFromNow = 5): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

// ─── Order Service ────────────────────────────────────────────────────────────
export const OrderService = () => {

  // USER: Place new order
  const createOrder = async (userId: string, input: CreateOrderInput): Promise<IOrder> => {
    const subtotal = calculateSubtotal(input.items);
    const total = subtotal + (input.shippingCost || 0) + (input.tax || 0);
    const orderNumber = generateOrderNumber();
    const estimatedDelivery = estimateDeliveryDate(5);

    const order = await Order.create({
      orderNumber,
      user: new Types.ObjectId(userId),
      email: input.email,
      items: input.items.map((item) => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
      })),
      shippingAddress: input.shippingAddress,
      subtotal,
      shippingCost: input.shippingCost || 0,
      tax: input.tax || 0,
      total,
      status: "Confirmed",
      statusHistory: [{ status: "Confirmed", timestamp: new Date(), note: "Order placed successfully" }],
      placedAt: new Date(),
      estimatedDelivery,
    });

    return order;
  };

  // USER: Get my orders (paginated)
  const getMyOrders = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<{ orders: IOrder[]; total: number; pages: number }> => {

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IOrder[]>(),   // ✅ FIX HERE
    Order.countDocuments({ user: new Types.ObjectId(userId) }),
  ]);

  return {
    orders,
    total,
    pages: Math.ceil(total / limit)
  };
};

  // USER: Get single order by ID
  const getOrderById = async (orderId: string, userId: string): Promise<IOrder | null> => {
    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      user: new Types.ObjectId(userId),
    });
    if (!order) throw new AppError("Order not found", 404);
    return order;
  };

  // PUBLIC: Track order by order number or tracking ID
  const trackOrder = async (query: string): Promise<IOrder | null> => {
    const order = await Order.findOne({
      $or: [
        { orderNumber: query },
        { "trackingInfo.trackingNumber": query },
      ],
    });
    if (!order) throw new AppError("No order found with this number or tracking ID", 404);
    return order;
  };

  // USER: Cancel order
  const cancelOrder = async (
    orderId: string,
    userId: string,
    input: CancelOrderInput
  ): Promise<IOrder> => {
    const order = await Order.findOne({
      _id: new Types.ObjectId(orderId),
      user: new Types.ObjectId(userId),
    });

    if (!order) throw new AppError("Order not found", 404);

    const nonCancellable: OrderStatus[] = ["Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (nonCancellable.includes(order.status)) {
      throw new AppError(`Order cannot be cancelled. Current status: ${order.status}`, 400);
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = input.reason;
    order.statusHistory.push({
      status: "Cancelled",
      timestamp: new Date(),
      note: input.reason,
    });

    return order.save();
  };

  // ADMIN: Get all orders
  const getAllOrders = async (
    page = 1,
    limit = 20,
    status?: OrderStatus
  ): Promise<{ orders: IOrder[]; total: number; pages: number }> => {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    return { orders, total, pages: Math.ceil(total / limit) };
  };

  // ADMIN: Update order status
  const updateOrderStatus = async (
    orderId: string,
    input: UpdateOrderStatusInput
  ): Promise<IOrder> => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    order.status = input.status;
    order.statusHistory.push({
      status: input.status,
      timestamp: new Date(),
      note: input.note,
    });

    if (input.status === "Delivered") {
      order.estimatedDelivery = new Date();
    }

    return order.save();
  };

  // ADMIN: Add tracking info
  const addTrackingInfo = async (
    orderId: string,
    input: AddTrackingInput
  ): Promise<IOrder> => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    order.trackingInfo = {
      carrier: input.carrier,
      trackingNumber: input.trackingNumber,
      trackingUrl: input.trackingUrl,
      estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) : undefined,
    };

    if (order.status === "Confirmed" || order.status === "Processing") {
      order.status = "Shipped";
      order.statusHistory.push({
        status: "Shipped",
        timestamp: new Date(),
        note: `Shipped via ${input.carrier}. Tracking: ${input.trackingNumber}`,
      });
    }

    return order.save();
  };

  return {
    createOrder,
    getMyOrders,
    getOrderById,
    trackOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    addTrackingInfo,
  };
};
