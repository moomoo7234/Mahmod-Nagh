import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateUser, validateEmail, validatePassword, DEFAULT_MASTER_PASSWORD } from './auth.ts';
import { Employee } from '../types/index.ts';

const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    name: 'Dr. Sultan Al-Ghamdi',
    nameAr: 'د. سلطان الغامدي',
    title: 'Chief Executive Officer',
    departmentId: 'dept-exec',
    email: 'sultan.alghamdi@hearthealth.sa',
    phone: '+966 50 112 3344',
    roleId: 'super-admin',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'CEO bio',
    officeLocation: 'Suite 2401',
    active: true,
    isExecutive: true,
    password: 'CustomSecret@2026',
    workingHours: {
      days: [0, 1, 2, 3, 4],
      start: '10:00',
      end: '16:00',
      slotDurationMinutes: 45,
      bufferMinutes: 15,
    },
  },
  {
    id: 'emp-2',
    name: 'Deactivated User',
    nameAr: 'مستخدم معطل',
    title: 'Analyst',
    departmentId: 'dept-fin',
    email: 'inactive@hearthealth.sa',
    phone: '+966 50 000 0000',
    roleId: 'employee',
    avatar: 'https://example.com/avatar2.jpg',
    bio: 'Inactive bio',
    officeLocation: 'Office 101',
    active: false,
    workingHours: {
      days: [0, 1, 2, 3, 4],
      start: '09:00',
      end: '17:00',
      slotDurationMinutes: 30,
      bufferMinutes: 15,
    },
  },
  {
    id: 'emp-3',
    name: 'Standard Staff',
    nameAr: 'موظف قياسي',
    title: 'Pharmacist',
    departmentId: 'dept-ops',
    email: 'staff@hearthealth.sa',
    phone: '+966 50 111 2222',
    roleId: 'employee',
    avatar: 'https://example.com/avatar3.jpg',
    bio: 'Staff bio',
    officeLocation: 'Branch 05',
    active: true,
    workingHours: {
      days: [0, 1, 2, 3, 4],
      start: '09:00',
      end: '17:00',
      slotDurationMinutes: 30,
      bufferMinutes: 15,
    },
  },
];

test('validateEmail checks standard email syntax', () => {
  assert.equal(validateEmail('sultan@hearthealth.sa'), true);
  assert.equal(validateEmail('user.name+tag@sub.domain.com'), true);
  assert.equal(validateEmail('invalid-email'), false);
  assert.equal(validateEmail('@no-user.com'), false);
  assert.equal(validateEmail(''), false);
});

test('validatePassword validates length and requirement', () => {
  assert.equal(validatePassword('123456').valid, true);
  assert.equal(validatePassword('12345').valid, false);
  assert.equal(validatePassword('').valid, false);
});

test('authenticateUser succeeds with custom password for employee', () => {
  const result = authenticateUser(
    { email: 'sultan.alghamdi@hearthealth.sa', password: 'CustomSecret@2026' },
    mockEmployees
  );
  assert.equal(result.success, true);
  assert.equal(result.user?.id, 'emp-1');
});

test('authenticateUser succeeds with default master password', () => {
  const result = authenticateUser(
    { email: 'staff@hearthealth.sa', password: DEFAULT_MASTER_PASSWORD },
    mockEmployees
  );
  assert.equal(result.success, true);
  assert.equal(result.user?.id, 'emp-3');
});

test('authenticateUser handles case-insensitive email and trimming', () => {
  const result = authenticateUser(
    { email: '  SULTAN.Alghamdi@HeartHealth.SA  ', password: 'CustomSecret@2026' },
    mockEmployees
  );
  assert.equal(result.success, true);
  assert.equal(result.user?.name, 'Dr. Sultan Al-Ghamdi');
});

test('authenticateUser fails with incorrect password', () => {
  const result = authenticateUser(
    { email: 'sultan.alghamdi@hearthealth.sa', password: 'WrongPassword999' },
    mockEmployees
  );
  assert.equal(result.success, false);
  assert.ok(result.error?.includes('Incorrect corporate password'));
  assert.ok(result.errorAr?.includes('كلمة المرور غير صحيحة'));
});

test('authenticateUser fails when email does not exist', () => {
  const result = authenticateUser(
    { email: 'unknown@external.com', password: DEFAULT_MASTER_PASSWORD },
    mockEmployees
  );
  assert.equal(result.success, false);
  assert.ok(result.error?.includes('No active employee account found'));
  assert.ok(result.errorAr?.includes('لم يتم العثور على حساب موظف'));
});

test('authenticateUser fails when account is deactivated', () => {
  const result = authenticateUser(
    { email: 'inactive@hearthealth.sa', password: DEFAULT_MASTER_PASSWORD },
    mockEmployees
  );
  assert.equal(result.success, false);
  assert.ok(result.error?.includes('deactivated'));
  assert.ok(result.errorAr?.includes('تعطيل هذا الحساب'));
});
