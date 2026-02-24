import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { RESPONSE } from "../utils/ResponceHandler";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof AppError ? err.statusCode : 500;

  return RESPONSE().sendErrorResponse(res,status,err?.message || "Something went wrong",err)
}
