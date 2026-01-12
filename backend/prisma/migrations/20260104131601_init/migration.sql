-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dealershipId" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "profilePicture" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "showroomNumber" TEXT,

    CONSTRAINT "Dealership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dealershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleVariant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "whatsappContactId" TEXT,
    "dealershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'intake',
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorInterest" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "variantId" TEXT,

    CONSTRAINT "VisitorInterest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestDrive" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "variantId" TEXT,

    CONSTRAINT "TestDrive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en_US',
    "type" TEXT NOT NULL,
    "dealershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "section" TEXT DEFAULT 'global',

    CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "dealershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalEnquiry" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "reason" TEXT NOT NULL,
    "leadScope" TEXT NOT NULL DEFAULT 'warm',
    "whatsappContactId" TEXT,
    "dealershipId" TEXT NOT NULL,
    "leadSourceId" TEXT,
    "interestedModelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interestedVariantId" TEXT,

    CONSTRAINT "DigitalEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalEnquirySession" (
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "digitalEnquiryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalEnquirySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryTicket" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "description" TEXT,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "messageSent" BOOLEAN NOT NULL DEFAULT false,
    "whatsappContactId" TEXT,
    "dealershipId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "variantId" TEXT,
    "completionSent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "DeliveryTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledMessage" (
    "id" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "deliveryTicketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldInquiry" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "reason" TEXT NOT NULL,
    "leadScope" TEXT NOT NULL DEFAULT 'warm',
    "whatsappContactId" TEXT,
    "dealershipId" TEXT NOT NULL,
    "leadSourceId" TEXT,
    "interestedModelId" TEXT,
    "interestedVariantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldInquirySession" (
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "fieldInquiryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldInquirySession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_dealershipId_idx" ON "User"("dealershipId");

-- CreateIndex
CREATE INDEX "VehicleCategory_dealershipId_idx" ON "VehicleCategory"("dealershipId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleCategory_dealershipId_name_key" ON "VehicleCategory"("dealershipId", "name");

-- CreateIndex
CREATE INDEX "VehicleModel_categoryId_idx" ON "VehicleModel"("categoryId");

-- CreateIndex
CREATE INDEX "VehicleVariant_modelId_idx" ON "VehicleVariant"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleVariant_modelId_name_key" ON "VehicleVariant"("modelId", "name");

-- CreateIndex
CREATE INDEX "Visitor_dealershipId_idx" ON "Visitor"("dealershipId");

-- CreateIndex
CREATE INDEX "Visitor_whatsappNumber_idx" ON "Visitor"("whatsappNumber");

-- CreateIndex
CREATE INDEX "VisitorSession_visitorId_idx" ON "VisitorSession"("visitorId");

-- CreateIndex
CREATE INDEX "VisitorSession_status_idx" ON "VisitorSession"("status");

-- CreateIndex
CREATE INDEX "VisitorInterest_visitorId_idx" ON "VisitorInterest"("visitorId");

-- CreateIndex
CREATE INDEX "VisitorInterest_modelId_idx" ON "VisitorInterest"("modelId");

-- CreateIndex
CREATE INDEX "VisitorInterest_variantId_idx" ON "VisitorInterest"("variantId");

-- CreateIndex
CREATE INDEX "VisitorInterest_sessionId_idx" ON "VisitorInterest"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorInterest_visitorId_modelId_variantId_sessionId_key" ON "VisitorInterest"("visitorId", "modelId", "variantId", "sessionId");

-- CreateIndex
CREATE INDEX "TestDrive_sessionId_idx" ON "TestDrive"("sessionId");

-- CreateIndex
CREATE INDEX "TestDrive_modelId_idx" ON "TestDrive"("modelId");

-- CreateIndex
CREATE INDEX "TestDrive_variantId_idx" ON "TestDrive"("variantId");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_dealershipId_idx" ON "WhatsAppTemplate"("dealershipId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppTemplate_dealershipId_type_section_key" ON "WhatsAppTemplate"("dealershipId", "type", "section");

-- CreateIndex
CREATE INDEX "LeadSource_dealershipId_idx" ON "LeadSource"("dealershipId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadSource_dealershipId_name_key" ON "LeadSource"("dealershipId", "name");

-- CreateIndex
CREATE INDEX "DigitalEnquiry_dealershipId_idx" ON "DigitalEnquiry"("dealershipId");

-- CreateIndex
CREATE INDEX "DigitalEnquiry_whatsappNumber_idx" ON "DigitalEnquiry"("whatsappNumber");

-- CreateIndex
CREATE INDEX "DigitalEnquiry_leadSourceId_idx" ON "DigitalEnquiry"("leadSourceId");

-- CreateIndex
CREATE INDEX "DigitalEnquirySession_digitalEnquiryId_idx" ON "DigitalEnquirySession"("digitalEnquiryId");

-- CreateIndex
CREATE INDEX "DigitalEnquirySession_status_idx" ON "DigitalEnquirySession"("status");

-- CreateIndex
CREATE INDEX "DeliveryTicket_dealershipId_idx" ON "DeliveryTicket"("dealershipId");

-- CreateIndex
CREATE INDEX "DeliveryTicket_whatsappNumber_idx" ON "DeliveryTicket"("whatsappNumber");

-- CreateIndex
CREATE INDEX "DeliveryTicket_deliveryDate_idx" ON "DeliveryTicket"("deliveryDate");

-- CreateIndex
CREATE INDEX "DeliveryTicket_modelId_idx" ON "DeliveryTicket"("modelId");

-- CreateIndex
CREATE INDEX "ScheduledMessage_deliveryTicketId_idx" ON "ScheduledMessage"("deliveryTicketId");

-- CreateIndex
CREATE INDEX "ScheduledMessage_scheduledFor_idx" ON "ScheduledMessage"("scheduledFor");

-- CreateIndex
CREATE INDEX "ScheduledMessage_status_idx" ON "ScheduledMessage"("status");

-- CreateIndex
CREATE INDEX "FieldInquiry_dealershipId_idx" ON "FieldInquiry"("dealershipId");

-- CreateIndex
CREATE INDEX "FieldInquiry_whatsappNumber_idx" ON "FieldInquiry"("whatsappNumber");

-- CreateIndex
CREATE INDEX "FieldInquiry_leadSourceId_idx" ON "FieldInquiry"("leadSourceId");

-- CreateIndex
CREATE INDEX "FieldInquirySession_fieldInquiryId_idx" ON "FieldInquirySession"("fieldInquiryId");

-- CreateIndex
CREATE INDEX "FieldInquirySession_status_idx" ON "FieldInquirySession"("status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCategory" ADD CONSTRAINT "VehicleCategory_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleModel" ADD CONSTRAINT "VehicleModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VehicleCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleVariant" ADD CONSTRAINT "VehicleVariant_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorInterest" ADD CONSTRAINT "VisitorInterest_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorInterest" ADD CONSTRAINT "VisitorInterest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorInterest" ADD CONSTRAINT "VisitorInterest_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorInterest" ADD CONSTRAINT "VisitorInterest_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDrive" ADD CONSTRAINT "TestDrive_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDrive" ADD CONSTRAINT "TestDrive_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDrive" ADD CONSTRAINT "TestDrive_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppTemplate" ADD CONSTRAINT "WhatsAppTemplate_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadSource" ADD CONSTRAINT "LeadSource_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalEnquiry" ADD CONSTRAINT "DigitalEnquiry_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalEnquiry" ADD CONSTRAINT "DigitalEnquiry_interestedModelId_fkey" FOREIGN KEY ("interestedModelId") REFERENCES "VehicleModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalEnquiry" ADD CONSTRAINT "DigitalEnquiry_interestedVariantId_fkey" FOREIGN KEY ("interestedVariantId") REFERENCES "VehicleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalEnquiry" ADD CONSTRAINT "DigitalEnquiry_leadSourceId_fkey" FOREIGN KEY ("leadSourceId") REFERENCES "LeadSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalEnquirySession" ADD CONSTRAINT "DigitalEnquirySession_digitalEnquiryId_fkey" FOREIGN KEY ("digitalEnquiryId") REFERENCES "DigitalEnquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTicket" ADD CONSTRAINT "DeliveryTicket_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTicket" ADD CONSTRAINT "DeliveryTicket_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "VehicleModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryTicket" ADD CONSTRAINT "DeliveryTicket_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VehicleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledMessage" ADD CONSTRAINT "ScheduledMessage_deliveryTicketId_fkey" FOREIGN KEY ("deliveryTicketId") REFERENCES "DeliveryTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldInquiry" ADD CONSTRAINT "FieldInquiry_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldInquiry" ADD CONSTRAINT "FieldInquiry_interestedModelId_fkey" FOREIGN KEY ("interestedModelId") REFERENCES "VehicleModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldInquiry" ADD CONSTRAINT "FieldInquiry_interestedVariantId_fkey" FOREIGN KEY ("interestedVariantId") REFERENCES "VehicleVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldInquiry" ADD CONSTRAINT "FieldInquiry_leadSourceId_fkey" FOREIGN KEY ("leadSourceId") REFERENCES "LeadSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldInquirySession" ADD CONSTRAINT "FieldInquirySession_fieldInquiryId_fkey" FOREIGN KEY ("fieldInquiryId") REFERENCES "FieldInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
