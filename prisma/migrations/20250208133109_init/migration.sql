/*
  Warnings:

  - You are about to drop the `WishlistItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistItem" DROP CONSTRAINT "WishlistItem_userId_fkey";

-- DropTable
DROP TABLE "WishlistItem";
