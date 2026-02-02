import express, { RequestHandler } from "express";
import {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/seller.controller";

const router = express.Router();

router.post("/medicines", addMedicine);
router.put("/medicines/:id", updateMedicine);
router.delete("/medicines/:id", deleteMedicine);

router.get("/orders", getSellerOrders);
router.patch("/orders/:id", updateOrderStatus);

export default router;
