/*
  Warnings:

  - Changed the type of `emotion` on the `Journals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EMOTIONS" AS ENUM ('sad', 'angry', 'glad', 'elated');

-- AlterTable
ALTER TABLE "Journals" DROP COLUMN "emotion",
ADD COLUMN     "emotion" "EMOTIONS" NOT NULL;
