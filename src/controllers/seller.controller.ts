import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";

export const addMedicine = catchAsync(async (req: any, res: Response) => {
  console.log("Incoming Medicine Data:", req.body);
  const { name, price, stock, categoryId, manufacturer } = req.body;

  try {
    const medicine = await prisma.medicine.create({
      data: {
        name: name,
        price: Number(price),
        stock: Number(stock),
        sellerId: req.user?.id as string,
        manufacturer: manufacturer || "Generic",

        categoryId:
          categoryId && categoryId.trim() !== "" ? categoryId : undefined,
      },
    });

    console.log("Success! Medicine Created:", medicine.id);
    res.status(201).json(medicine);
  } catch (error: any) {
    console.error("PRISMA ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Database error. Check if categoryId is valid.",
      error: error.message,
    });
  }
});

export const updateMedicine = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id },
    });

    if (!medicine) return next(new AppError("Medicine not found", 404));

    if (medicine.sellerId !== req.user.id)
      return next(new AppError("Not your medicine", 403));

    const { name, price, stock, categoryId } = req.body;
    const updated = await prisma.medicine.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(price && { price: Number(price) }),
        ...(stock && { stock: Number(stock) }),
        ...(categoryId && { categoryId }),
      },
    });

    res.json(updated);
  },
);

export const deleteMedicine = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id },
    });

    if (!medicine) return next(new AppError("Medicine not found", 404));

    if (medicine.sellerId !== req.user?.id)
      return next(new AppError("Not your medicine", 403));

    await prisma.medicine.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Deleted successfully" });
  },
);

export const getSellerOrders = catchAsync(async (req: any, res: Response) => {
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId: req.user.id },
        },
      },
    },
    include: {
      items: {
        include: { medicine: true },
      },
    },
  });

  res.json(orders);
});

export const getMyMedicines = catchAsync(async (req: any, res: Response) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId: req.user.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(medicines);
});

export const updateOrderStatus = catchAsync(async (req: any, res: Response) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
  });

  res.json(order);
});
