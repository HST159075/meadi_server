import { Prisma } from "../../generated/prisma/client";
import {  prisma } from "../lib/prisma";
import { Request, Response } from "express";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
   
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const deliveredWhere: Prisma .OrderWhereInput = {
      status: { equals: "DELIVERED", mode: "insensitive" },
    };

    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        ...deliveredWhere,
        createdAt: { gte: sevenDaysAgo }
      },
      _sum: { totalPrice: true },
      orderBy: { createdAt: 'asc' }
    });

    const salesHistory = salesData.map(item => ({
      date: new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      amount: item._sum.totalPrice || 0
    }));

  
    const revenue = await prisma.order.aggregate({
      where: deliveredWhere,
      _sum: { totalPrice: true }
    });

    const [userCount, medicineCount, orderCount, lowStockCount] = await Promise.all([
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.medicine.count(),
      prisma.order.count(),
      prisma.medicine.count({ where: { stock: { lt: 5 } } })  
    ]);


    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { name: true } } }
    });

    res.json({
      success: true,
      data: {
        totalRevenue: revenue._sum.totalPrice || 0,
        totalCustomers: userCount,
        totalMedicines: medicineCount,
        totalOrders: orderCount,
        lowStockAlert: lowStockCount,
        recentOrders: recentOrders,
        salesHistory: salesHistory 
      }
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ success: false, message: "Stats load error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id as string },
      data: { status }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        items: { include: { medicine: true } }, 
        customer: { select: { name: true, email: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};