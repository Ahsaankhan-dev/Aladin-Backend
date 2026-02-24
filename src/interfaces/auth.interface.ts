import { Request } from "express";
import { UserRole } from "../models/user.model";
import express from "express";
export interface AuthedRequest extends Request {
  user?: { id: string; role: string };
}
export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: any;        
}

export interface CProduct{
  title:string,
  description:string,
  price:number,
  image:string
}