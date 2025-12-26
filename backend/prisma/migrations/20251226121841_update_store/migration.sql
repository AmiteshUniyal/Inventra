/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Store_code_key" ON "Store"("code");
