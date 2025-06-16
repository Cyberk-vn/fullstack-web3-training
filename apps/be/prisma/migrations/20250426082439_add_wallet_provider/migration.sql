-- AlterEnum
ALTER TYPE "UserProvider" ADD VALUE 'wallet';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "walletAddress" TEXT;
