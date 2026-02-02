// src/app.ts
import express11 from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String   @id @default(cuid())\n  name          String\n  email         String   @unique\n  emailVerified Boolean  @default(false)\n  image         String?\n  password      String?\n  role          Role     @default(CUSTOMER)\n  status        Boolean  @default(true)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n\n  medicines Medicine[]\n  orders    Order[]\n  reviews   Review[]\n  sessions  Session[]\n  accounts  Account[]\n}\n\nmodel Session {\n  id        String   @id\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  token     String   @unique\n  expiresAt DateTime\n  ipAddress String?\n  userAgent String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Account {\n  id                    String    @id @default(cuid())\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accountId             String\n  providerId            String\n  accessToken           String?\n  refreshToken          String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  idToken               String?\n  expiresAt             DateTime?\n  password              String?\n  scope                 String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Verification {\n  id         String   @id @default(cuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nmodel Medicine {\n  id           String   @id @default(cuid())\n  name         String\n  price        Float\n  description  String?\n  stock        Int\n  manufacturer String\n  image        String?\n  categoryId   String\n  category     Category @relation(fields: [categoryId], references: [id])\n\n  sellerId String\n  seller   User   @relation(fields: [sellerId], references: [id])\n\n  createdAt  DateTime    @default(now())\n  orderItems OrderItem[]\n  reviews    Review[]\n}\n\nmodel Category {\n  id        String     @id @default(cuid())\n  name      String     @unique\n  medicines Medicine[]\n}\n\nmodel Order {\n  id         String      @id @default(cuid())\n  customerId String\n  customer   User        @relation(fields: [customerId], references: [id])\n  totalPrice Float\n  address    String\n  status     String      @default("PENDING")\n  items      OrderItem[]\n  createdAt  DateTime    @default(now())\n}\n\nmodel OrderItem {\n  id         String   @id @default(cuid())\n  orderId    String\n  order      Order    @relation(fields: [orderId], references: [id])\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n  quantity   Int\n  price      Float\n}\n\nmodel Review {\n  id         String   @id @default(cuid())\n  rating     Int\n  comment    String?\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id])\n  customerId String\n  customer   User     @relation(fields: [customerId], references: [id])\n  createdAt  DateTime @default(now())\n\n  @@unique([customerId, medicineId])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"password","kind":"scalar","type":"String"},{"name":"scope","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"description","kind":"scalar","type":"String"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"totalPrice","kind":"scalar","type":"Float"},{"name":"address","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { bearer } from "better-auth/plugins";
var auth = betterAuth({
  baseURL: "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true
  },
  trustedOrigins: ["http://localhost:3000"],
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: false
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER"
      }
    }
  }
});

// src/app.ts
import { toNodeHandler as toNodeHandler2 } from "better-auth/node";

// src/routes/auth.routes.ts
import express from "express";

// src/controllers/auth.controller.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "secret123";
var register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!["CUSTOMER", "SELLER", "ADMIN"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already used" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Registration failed" });
  }
};
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

// src/routes/auth.routes.ts
import { toNodeHandler } from "better-auth/node";
var router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.all("/:path", toNodeHandler(auth));
var auth_routes_default = router;

// src/routes/admin.rotes.ts
import express2 from "express";

// src/middleware/role.middleware.ts
var checkRole = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next();
  };
};

// src/middleware/auth.middleware.ts
import { fromNodeHeaders } from "better-auth/node";
var isAuthenticated = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });
    console.log("Session Data:", session);
    if (!session || !session.user) {
      console.log("Auth Failed: No session found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Session not found. Please login.\u0964"
      });
    }
    const user = session.user;
    console.log("User Role from Session:", user.role);
    if (user.status === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended."
      });
    }
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email
    };
    req.session = session.session;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Authentication"
    });
  }
};

// src/controllers/medicine.controller.ts
var authorize = (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to do this."
      });
    }
    next();
  };
};
var getAllMedicines = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, manufacturer, search } = req.query;
    const where = {};
    if (category) where.categoryId = category;
    if (manufacturer) where.manufacturer = manufacturer;
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (minPrice !== void 0 || maxPrice !== void 0) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    const medicines = await prisma.medicine.findMany({
      where,
      include: {
        category: { select: { name: true } },
        seller: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Medicine list not found." });
  }
};
var getMedicineById = async (req, res) => {
  try {
    const id = req.params.id;
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: {
        category: true,
        seller: { select: { name: true, email: true } }
      }
    });
    if (!medicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
var createMedicine = async (req, res) => {
  try {
    const { name, price, description, categoryId, stock, manufacturer, image } = req.body;
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
        sellerId: req.user.id
      }
    });
    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    res.status(400).json({ success: false, message: "It was not possible to make medicine." });
  }
};
var updateMedicine = async (req, res) => {
  try {
    const id = req.params.id;
    const sellerId = req.user?.id;
    const existingMedicine = await prisma.medicine.findUnique({
      where: { id }
    });
    if (!existingMedicine) {
      return res.status(404).json({ success: false, message: "Medicine not found" });
    }
    if (req.user?.role !== "ADMIN" && existingMedicine.sellerId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own medicines."
      });
    }
    const { name, price, stock, description, categoryId, image, manufacturer } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (manufacturer) updateData.manufacturer = manufacturer;
    if (image) updateData.image = image;
    if (categoryId) updateData.categoryId = categoryId;
    if (price !== void 0 && price !== null) {
      updateData.price = parseFloat(price.toString());
    }
    if (stock !== void 0 && stock !== null) {
      updateData.stock = parseInt(stock.toString());
    }
    const medicine = await prisma.medicine.update({
      where: { id },
      data: updateData
    });
    res.status(200).json({ success: true, data: medicine });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Update unsuccessful" });
  }
};
var deleteMedicine = async (req, res) => {
  try {
    const id = req.params.id;
    const sellerId = req.user?.id;
    const existingMedicine = await prisma.medicine.findUnique({
      where: { id }
    });
    if (!existingMedicine)
      return res.status(404).json({ message: "Medicine not found" });
    if (req.user?.role !== "ADMIN" && existingMedicine.sellerId !== sellerId) {
      return res.status(403).json({ message: "You cannot delete this medicine." });
    }
    await prisma.medicine.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
};

// src/controllers/admin.controller.ts
var getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true }
  });
  res.json(users);
};
var updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status }
  });
  res.json(user);
};
var getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: { include: { medicine: true } }, customer: true }
  });
  res.json(orders);
};

