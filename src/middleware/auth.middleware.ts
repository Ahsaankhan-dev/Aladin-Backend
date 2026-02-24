import { Response, NextFunction } from "express";
import { AuthedRequest } from "../interfaces/auth.interface";
import { verifyToken } from "../utils/jwt";
import { RESPONSE } from "../utils/ResponceHandler";


export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return RESPONSE().sendErrorResponse(res,401,"Missing token");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch(error) {
    return RESPONSE().sendErrorResponse(res,401,"Invalid token",error);
  }
}
