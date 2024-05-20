-- DropIndex
DROP INDEX "Users_full_name_key";

-- AlterTable
ALTER TABLE "Journals" ADD COLUMN     "emotions" TEXT[],
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'user',
ALTER COLUMN "user_privacy" SET DEFAULT false,
ALTER COLUMN "is_verified" SET DEFAULT false,
ALTER COLUMN "last_logged_in" DROP NOT NULL,
ALTER COLUMN "last_logged_in" DROP DEFAULT;