// src/routes/admin.rotes.ts
var router2 = express2.Router();
router2.use(isAuthenticated);
router2.use(authorize(["ADMIN"]));
router2.get("/users", isAuthenticated, checkRole(["ADMIN"]), getUsers);
router2.patch("/users/:id", isAuthenticated, checkRole(["ADMIN"]), updateUserStatus);
router2.get("/orders", isAuthenticated, checkRole(["ADMIN"]), getAllOrders);
var admin_rotes_default = router2;

// src/routes/medicine.routes.ts
import express3 from "express";
var router3 = express3.Router();
router3.get("/", getAllMedicines);
router3.get("/:id", getMedicineById);
router3.post(
  "/",
  isAuthenticated,
  authorize(["SELLER", "ADMIN"]),
  createMedicine
);
router3.put(
  "/:id",
  isAuthenticated,
  authorize(["SELLER", "ADMIN"]),
  updateMedicine
);
router3.delete(
  "/:id",
  isAuthenticated,
  authorize(["SELLER", "ADMIN"]),
  deleteMedicine
);
var medicine_routes_default = router3;

// src/routes/seller.medicine.route.ts
import express4 from "express";

// src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  status;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// src/controllers/seller.controller.ts
var addMedicine = catchAsync(async (req, res) => {
  console.log("Incoming Medicine Data:", req.body);
  const { name, price, stock, categoryId, manufacturer } = req.body;
  try {
    const medicine = await prisma.medicine.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        sellerId: req.user?.id,
        manufacturer: manufacturer || "Generic",
        categoryId: categoryId && categoryId.trim() !== "" ? categoryId : void 0
      }
    });
    console.log("Success! Medicine Created:", medicine.id);
    res.status(201).json(medicine);
  } catch (error) {
    console.error("PRISMA ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Database error. Check if categoryId is valid.",
      error: error.message
    });
  }
});
var updateMedicine2 = catchAsync(
  async (req, res, next) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id }
    });
    if (!medicine) return next(new AppError("Medicine not found", 404));
    if (medicine.sellerId !== req.user.id)
      return next(new AppError("Not your medicine", 403));
    const { name, price, stock, categoryId } = req.body;
    const updated = await prisma.medicine.update({
      where: { id: req.params.id },
      data: {
        ...name && { name },
        ...price && { price: Number(price) },
        ...stock && { stock: Number(stock) },
        ...categoryId && { categoryId }
      }
    });
    res.json(updated);
  }
);
var deleteMedicine2 = catchAsync(
  async (req, res, next) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id: req.params.id }
    });
    if (!medicine) return next(new AppError("Medicine not found", 404));
    if (medicine.sellerId !== req.user?.id)
      return next(new AppError("Not your medicine", 403));
    await prisma.medicine.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "Deleted successfully" });
  }
);
var getSellerOrders = catchAsync(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: { sellerId: req.user.id }
        }
      }
    },
    include: {
      items: {
        include: { medicine: true }
      }
    }
  });
  res.json(orders);
});
var getMyMedicines = catchAsync(async (req, res) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId: req.user.id
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  res.json(medicines);
});
var updateOrderStatus = catchAsync(async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status }
  });
  res.json(order);
});

// src/routes/seller.medicine.route.ts
var router4 = express4.Router();
router4.use(isAuthenticated);
router4.use(checkRole(["SELLER"]));
router4.get("/", getMyMedicines);
router4.post("/", addMedicine);
router4.put("/:id", updateMedicine2);
router4.delete("/:id", deleteMedicine2);
var seller_medicine_route_default = router4;

// src/routes/order.routes.ts
import express5 from "express";

