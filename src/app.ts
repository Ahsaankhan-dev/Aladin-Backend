import express from "express";
import { url } from "inspector";
import router from "./routes/auth.route";
import { errorHandler } from "./middleware/error.middleware";
import { Productrouter } from "./routes/Product.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get("/", (_req, res) => {
  res.send("API running");
});
app.use("/api/auth", router);
app.use('/api/product',Productrouter)
app.use(errorHandler);

export default app;
