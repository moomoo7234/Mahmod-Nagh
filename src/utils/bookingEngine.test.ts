import test from 'node:test';
import assert from 'node:assert/strict';
import {
  timeStringToMinutes,
  minutesToTimeString,
  generateTimeSlots,
  isSlotAvailable,
  generateReferenceNumber,
  generateICSFile,
  hasPermission,
} from './bookingEngine.ts';
import { WorkingHours, MeetingBooking, Role } from '../types/index.ts';

test('timeStringToMinutes and minutesToTimeString roundtrip correctly', () => {
  assert.equal(timeStringToMinutes('09:30'), 570);
  assert.equal(minutesToTimeString(570), '09:30');
  assert.equal(timeStringToMinutes('00:00'), 0);
  assert.equal(minutesToTimeString(0), '00:00');
  assert.equal(timeStringToMinutes('17:45'), 1065);
  assert.equal(minutesToTimeString(1065), '17:45');
});

test('generateReferenceNumber generates expected prefix and format', () => {
  const ref = generateReferenceNumber();
  assert.match(ref, /^HH-\d{4}-\d{4}$/);
});

test('generateTimeSlots respects working days and calculates buffer', () => {
  const workingHours: WorkingHours = {
    days: [0, 1, 2, 3, 4], // Sun-Thu
    start: '09:00',
    end: '12:00',
    slotDurationMinutes: 45,
    bufferMinutes: 15,
  };

  // 2026-11-08 is a Sunday (day 0)
  const sundaySlots = generateTimeSlots(workingHours, '2026-11-08', []);
  // 9:00-9:45, (15m buffer -> 10:00), 10:00-10:45, (15m buffer -> 11:00), 11:00-11:45
  assert.equal(sundaySlots.length, 3);
  assert.equal(sundaySlots[0].time, '09:00');
  assert.equal(sundaySlots[0].endTime, '09:45');
  assert.equal(sundaySlots[1].time, '10:00');
  assert.equal(sundaySlots[2].time, '11:00');

  // 2026-11-06 is a Friday (day 5) -> non-working day
  const fridaySlots = generateTimeSlots(workingHours, '2026-11-06', []);
  assert.equal(fridaySlots.length, 0);
});

test('generateTimeSlots marks overlapping slot as unavailable', () => {
  const workingHours: WorkingHours = {
    days: [0, 1, 2, 3, 4],
    start: '09:00',
    end: '12:00',
    slotDurationMinutes: 45,
    bufferMinutes: 15,
  };

  const existingBookings: MeetingBooking[] = [
    {
      id: 'book-1',
      referenceNumber: 'HH-2026-1234',
      departmentId: 'dept-exec',
      managerId: 'mgr-1',
      attendeeName: 'Ahmed Al-Rashid',
      attendeeEmail: 'ahmed@example.com',
      attendeePhone: '+966501234567',
      attendeeCompany: 'Health Corp',
      subject: 'Strategy Discussion',
      description: 'Annual partnership review',
      meetingType: 'in-person',
      date: '2026-11-08',
      startTime: '10:00',
      endTime: '10:45',
      status: 'confirmed',
      createdAt: '2026-11-01T10:00:00Z',
    },
  ];

  const slots = generateTimeSlots(workingHours, '2026-11-08', existingBookings);
  assert.equal(slots[0].available, true); // 09:00 is free
  assert.equal(slots[1].available, false); // 10:00 is booked
  assert.equal(slots[1].reason, 'Booked');
  assert.equal(slots[2].available, true); // 11:00 is free
});

test('isSlotAvailable detects collisions accurately', () => {
  const bookings: MeetingBooking[] = [
    {
      id: 'book-1',
      referenceNumber: 'HH-2026-1234',
      departmentId: 'dept-exec',
      managerId: 'mgr-1',
      attendeeName: 'Test',
      attendeeEmail: 't@example.com',
      attendeePhone: '+966500000000',
      attendeeCompany: 'Co',
      subject: 'Review',
      description: 'Desc',
      meetingType: 'online',
      date: '2026-11-08',
      startTime: '14:00',
      endTime: '15:00',
      status: 'confirmed',
      createdAt: '2026-11-01T10:00:00Z',
    },
  ];

  // Overlapping start
  assert.equal(isSlotAvailable('2026-11-08', '14:30', '15:15', bookings), false);
  // Exactly same time
  assert.equal(isSlotAvailable('2026-11-08', '14:00', '15:00', bookings), false);
  // Non-overlapping times
  assert.equal(isSlotAvailable('2026-11-08', '13:00', '13:45', bookings), true);
  assert.equal(isSlotAvailable('2026-11-08', '15:00', '16:00', bookings), true);
  // Different date
  assert.equal(isSlotAvailable('2026-11-09', '14:00', '15:00', bookings), true);
});

test('generateICSFile produces valid RFC 5545 format', () => {
  const sampleMeeting: MeetingBooking = {
    id: 'b-99',
    referenceNumber: 'HH-2026-8888',
    departmentId: 'exec',
    managerId: 'mgr-1',
    attendeeName: 'Sarah Al-Mansoor',
    attendeeEmail: 'sarah@pharmacy.sa',
    attendeePhone: '+966551234567',
    attendeeCompany: 'PharmaTech',
    subject: 'Executive Boardroom Meeting',
    description: 'Quarterly distribution agreement review',
    meetingType: 'in-person',
    date: '2026-11-10',
    startTime: '11:00',
    endTime: '12:00',
    status: 'confirmed',
    createdAt: '2026-11-01T10:00:00Z',
  };

  const ics = generateICSFile(sampleMeeting, 'HEART HEALTH', 'Dr. Tariq Al-Omari');
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('END:VCALENDAR'));
  assert.ok(ics.includes('SUMMARY:HEART HEALTH Meeting: Executive Boardroom Meeting'));
  assert.ok(ics.includes('DTSTART:20261110T110000'));
  assert.ok(ics.includes('DTEND:20261110T120000'));
  assert.ok(ics.includes('UID:HH-2026-8888-b-99@hearthealth.sa'));
});

test('hasPermission enforces role-based access correctly', () => {
  const roles: Role[] = [
    {
      id: 'dept-manager',
      name: 'Department Manager',
      description: 'Manages department meetings',
      isSystem: true,
      permissions: ['view_dept_meetings', 'approve_bookings', 'manage_personal_calendar'],
    },
    {
      id: 'employee',
      name: 'Employee',
      description: 'Standard staff',
      isSystem: true,
      permissions: ['view_own_meetings'],
    },
  ];

  // Super admin has every permission
  assert.equal(hasPermission('super-admin', 'manage_system_settings', roles), true);
  assert.equal(hasPermission('super-admin', 'export_reports', roles), true);

  // Department Manager checks
  assert.equal(hasPermission('dept-manager', 'approve_bookings', roles), true);
  assert.equal(hasPermission('dept-manager', 'manage_system_settings', roles), false);

  // Employee checks
  assert.equal(hasPermission('employee', 'view_own_meetings', roles), true);
  assert.equal(hasPermission('employee', 'approve_bookings', roles), false);
});
