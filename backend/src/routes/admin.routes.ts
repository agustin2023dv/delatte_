import express from "express";
import { 
  getUsersController, 
  suspendUserController, 
  deleteUserController, 
  updateUserController, 
  getUserDetailsController
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["superadmin"]), getUsersController);
router.patch("/:id/suspend", authMiddleware, roleMiddleware(["superadmin"]), suspendUserController);
router.delete("/:id", authMiddleware, roleMiddleware(["superadmin"]), deleteUserController);
router.put("/:id", authMiddleware, roleMiddleware(["superadmin"]), updateUserController);
router.get("/:id", authMiddleware, roleMiddleware(["superadmin"]), getUserDetailsController);

export default router;
