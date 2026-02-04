import { prisma } from "./lib/prisma";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error("An error occurred during database connection:", error);

    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
}
main();

export default app;
