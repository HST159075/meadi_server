/*
  Warnings:

  - Added the required column `updatedAt` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
