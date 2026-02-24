import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validation/auth.validation";
import { AuthController } from "../controller/user.controller";

const router = Router();

router.post("/register", validate(registerSchema), AuthController().register);
router.post("/login", validate(loginSchema), AuthController().login);
router.get("/me", requireAuth, AuthController().me);

export default router;
