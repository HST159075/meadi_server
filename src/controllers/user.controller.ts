import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { Request, Response, NextFunction } from "express";

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
    });

    if (!user) return next(new AppError("User not found", 404));

    res.json(user);
  },
);
