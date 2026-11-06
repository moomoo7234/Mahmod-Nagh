import { Employee, LoginCredentials } from '../types/index.ts';

export const DEFAULT_MASTER_PASSWORD = 'HeartHealth@2026';

export interface AuthResult {
  success: boolean;
  user?: Employee;
  error?: string;
  errorAr?: string;
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standard email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function validatePassword(password: string): { valid: boolean; message?: string; messageAr?: string } {
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      message: 'Password is required.',
      messageAr: 'كلمة المرور مطلوبة.',
    };
  }
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters.',
      messageAr: 'يجب أن لا تقل كلمة المرور عن 6 خانات.',
    };
  }
  return { valid: true };
}

export function authenticateUser(credentials: LoginCredentials, employees: Employee[]): AuthResult {
  const { email, password } = credentials;

  // Validate inputs
  if (!email || !email.trim()) {
    return {
      success: false,
      error: 'Please enter your corporate email address.',
      errorAr: 'يرجى إدخال البريد الإلكتروني الوظيفي.',
    };
  }

  if (!validateEmail(email)) {
    return {
      success: false,
      error: 'Invalid corporate email format.',
      errorAr: 'صيغة البريد الإلكتروني غير صحيحة.',
    };
  }

  const pwdValidation = validatePassword(password);
  if (!pwdValidation.valid) {
    return {
      success: false,
      error: pwdValidation.message,
      errorAr: pwdValidation.messageAr,
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const matchedUser = employees.find(
    (emp) => emp.email.trim().toLowerCase() === normalizedEmail
  );

  if (!matchedUser) {
    return {
      success: false,
      error: 'No active employee account found with this corporate email address.',
      errorAr: 'لم يتم العثور على حساب موظف مرتبط بهذا البريد الإلكتروني.',
    };
  }

  if (!matchedUser.active) {
    return {
      success: false,
      error: 'This account has been deactivated. Please contact your system administrator.',
      errorAr: 'تم تعطيل هذا الحساب. يرجى مراجعة إدارة تقنية المعلومات.',
    };
  }

  // Password check: matches custom employee password OR system master password
  const expectedPassword = matchedUser.password || DEFAULT_MASTER_PASSWORD;
  const isMatch = password === expectedPassword || password === DEFAULT_MASTER_PASSWORD;

  if (!isMatch) {
    return {
      success: false,
      error: 'Incorrect corporate password. Please verify and try again.',
      errorAr: 'كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.',
    };
  }

  return {
    success: true,
    user: matchedUser,
  };
}
