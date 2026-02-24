import "dotenv/config";
import app from "./app";
import { connectDB } from "./database/ConnectionDB";
import { env } from "process";

const PORT = Number(env.PORT || 8000);

try {
    connectDB()
    app.listen(PORT,()=>console.log('DB Connected Successfuly....'))
} catch (error) {
    console.log(error);
}
