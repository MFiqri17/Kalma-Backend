/*
  Warnings:

  - You are about to drop the column `images` on the `Articles` table. All the data in the column will be lost.
  - Changed the type of `content` on the `Articles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "images",
DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "MusicMeditations" ALTER COLUMN "author" DROP NOT NULL;
