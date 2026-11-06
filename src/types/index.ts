export type MeetingType = 'in-person' | 'online';
export type MeetingStatus = 'confirmed' | 'pending' | 'cancelled' | 'rescheduled';

export type NotificationType =
  | 'new_booking'
  | 'approved'
  | 'rejected'
  | 'rescheduled'
  | 'cancelled'
  | 'system';

export interface AppNotification {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
  referenceNumber?: string;
  bookingId?: string;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

export interface WorkingHours {
  days: number[]; // 0 = Sunday, 1 = Monday, ..., 4 = Thursday (Saudi work week Sun-Thu default)
  start: string; // "09:00"
  end: string; // "17:00"
  slotDurationMinutes: number; // e.g. 45
  bufferMinutes: number; // e.g. 15
}

export interface Department {
  id: string;
  nameEn: string;
  nameAr: string;
  code: string;
  headManagerId?: string;
  description: string;
  iconName: string;
  employeeCount: number;
  active: boolean;
  imageUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  departmentId: string;
  email: string;
  phone: string;
  roleId: string;
  managerId?: string;
  avatar: string;
  bio: string;
  officeLocation: string;
  active: boolean;
  isExecutive?: boolean;
  password?: string;
  workingHours: WorkingHours;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MeetingBooking {
  id: string;
  referenceNumber: string;
  departmentId: string;
  managerId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  attendeeCompany: string;
  subject: string;
  description: string;
  meetingType: MeetingType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: MeetingStatus;
  notes?: string;
  meetUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
}

export interface PermissionDefinition {
  key: string;
  label: string;
  category: 'Meetings' | 'Calendar' | 'Employees' | 'Departments' | 'Reports' | 'System';
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  action: string;
  target: string;
  details: string;
}

export interface CompanySettings {
  brandNameEn: string;
  brandNameAr: string;
  heroHeadline: string;
  heroSubtitle: string;
  tickerText: string;
  ceoName: string;
  ceoTitle: string;
  ceoBio: string;
  ceoPhoto: string;
  aboutOverview: string;
  mission: string;
  vision: string;
  phone: string;
  email: string;
  address: string;
  crNumber: string;
  primaryColor: string;
}
