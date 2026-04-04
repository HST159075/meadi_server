import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller";
import { isAuthenticated, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getAllMedicines);
router.get("/:id", getMedicineById);

router.post(
  "/",
  isAuthenticated,
  authorize(["SELLER", "ADMIN"]),
  createMedicine,
);

router.put(
  "/:id",
  isAuthenticated,
  authorize(["SELLER", "ADMIN"]),
  updateMedicine,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize(["SELLER", "ADMIN"]),
  deleteMedicine,
);

export default router;
