import mongoose, { Schema } from "mongoose";
import { CProduct } from "../interfaces/auth.interface";
import { number } from "zod";



const ProductSchema = new Schema<CProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, unique: true, lowercase: true, trim: true },
    price:{type:Number,required:true},
    image: { type: String, required: true },
  }
);

export const Product = mongoose.model<CProduct>("Product", ProductSchema);
