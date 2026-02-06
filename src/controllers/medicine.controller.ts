import { prisma } from "../lib/prisma";
import { Request, Response, NextFunction } from "express";


interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}


export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to do this.",
      });
    }
    next();
  };
};


export const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const { category, minPrice, maxPrice, manufacturer, search } = req.query;
    const where: any = {};

    if (category) where.categoryId = category as string;
    if (manufacturer) where.manufacturer = manufacturer as string;
    if (search) {
      where.name = { contains: search as string, mode: "insensitive" };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const medicines = await prisma.medicine.findMany({
      where: where,
      include: {
        category: { select: { name: true } },
        seller: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Medicine list not found." });
  }
};


export const getMedicineById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; 
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        category: true,
        seller: { select: { name: true, email: true } },
      },
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }

    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const { name, price, description, categoryId, stock, manufacturer, image } =
      req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Seller identity not found." });
    }

    const medicine = await prisma.medicine.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        categoryId,
        stock: parseInt(stock),
        manufacturer,
        image,
        sellerId: req.user.id,
      },
    });

    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "It was not possible to make medicine." });
  }
};

export const updateMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const sellerId = req.user?.id;

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!existingMedicine) {
      return res
        .status(404)
        .json({ success: false, message: "Medicine not found" });
    }
    if (req.user?.role !== "ADMIN" && existingMedicine.sellerId !== sellerId) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only update your own medicines.",
        });
    }

    const { name, price, stock, description, categoryId, image, manufacturer } =
      req.body;


    const updateData: any = {};

  
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (manufacturer) updateData.manufacturer = manufacturer;
    if (image) updateData.image = image;
    if (categoryId) updateData.categoryId = categoryId; 

    if (price !== undefined && price !== null) {
      updateData.price = parseFloat(price.toString());
    }

    if (stock !== undefined && stock !== null) {
      updateData.stock = parseInt(stock.toString());
    }

    const medicine = await prisma.medicine.update({
      where: { id },
      data: updateData, 
    });

    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Update unsuccessful" });
  }
};



export const deleteMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string; 
    const sellerId = req.user?.id;

    const existingMedicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!existingMedicine)
      return res.status(404).json({ message: "Medicine not found" });

    if (req.user?.role !== "ADMIN" && existingMedicine.sellerId !== sellerId) {
      return res
        .status(403)
        .json({ message: "You cannot delete this medicine." });
    }

    await prisma.medicine.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};
