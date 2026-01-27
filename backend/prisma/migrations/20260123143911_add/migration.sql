-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "BulkUploadJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dashboard" BOOLEAN NOT NULL DEFAULT false,
    "dailyWalkinsVisitors" BOOLEAN NOT NULL DEFAULT false,
    "dailyWalkinsSessions" BOOLEAN NOT NULL DEFAULT false,
    "digitalEnquiry" BOOLEAN NOT NULL DEFAULT false,
    "fieldInquiry" BOOLEAN NOT NULL DEFAULT false,
    "deliveryUpdate" BOOLEAN NOT NULL DEFAULT false,
    "settingsProfile" BOOLEAN NOT NULL DEFAULT false,
    "settingsVehicleModels" BOOLEAN NOT NULL DEFAULT false,
    "settingsLeadSources" BOOLEAN NOT NULL DEFAULT false,
    "settingsWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkUploadJob" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "BulkUploadJobStatus" NOT NULL DEFAULT 'QUEUED',
    "totalRows" INTEGER NOT NULL,
    "processedRows" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "failedRows" JSONB,
    "dealershipId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BulkUploadJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BulkUploadJobResult" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "data" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BulkUploadJobResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_key" ON "UserPermission"("userId");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BulkUploadJob_jobId_key" ON "BulkUploadJob"("jobId");

-- CreateIndex
CREATE INDEX "BulkUploadJob_dealershipId_idx" ON "BulkUploadJob"("dealershipId");

-- CreateIndex
CREATE INDEX "BulkUploadJob_userId_idx" ON "BulkUploadJob"("userId");

-- CreateIndex
CREATE INDEX "BulkUploadJob_status_idx" ON "BulkUploadJob"("status");

-- CreateIndex
CREATE INDEX "BulkUploadJob_createdAt_idx" ON "BulkUploadJob"("createdAt");

-- CreateIndex
CREATE INDEX "BulkUploadJobResult_jobId_idx" ON "BulkUploadJobResult"("jobId");

-- CreateIndex
CREATE INDEX "BulkUploadJobResult_createdAt_idx" ON "BulkUploadJobResult"("createdAt");

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
