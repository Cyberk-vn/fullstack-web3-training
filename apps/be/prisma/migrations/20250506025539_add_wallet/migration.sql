/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_walletAddress_key" ON "Profile"("walletAddress");