// src/controllers/order.controller.ts
var createOrder = async (req, res) => {
  try {
    const { items, address } = req.body;
    const customerId = req.user?.id;
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderItemsToCreate = [];
      for (const item of items) {
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId }
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
          price: medicine.price
        });
        await tx.medicine.update({
          where: { id: medicine.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
      return await tx.order.create({
        data: {
          customerId,
          totalPrice: Number(totalPrice),
          address,
          status: "PENDING",
          items: {
            create: orderItemsToCreate
          }
        },
        include: { items: true }
      });
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getOrders = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { medicine: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: "Order history not found." });
  }
};
var getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { medicine: true } }, customer: true }
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ message: "The order was not received." });
  }
};
var getSellerOrders2 = async (req, res) => {
  try {
    const sellerId = req.user?.id;
    const orders = await prisma.order.findMany({
      where: { items: { some: { medicine: { sellerId } } } },
      include: { items: { include: { medicine: true } }, customer: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: "Seller order list not found." });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status code" });
    }
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ message: "Unable to update status." });
  }
};

// src/routes/order.routes.ts
var router5 = express5.Router();
router5.post("/", isAuthenticated, checkRole(["CUSTOMER"]), createOrder);
router5.get("/", isAuthenticated, checkRole(["CUSTOMER"]), getOrders);
router5.get("/seller", isAuthenticated, checkRole(["SELLER"]), getSellerOrders2);
router5.get("/:id", isAuthenticated, getOrderById);
router5.patch(
  "/:id/status",
  isAuthenticated,
  checkRole(["SELLER", "ADMIN"]),
  updateOrderStatus2
);
var order_routes_default = router5;

// src/routes/seller.order.routes.ts
import express6 from "express";
var router6 = express6.Router();
router6.get("/", checkRole(["SELLER"]), getSellerOrders2);
router6.patch("/:id", checkRole(["SELLER"]), updateOrderStatus2);
var seller_order_routes_default = router6;

// src/routes/category.routes.ts
import express7 from "express";

// src/controllers/category.controller.ts
var createCategory = catchAsync(async (req, res) => {
  const category = await prisma.category.create({
    data: { name: req.body.name }
  });
  res.status(201).json(category);
});
var getCategories = catchAsync(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});
var updateCategory = catchAsync(async (req, res, next) => {
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name: req.body.name }
  });
  if (!category) return next(new AppError("Category not found", 404));
  res.json(category);
});
var deleteCategory = catchAsync(async (req, res) => {
  await prisma.category.delete({
    where: { id: req.params.id }
  });
  res.json({ message: "Deleted" });
});

// src/routes/category.routes.ts
var router7 = express7.Router();
router7.get("/", getCategories);
router7.post("/", createCategory);
router7.put("/:id", updateCategory);
router7.delete("/:id", deleteCategory);
var category_routes_default = router7;

// src/routes/review.routes.ts
import express8 from "express";

// src/controllers/review.controller.ts
var addReview = catchAsync(
  async (req, res, next) => {
    const { rating, comment, medicineId } = req.body;
    if (!req.user?.id) {
      return next(new AppError("Please login to provide a review", 401));
    }
    const review = await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        medicineId,
        customerId: req.user?.id
      }
    });
    res.status(201).json(review);
  }
);
var getMedicineReviews = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      return next(new AppError("Invalid Medicine ID", 400));
    }
    const reviews = await prisma.review.findMany({
      where: {
        medicineId: id
      },
      include: {
        customer: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(reviews);
  }
);

// src/routes/review.routes.ts
var router8 = express8.Router();
router8.get("/medicine/:id", getMedicineReviews);
router8.post("/", addReview);
var review_routes_default = router8;

// src/routes/seller.routes.ts
import express9 from "express";
var router9 = express9.Router();
router9.post("/medicines", addMedicine);
router9.put("/medicines/:id", updateMedicine2);
router9.delete("/medicines/:id", deleteMedicine2);
router9.get("/orders", getSellerOrders);
router9.patch("/orders/:id", updateOrderStatus);
var seller_routes_default = router9;

// src/routes/user.routes.ts
import express10 from "express";

// src/controllers/user.controller.ts
var getUser = catchAsync(
  async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });
    if (!user) return next(new AppError("User not found", 404));
    res.json(user);
  }
);

// src/routes/user.routes.ts
var router10 = express10.Router();
router10.get("/:id", getUser);
var user_routes_default = router10;

// src/middleware/error.middleware.ts
var globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status || "error",
    message: err.message
  });
};

// src/app.ts
var app = express11();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);
app.use(express11.json());
app.use(express11.urlencoded({ extended: true }));
app.use("/api/auth", auth_routes_default);
app.all("/api/auth/*all", toNodeHandler2(auth));
app.get("/", (req, res) => {
  res.send("MediStore API is running..!!!");
});
app.use("/api/admin", admin_rotes_default);
app.use("/api/medicines", medicine_routes_default);
app.use("/api/seller/medicines", seller_medicine_route_default);
app.use("/api/orders", order_routes_default);
app.use("/api/seller/orders", seller_order_routes_default);
app.use("/api/categories", category_routes_default);
app.use("/api/reviews", review_routes_default);
app.use("/api/seller", seller_routes_default);
app.use("/api/users", user_routes_default);
app.use(globalErrorHandler);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
