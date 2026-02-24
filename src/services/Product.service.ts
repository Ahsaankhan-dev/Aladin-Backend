import { Product } from "../models/Product.model";

export const SProduct = () => {
  const CreateProductS = async (payload: {
    title: string;
    description?: string;
    price: number;
    image: Express.Multer.File;
  }) => {
    const { title, description, price, image } = payload;

    const product = await Product.create({
      title,
      description,
      price,
      image: image.filename,
    });

    return product;
  };
  const GetallProductS=async()=>{
    const AllProducts=Product.find();
    return AllProducts
  }

  return {
    CreateProductS,
    GetallProductS
  };
};
