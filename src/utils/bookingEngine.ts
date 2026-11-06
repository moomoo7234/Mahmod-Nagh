import { MeetingBooking, WorkingHours, Role } from '../types/index.ts';

/**
 * Converts "HH:MM" (24-hour) to minutes from midnight
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts minutes from midnight to "HH:MM" (24-hour)
 */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Formats "HH:MM" to 12-hour format e.g. "09:00 AM"
 */
export function format12Hour(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Generates an executive reference number: HH-2026-XXXX
 */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.floor(1000 + Math.random() * 9000);
  return `HH-${year}-${randomChars}`;
}

export interface TimeSlot {
  time: string; // "10:00"
  formatted: string; // "10:00 AM"
  endTime: string; // "10:45"
  available: boolean;
  reason?: string;
}

/**
 * Generates all valid time slots for a given date based on manager's working hours
 * and existing confirmed or pending bookings, taking buffers into account.
 */
export function generateTimeSlots(
  workingHours: WorkingHours,
  dateStr: string,
  existingBookings: MeetingBooking[]
): TimeSlot[] {
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const dayOfWeek = targetDate.getDay();

  // Check if manager works on this day
  if (!workingHours.days.includes(dayOfWeek)) {
    return [];
  }

  const startMin = timeStringToMinutes(workingHours.start);
  const endMin = timeStringToMinutes(workingHours.end);
  const duration = workingHours.slotDurationMinutes || 45;
  const buffer = workingHours.bufferMinutes || 15;
  const step = duration + buffer;

  const slots: TimeSlot[] = [];

  for (let current = startMin; current + duration <= endMin; current += step) {
    const slotStartStr = minutesToTimeString(current);
    const slotEndStr = minutesToTimeString(current + duration);

    // Check collision with existing active bookings
    const isBooked = existingBookings.some((booking) => {
      if (booking.date !== dateStr) return false;
      if (booking.status === 'cancelled') return false;

      const bStart = timeStringToMinutes(booking.startTime);
      const bEnd = timeStringToMinutes(booking.endTime);

      // Overlap condition:
      return current < bEnd && current + duration > bStart;
    });

    slots.push({
      time: slotStartStr,
      formatted: format12Hour(slotStartStr),
      endTime: slotEndStr,
      available: !isBooked,
      reason: isBooked ? 'Booked' : undefined,
    });
  }

  return slots;
}

/**
 * Checks slot availability strictly before confirmation
 */
export function isSlotAvailable(
  dateStr: string,
  startTimeStr: string,
  endTimeStr: string,
  existingBookings: MeetingBooking[]
): boolean {
  const newStart = timeStringToMinutes(startTimeStr);
  const newEnd = timeStringToMinutes(endTimeStr);

  return !existingBookings.some((booking) => {
    if (booking.date !== dateStr) return false;
    if (booking.status === 'cancelled') return false;

    const bStart = timeStringToMinutes(booking.startTime);
    const bEnd = timeStringToMinutes(booking.endTime);

    return newStart < bEnd && newEnd > bStart;
  });
}

/**
 * Generates standard RFC 5545 .ics content for Apple Calendar & Microsoft Outlook
 */
export function generateICSFile(
  meeting: MeetingBooking,
  companyName: string = 'HEART HEALTH (صيدليات صحة القلب)',
  managerName: string = 'Executive Manager'
): string {
  const cleanDate = meeting.date.replace(/-/g, '');
  const cleanStart = meeting.startTime.replace(/:/g, '') + '00';
  const cleanEnd = meeting.endTime.replace(/:/g, '') + '00';

  const dtStart = `${cleanDate}T${cleanStart}`;
  const dtEnd = `${cleanDate}T${cleanEnd}`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const location =
    meeting.meetingType === 'in-person'
      ? 'HEART HEALTH Executive HQ, King Fahd Road, Riyadh, Saudi Arabia'
      : meeting.meetUrl || 'Virtual Meeting via Google Meet';

  const description = [
    `HEART HEALTH Executive Meeting`,
    `Reference: ${meeting.referenceNumber}`,
    `Subject: ${meeting.subject}`,
    `Attendee: ${meeting.attendeeName} (${meeting.attendeeEmail}, ${meeting.attendeePhone})`,
    `Company: ${meeting.attendeeCompany || 'N/A'}`,
    `Host: ${managerName}`,
    `Details: ${meeting.description}`,
    meeting.meetUrl ? `Meeting Link: ${meeting.meetUrl}` : '',
  ]
    .filter(Boolean)
    .join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HEART HEALTH//Executive Booking Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${meeting.referenceNumber}-${meeting.id}@hearthealth.sa`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${companyName} Meeting: ${meeting.subject}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Executive Meeting with ${companyName}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Generates a direct Google Calendar Web Link with pre-filled parameters
 */
export function generateGoogleCalendarUrl(
  meeting: MeetingBooking,
  companyName: string = 'HEART HEALTH (صيدليات صحة القلب)',
  managerName: string = 'Executive Manager'
): string {
  const cleanDate = meeting.date.replace(/-/g, '');
  const cleanStart = meeting.startTime.replace(/:/g, '') + '00';
  const cleanEnd = meeting.endTime.replace(/:/g, '') + '00';

  const dates = `${cleanDate}T${cleanStart}/${cleanDate}T${cleanEnd}`;
  const title = encodeURIComponent(`${companyName} Meeting: ${meeting.subject}`);

  const details = encodeURIComponent(
    `Executive Meeting - HEART HEALTH (صيدليات صحة القلب)\n` +
      `Reference: ${meeting.referenceNumber}\n` +
      `Executive: ${managerName}\n` +
      `Attendee: ${meeting.attendeeName}\n` +
      `Meeting Type: ${meeting.meetingType.toUpperCase()}\n` +
      `Description: ${meeting.description}\n` +
      (meeting.meetUrl ? `Meeting Link: ${meeting.meetUrl}` : '')
  );

  const location = encodeURIComponent(
    meeting.meetingType === 'in-person'
      ? 'HEART HEALTH Executive HQ, King Fahd Road, Riyadh, Saudi Arabia'
      : meeting.meetUrl || 'Virtual Meeting (Google Meet)'
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Checks if a role has the specified permission
 */
export function hasPermission(
  roleId: string,
  permissionKey: string,
  rolesList: Role[]
): boolean {
  if (roleId === 'super-admin') return true;
  const role = rolesList.find((r) => r.id === roleId);
  if (!role) return false;
  return role.permissions.includes(permissionKey);
}
