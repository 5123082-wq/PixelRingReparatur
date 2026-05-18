export type PortalRequestStatus =
  | 'UNDER_REVIEW'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'COMPLETED'
  | 'PLANNED';

export type PortalAssetStatus = 'OK' | 'WATCH' | 'SERVICE_NEEDED' | 'WARRANTY';

export type PortalDocumentType = 'REPORT' | 'WARRANTY' | 'DOCUMENT' | 'OFFER' | 'INVOICE';
export type PortalRequestTimelineState = 'done' | 'active' | 'upcoming';
export type PortalMessageAuthor = 'Customer' | 'PixelRing AI' | 'PixelRing Manager';
export type PortalCustomerAttachmentStatus = 'received' | 'reviewed' | 'needs_more_context';
export type PortalRequiredActionType =
  | 'APPROVE_ESTIMATE'
  | 'CONFIRM_VISIT_WINDOW'
  | 'UPLOAD_MISSING_PHOTO';
export type PortalRequiredActionStatus = 'open' | 'preview_only';

export type PortalContact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type PortalObject = {
  id: string;
  name: string;
  city: string;
  address: string;
  purpose: string;
  accessNotes: string;
  responsibleContactIds: string[];
};

export type PortalAsset = {
  id: string;
  objectId: string;
  name: string;
  category: string;
  type: string;
  status: PortalAssetStatus;
  serviceRelevance: string;
  lastServiceAt: string;
};

export type PortalRequestMessage = {
  id: string;
  requestId: string;
  author: PortalMessageAuthor;
  sentAt: string;
  body: string;
  attachments?: {
    id: string;
    storageKey: string;
    originalFilename: string | null;
    mimeType?: string | null;
  }[];
};

export type PortalRequestTimelineItem = {
  id: string;
  requestId: string;
  state: PortalRequestTimelineState;
  title: string;
  description: string;
  occurredAt: string;
};

export type PortalCustomerAttachment = {
  id: string;
  requestId: string;
  filename: string;
  fileType: string;
  uploadedAt: string;
  status: PortalCustomerAttachmentStatus;
};

export type PortalRequiredAction = {
  id: string;
  requestId: string;
  type: PortalRequiredActionType;
  status: PortalRequiredActionStatus;
  description: string;
  dueLabel: string;
};

export type PortalRequest = {
  id: string;
  publicRequestNumber: string;
  objectId: string;
  title: string;
  status: PortalRequestStatus;
  priority: 'normal' | 'high';
  openedAt: string;
  updatedAt: string;
  summary: string;
  nextStep: string;
  customerName?: string | null;
  serviceLocation?: string | null;
  serviceLatitude?: number | null;
  serviceLongitude?: number | null;
  serviceLocationSource?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export type PortalDocument = {
  id: string;
  type: PortalDocumentType;
  title: string;
  relatedTo: string;
  requestId?: string;
  issuedAt: string;
  status: 'available' | 'planned' | 'locked';
  description?: string;
};

export type PortalDemoOrganization = {
  id: string;
  name: string;
  plan: 'Start' | 'Growth' | 'Enterprise';
  demoEmail: string;
  languagePreference: string;
  contacts: PortalContact[];
  objects: PortalObject[];
  assets: PortalAsset[];
  requests: PortalRequest[];
  messages: PortalRequestMessage[];
  requestTimeline: PortalRequestTimelineItem[];
  customerAttachments: PortalCustomerAttachment[];
  documents: PortalDocument[];
  requiredActions: PortalRequiredAction[];
};
