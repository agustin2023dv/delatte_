import express from "express";
import { 
  getUsersController, 
  suspendUserController, 
  deleteUserController, 
  updateUserController, 
  getUserDetailsController,
  loginAdminController
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { loginRateLimiter } from "../middlewares/rateLimiter.middlware";

const router = express.Router();


router.post('/login-admin', loginRateLimiter, loginAdminController);
router.get("/", authMiddleware, roleMiddleware(["superadmin"]), getUsersController);
router.patch("/:id/suspend", authMiddleware, roleMiddleware(["superadmin"]), suspendUserController);
router.delete("/:id", authMiddleware, roleMiddleware(["superadmin"]), deleteUserController);
router.put("/:id", authMiddleware, roleMiddleware(["superadmin"]), updateUserController);
router.get("/:id", authMiddleware, roleMiddleware(["superadmin"]), getUserDetailsController);

export default router;
