-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "description" DROP NOT NULL;
