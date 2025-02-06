/*
  Warnings:

  - You are about to drop the column `backSide` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `frontSide` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `leftSide` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `rightSide` on the `Product` table. All the data in the column will be lost.
  - Added the required column `mainImage` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "backSide",
DROP COLUMN "frontSide",
DROP COLUMN "leftSide",
DROP COLUMN "rightSide",
ADD COLUMN     "fifthImage" TEXT,
ADD COLUMN     "firstImage" TEXT,
ADD COLUMN     "fourthImage" TEXT,
ADD COLUMN     "mainImage" TEXT NOT NULL,
ADD COLUMN     "secondImage" TEXT,
ADD COLUMN     "thirdImage" TEXT;
