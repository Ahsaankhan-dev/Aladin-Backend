import { Router } from "express";
import { OrderController } from "../controller/order.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  addTrackingSchema,
  cancelOrderSchema,
} from "../validation/order.validation";

export const orderRouter = Router();

// ─── PUBLIC ───────────────────────────────────────────────────────────────────
// Track order by order number or tracking ID (no login required)
orderRouter.get("/track/:query", OrderController().trackOrder);

// ─── USER (login required) ────────────────────────────────────────────────────
orderRouter.post("/", requireAuth, validate(createOrderSchema), OrderController().placeOrder);
orderRouter.get("/my-orders", requireAuth, OrderController().getMyOrders);
orderRouter.get("/my-orders/:id", requireAuth, OrderController().getMyOrderById);
orderRouter.patch("/:id/cancel", requireAuth, validate(cancelOrderSchema), OrderController().cancelOrder);

// ─── ADMIN only ───────────────────────────────────────────────────────────────
orderRouter.get("/", requireAuth, requireAdmin, OrderController().getAllOrders);
orderRouter.patch("/:id/status", requireAuth, requireAdmin, validate(updateOrderStatusSchema), OrderController().updateOrderStatus);
orderRouter.patch("/:id/tracking", requireAuth, requireAdmin, validate(addTrackingSchema), OrderController().addTracking);
