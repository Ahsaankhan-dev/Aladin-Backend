import { title } from "process";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const CProductSchema=z.object({
  title:z.string().min(5,'Title must be at least 5 characters'),
  description:z.string().min(10,'Description must be at least 5 characters'),
  price:z.string().min(1,'Price must be at least 5 characters')
})
