import { Router } from "express";
import { ProductController } from "../controller/Product.controller";
import { upload } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";
import { CProductSchema } from "../validation/auth.validation";




export const Productrouter=Router();

Productrouter.post('/createproduct',upload.single("image"), validate(CProductSchema),ProductController().createProduct)
Productrouter.get('/allproducts',ProductController().GetAllProducts)