import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    console.log("Session Data:", session);

    if (!session || !session.user) {
      console.log("Auth Failed: No session found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Session not found. Please login.",
      });
    }

    const user = session.user as any;

    if (user.status === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    (req as any).user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    (req as any).session = session.session;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Authentication",
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};
