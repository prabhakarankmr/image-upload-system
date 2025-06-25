-- AlterTable
ALTER TABLE "images" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedStatus" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trash" BOOLEAN NOT NULL DEFAULT false;
