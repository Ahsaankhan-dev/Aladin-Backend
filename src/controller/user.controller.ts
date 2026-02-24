import { ZodError } from "zod";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../utils/asynHandler";
import { RESPONSE } from "../utils/ResponceHandler";
import { registerSchema } from "../validation/auth.validation";
import { Request, Response } from "express";
import { AppError } from "../utils/appError";

export const AuthController = () => {
    const register = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { name, email, password } = registerSchema.parse(req.body);
            const data = await AuthService().registerUser(name, email, password);
            
            return RESPONSE().sendResponse(res, data, 201, 'User created Successfully...');
        } catch (error: any) {            if (error instanceof ZodError) {
                const errorMessages = error;
                
                return new AppError(error.message)
            }

            return RESPONSE().sendErrorResponse(
                res, 
                error.statusCode || 500, 
                error.message || "Internal Server Error"
            );
        }
    });

    // Login aur Me mein bhi isi tarah try-catch apply hoga
    const login = asyncHandler(async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const data = await AuthService().loginUser(email, password);
            return RESPONSE().sendResponse(res, data.user, 200, 'User login Successfully...');
        } catch (error: any) {
            if (error instanceof ZodError) {
                const errorMessages = error;
                
               return new AppError(error.message)
            }
            return RESPONSE().sendErrorResponse(res, error.statusCode || 401, error.message);
        }
    });
    const me = asyncHandler(async (req: any, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return RESPONSE().sendErrorResponse(res, 401, "Unauthorized: No User ID found");
            }
            const user = await AuthService().getMe(userId);
            return RESPONSE().sendResponse(res, user, 200, 'User data fetched Successfully...');
        } catch (error: any) {
            return new AppError(error);
        }
    });

    return { register, login ,me};
}