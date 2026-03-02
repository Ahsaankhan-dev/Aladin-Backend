import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { RESPONSE } from "../utils/ResponceHandler";
import { asyncHandler } from "../utils/asynHandler";
import { AppError } from "../utils/appError";
import { OrderStatus } from "../interfaces/order.interface";

export const OrderController = () => {

  // ─── USER: Place new order ──────────────────────────────────────────────────
  const placeOrder = asyncHandler(async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return RESPONSE().sendErrorResponse(res, 401, "Unauthorized");

      const order = await OrderService().createOrder(userId, req.body);
      return RESPONSE().sendResponse(res, order, 201, "Order placed successfully!");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  // ─── USER: Get my orders ────────────────────────────────────────────────────
  const getMyOrders = asyncHandler(async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return RESPONSE().sendErrorResponse(res, 401, "Unauthorized");

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const data = await OrderService().getMyOrders(userId, page, limit);
      return RESPONSE().sendResponse(res, data, 200, "Orders fetched successfully");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  // ─── USER: Get single order by ID ───────────────────────────────────────────
  const getMyOrderById = asyncHandler(async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return RESPONSE().sendErrorResponse(res, 401, "Unauthorized");

      const order = await OrderService().getOrderById(req.params.id, userId);
      return RESPONSE().sendResponse(res, order, 200, "Order fetched successfully");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  // ─── PUBLIC: Track order by number or tracking ID ──────────────────────────
  const trackOrder = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { query } = req.params;
      const order = await OrderService().trackOrder(query);

      const trackData = {
        orderNumber: (order as any).orderNumber,
        status: (order as any).status,
        statusHistory: (order as any).statusHistory,
        trackingInfo: (order as any).trackingInfo,
        placedAt: (order as any).placedAt,
        estimatedDelivery: (order as any).estimatedDelivery,
        items: (order as any).items.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress: {
          city: (order as any).shippingAddress.city,
          state: (order as any).shippingAddress.state,
        },
      };

      return RESPONSE().sendResponse(res, trackData, 200, "Order tracking info fetched");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  // ─── USER: Cancel order ─────────────────────────────────────────────────────
  const cancelOrder = asyncHandler(async (req: any, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return RESPONSE().sendErrorResponse(res, 401, "Unauthorized");

      const order = await OrderService().cancelOrder(req.params.id, userId, req.body);
      return RESPONSE().sendResponse(res, order, 200, "Order cancelled successfully");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 400, error.message);
    }
  });

  // ─── ADMIN: Get all orders ──────────────────────────────────────────────────
  const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as OrderStatus | undefined;

      const data = await OrderService().getAllOrders(page, limit, status);
      return RESPONSE().sendResponse(res, data, 200, "All orders fetched successfully");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  // ─── ADMIN: Update order status ─────────────────────────────────────────────
  const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    try {
      const order = await OrderService().updateOrderStatus(req.params.id, req.body);
      return RESPONSE().sendResponse(res, order, 200, "Order status updated successfully");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  // ─── ADMIN: Add tracking info ───────────────────────────────────────────────
  const addTracking = asyncHandler(async (req: Request, res: Response) => {
    try {
      const order = await OrderService().addTrackingInfo(req.params.id, req.body);
      return RESPONSE().sendResponse(res, order, 200, "Tracking info added successfully");
    } catch (error: any) {
      return RESPONSE().sendErrorResponse(res, error.statusCode || 500, error.message);
    }
  });

  return {
    placeOrder,
    getMyOrders,
    getMyOrderById,
    trackOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    addTracking,
  };
};
