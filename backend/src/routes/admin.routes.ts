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
router.get("/:id",authMiddleware, getUserDetailsController);
router.put("/:id/update", authMiddleware, roleMiddleware(["superadmin"]), updateUserController);



export default router;
