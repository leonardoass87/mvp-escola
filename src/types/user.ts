export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface SystemUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}