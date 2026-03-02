import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(4, 'Valid zip code is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  image: z.string().min(1, 'Product image is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const createOrderSchema = z.object({
  email: z.string().email('Valid email is required'),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  shippingCost: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']),
  note: z.string().optional(),
});

export const addTrackingSchema = z.object({
  carrier: z.string().min(1, 'Carrier name is required'),
  trackingNumber: z.string().min(1, 'Tracking number is required'),
  trackingUrl: z.string().url().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(5, 'Cancellation reason is required'),
});

export const trackOrderSchema = z.object({
  query: z.string().min(5, 'Order number or tracking ID is required'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type AddTrackingInput = z.infer<typeof addTrackingSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
