import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware.js";
import {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMyMedicines,
} from "../controllers/seller.controller.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(checkRole(["SELLER"]));

router.get("/", getMyMedicines);
router.post("/", addMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
