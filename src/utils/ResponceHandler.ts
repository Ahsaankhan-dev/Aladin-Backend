import { Response } from "express";
import { ApiResponse } from "../interfaces/auth.interface";
import { any } from "zod";

export const RESPONSE = () => {
    const sendResponse =<T=any,> (
        res: Response,
        data: any,
        statusCode: number,
        message: string
    ) => {
        const response:ApiResponse<T>={
            success:true,
            statusCode,
            message,
            data
        }
        return res.status(statusCode).json({response});
    };
    const sendErrorResponse = <T = any,>(
        res: Response,
        statusCode: number,
        message: string,
        errors?: any
    ) => {
        const responce: ApiResponse<T> = {
            success: false,
            statusCode,
            message,
            errors
        };
        return res.status(statusCode).json({ responce });
    };
    return{
        sendResponse,
        sendErrorResponse
    }
}