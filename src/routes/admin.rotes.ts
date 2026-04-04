import express from "express";
import { checkRole } from "../middleware/role.middleware";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorize } from "../controllers/medicine.controller";

import { getUsers, updateUserStatus, getAllOrders, getDashboardStats } from "../controllers/admin.controller.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(authorize(["ADMIN"]));

router.get("/stats", getDashboardStats);
router.get("/users", isAuthenticated, checkRole(["ADMIN"]), getUsers);
router.patch("/users/:id", isAuthenticated, checkRole(["ADMIN"]), updateUserStatus);
router.get("/orders", isAuthenticated, checkRole(["ADMIN"]), getAllOrders);

export default router;