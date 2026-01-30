export interface VehicleVariant {
  id: string;
  name: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  year: number | null;
  variants?: VehicleVariant[];
}

export interface VehicleCategory {
  id: string;
  name: string;
  models: VehicleModel[];
}

export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string | null;
  createdAt: string;
  sessions?: Array<{
    id: string;
    status: string;
    reason: string;
    createdAt: string;
  }>;
  interests?: Array<{
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
}

export interface Session {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  visitor: {
    id: string;
    firstName: string;
    lastName: string;
    whatsappNumber: string;
  };
  testDrives: Array<{
    id: string;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
  visitorInterests?: Array<{
    id: string;
    model: {
      name: string;
      category: {
        name: string;
      };
    };
  }>;
}

export interface PhoneLookup {
  dailyWalkins: boolean;
  digitalEnquiry: boolean;
  deliveryUpdate: boolean;
  visitorId: string | null;
  enquiryId: string | null;
  ticketId: string | null;
}

export interface VisitorFormData {
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string;
  address: string;
  reason: string;
  modelIds: Array<string | { modelId: string; variantId?: string }>;
}

export interface TestDriveFormData {
  modelId: string;
  variantId: string;
}

export interface DateFilter {
  startDate: string;
  endDate: string;
}
