// Visitor Types
export interface Visitor {
  id: number;
  name: string;
  phone: string;
  email?: string;
  modelId?: number;
  variantId?: number;
  categoryId?: number;
  source: string;
  leadSourceId?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  model?: Model;
  variant?: Variant;
  category?: Category;
  leadSource?: LeadSource;
}

export interface VisitorCreateDto {
  name: string;
  phone: string;
  email?: string;
  modelId?: number;
  variantId?: number;
  categoryId?: number;
  source: string;
  leadSourceId?: number;
}

// Session Types
export interface Session {
  id: number;
  visitorId: number;
  sessionDate: Date | string;
  notes?: string;
  status?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  visitor?: Visitor;
}

export interface SessionCreateDto {
  visitorId: number;
  sessionDate: Date | string;
  notes?: string;
  status?: string;
}

// Digital Enquiry Types
export interface DigitalEnquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  modelId?: number;
  variantId?: number;
  categoryId?: number;
  leadSourceId?: number;
  status: EnquiryStatus;
  source?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  model?: Model;
  variant?: Variant;
  category?: Category;
  leadSource?: LeadSource;
}

export interface DigitalEnquiryCreateDto {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  modelId?: number;
  variantId?: number;
  categoryId?: number;
  leadSourceId?: number;
  status?: EnquiryStatus;
  source?: string;
}

export enum EnquiryStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  CONVERTED = "CONVERTED",
  CLOSED = "CLOSED",
}

// Field Inquiry Types
export interface FieldInquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  modelId?: number;
  variantId?: number;
  categoryId?: number;
  leadSourceId?: number;
  status: EnquiryStatus;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  model?: Model;
  variant?: Variant;
  category?: Category;
  leadSource?: LeadSource;
}

export interface FieldInquiryCreateDto {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  modelId?: number;
  variantId?: number;
  categoryId?: number;
  leadSourceId?: number;
  status?: EnquiryStatus;
  notes?: string;
}

// Model Types
export interface Model {
  id: number;
  name: string;
  categoryId?: number;
  imageUrl?: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  category?: Category;
  variants?: Variant[];
}

export interface ModelCreateDto {
  name: string;
  categoryId?: number;
  imageUrl?: string;
  description?: string;
}

// Variant Types
export interface Variant {
  id: number;
  name: string;
  modelId: number;
  price?: number;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  model?: Model;
}

export interface VariantCreateDto {
  name: string;
  modelId: number;
  price?: number;
  description?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CategoryCreateDto {
  name: string;
  description?: string;
}

// Lead Source Types
export interface LeadSource {
  id: number;
  name: string;
  description?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LeadSourceCreateDto {
  name: string;
  description?: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email?: string;
  role: UserRole;
  permissions?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UserCreateDto {
  username: string;
  email?: string;
  password: string;
  role: UserRole;
  permissions?: string[];
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  SALES = "SALES",
  USER = "USER",
}

// Test Drive Types
export interface TestDrive {
  id: number;
  visitorId: number;
  modelId: number;
  variantId?: number;
  scheduledDate: Date | string;
  status: TestDriveStatus;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  visitor?: Visitor;
  model?: Model;
  variant?: Variant;
}

export interface TestDriveCreateDto {
  visitorId: number;
  modelId: number;
  variantId?: number;
  scheduledDate: Date | string;
  status?: TestDriveStatus;
  notes?: string;
}

export enum TestDriveStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

// Delivery Ticket Types
export interface DeliveryTicket {
  id: number;
  customerName: string;
  phone: string;
  email?: string;
  modelId: number;
  variantId?: number;
  vehicleNumber?: string;
  deliveryDate?: Date | string;
  status: DeliveryStatus;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  model?: Model;
  variant?: Variant;
}

export interface DeliveryTicketCreateDto {
  customerName: string;
  phone: string;
  email?: string;
  modelId: number;
  variantId?: number;
  vehicleNumber?: string;
  deliveryDate?: Date | string;
  status?: DeliveryStatus;
  notes?: string;
}

export enum DeliveryStatus {
  PENDING = "PENDING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// Template Types
export interface Template {
  id: number;
  name: string;
  content: string;
  type: TemplateType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TemplateCreateDto {
  name: string;
  content: string;
  type: TemplateType;
}

export enum TemplateType {
  WHATSAPP = "WHATSAPP",
  EMAIL = "EMAIL",
  SMS = "SMS",
}

// Statistics Types
export interface DashboardStats {
  totalVisitors: number;
  totalSessions: number;
  totalDigitalEnquiries: number;
  totalFieldInquiries: number;
  totalTestDrives: number;
  totalDeliveries: number;
  visitorsThisMonth: number;
  enquiriesThisMonth: number;
  conversionRate: number;
}

// Bulk Upload Job Types
export interface BulkUploadJob {
  id: number;
  fileName: string;
  status: BulkUploadStatus;
  totalRecords: number;
  successRecords: number;
  failedRecords: number;
  errorLog?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export enum BulkUploadStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
