import { Request, Response, NextFunction } from 'express';

// ─── Generate unique order number ────────────────────────────────────────────
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `#${timestamp}${random}`;
};

// ─── Standard API response ────────────────────────────────────────────────────
export const sendSuccess = (
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

// ─── Async error handler wrapper ──────────────────────────────────────────────
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// ─── Calculate order totals ───────────────────────────────────────────────────
export const calculateSubtotal = (
  items: { price: number; quantity: number }[]
): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// ─── Estimate delivery date (5 days from now) ─────────────────────────────────
export const estimateDeliveryDate = (daysFromNow = 5): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};
