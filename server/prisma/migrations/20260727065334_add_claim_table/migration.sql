-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."Claim" (
    "id" SERIAL NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "claimAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "public"."ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "policyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Claim_claimNumber_key" ON "public"."Claim"("claimNumber");

-- AddForeignKey
ALTER TABLE "public"."Claim" ADD CONSTRAINT "Claim_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "public"."Policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
