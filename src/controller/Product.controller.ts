import { Request, Response } from "express";
import { SProduct } from "../services/Product.service";
import { RESPONSE } from "../utils/ResponceHandler";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

export const ProductController = () => {
  const { CreateProductS } = SProduct();

  const createProduct = async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        price,
      }: { title: string; description?: string; price: string } = req.body;

      const image = req.file as Express.Multer.File;

      const product = await CreateProductS({
        title,
        description,
        price: Number(price),
        image,
      });

      return RESPONSE().sendResponse(res,product,201,'Product Created Successfully...');
    } catch (error) {
      if (error instanceof ZodError) {
                      const errorMessages = error;
                      
                     return new AppError(error.message)
                  }
                  return new AppError(error instanceof Error ? error.message : String(error))
      }
  };
  const GetAllProducts=async(req:Request,res:Response)=>{
      const data=await SProduct().GetallProductS()
      return RESPONSE().sendResponse(res,data,200,'Products retrieved successfully...');
  }

  return {
    createProduct,
    GetAllProducts
  };
};
