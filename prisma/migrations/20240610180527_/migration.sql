/*
  Warnings:

  - The `content` column on the `Articles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `image` to the `Articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "image" TEXT NOT NULL,
DROP COLUMN "content",
ADD COLUMN     "content" TEXT[];
