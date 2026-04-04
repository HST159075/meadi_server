import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";


export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  const category = await prisma.category.create({
    data: { name },
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});


export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }, 
  });

  res.status(200).json({
    success: true,
    data: categories,
  });
});


export const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body;

  const existingCategory = await prisma.category.findUnique({
    where: { id: id as string },
  });

  if (!existingCategory) {
    return next(new AppError("Category not found", 404));
  }

  const category = await prisma.category.update({
    where: { id: id as string },
    data: { name },
  });

  res.status(200).json({
    success: true,
    data: category,
  });
});


export const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const existingCategory = await prisma.category.findUnique({
    where: { id: id as string },
  });

  if (!existingCategory) {
    return next(new AppError("Category not found", 404));
  }

  await prisma.category.delete({
    where: { id: id as string },
  });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});