
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role?: string };
}

interface OrderItemInput {
  medicineId: string;
  quantity: number;
}


export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, address } = req.body;
    const customerId = req.user?.id as string;

    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) throw new Error(`Medicine (ID: ${item.medicineId}) not found`);
        if (medicine.stock < item.quantity) {
          throw new Error(`${medicine.name} Not enough in stock.`);
        }

        const itemTotal = medicine.price * item.quantity;
        totalPrice += itemTotal;

       
        orderItemsToCreate.push({
          medicineId: medicine.id,
          quantity: item.quantity,
          price: medicine.price, 
        });

    
        await tx.medicine.update({
          where: { id: medicine.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return await tx.order.create({
        data: {
          customerId,
          totalPrice : Number(totalPrice),
          address,
          status: "PENDING",
          items: {
            create: orderItemsToCreate,
          },
        },
        include: { items: true },
      });
    });

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const customerId = req.user?.id as string;
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { medicine: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: "Order history not found." });
  }
};


export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id as string },
      include: { items: { include: { medicine: true } }, customer: true },
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ message: "The order was not received." });
  }
};

export const getSellerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const sellerId = req.user?.id as string;
    const orders = await prisma.order.findMany({
      where: { items: { some: { medicine: { sellerId } } } },
      include: { items: { include: { medicine: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: "Seller order list not found." });
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id as string;

    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status code" });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ message: "Unable to update status." });
  }
};