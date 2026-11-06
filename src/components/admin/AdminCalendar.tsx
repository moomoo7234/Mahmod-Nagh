import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MeetingBooking } from '../../types/index.ts';
import {
  generateICSFile,
  generateGoogleCalendarUrl,
} from '../../utils/bookingEngine.ts';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Download,
  ExternalLink,
  Filter,
  Eye,
  Sliders,
  Check,
  MapPin,
  Video,
} from 'lucide-react';

export const AdminCalendar: React.FC = () => {
  const {
    bookings,
    employees,
    departments,
    updateBookingStatus,
    rescheduleBooking,
    cancelBooking,
    companySettings,
    currentUser,
    hasUserPermission,
    updateEmployee,
    language,
  } = useApp();

  const isAr = language === 'ar';

  // Filters
  const [managerFilter, setManagerFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'settings'>('list');

  // Selected meeting for action / details
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingBooking | null>(null);

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStart, setRescheduleStart] = useState('10:00');
  const [rescheduleEnd, setRescheduleEnd] = useState('10:45');
  const [rescheduleOpen, setRescheduleOpen] = useState(false);

  // Availability configuration state for currently selected manager
  const [settingsManagerId, setSettingsManagerId] = useState(currentUser?.id || employees[0]?.id || '');
  const settingsManager = employees.find((e) => e.id === settingsManagerId);

  const [workingDays, setWorkingDays] = useState<number[]>(
    settingsManager?.workingHours.days || [0, 1, 2, 3, 4]
  );
  const [startHour, setStartHour] = useState(settingsManager?.workingHours.start || '09:00');
  const [endHour, setEndHour] = useState(settingsManager?.workingHours.end || '17:00');
  const [slotDuration, setSlotDuration] = useState(
    settingsManager?.workingHours.slotDurationMinutes || 45
  );
  const [bufferTime, setBufferTime] = useState(
    settingsManager?.workingHours.bufferMinutes || 15
  );
  const [availabilitySaved, setAvailabilitySaved] = useState(false);

  const canApprove = hasUserPermission('approve_bookings');
  const canReject = hasUserPermission('reject_bookings');
  const canReschedule = hasUserPermission('reschedule_meetings');
  const canCancel = hasUserPermission('cancel_meetings');

  const filteredBookings = bookings.filter((b) => {
    const matchesManager = managerFilter === 'ALL' || b.managerId === managerFilter;
    const matchesDept = deptFilter === 'ALL' || b.departmentId === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesManager && matchesDept && matchesStatus;
  });

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsManager) return;

    updateEmployee(settingsManager.id, {
      workingHours: {
        days: workingDays,
        start: startHour,
        end: endHour,
        slotDurationMinutes: Number(slotDuration),
        bufferMinutes: Number(bufferTime),
      },
    });

    setAvailabilitySaved(true);
    setTimeout(() => setAvailabilitySaved(false), 2000);
  };

  const toggleDay = (dayIdx: number) => {
    if (workingDays.includes(dayIdx)) {
      setWorkingDays(workingDays.filter((d) => d !== dayIdx));
    } else {
      setWorkingDays([...workingDays, dayIdx].sort());
    }
  };

  const dayLabels = isAr
    ? [
        { idx: 0, label: 'الأحد' },
        { idx: 1, label: 'الإثنين' },
        { idx: 2, label: 'الثلاثاء' },
        { idx: 3, label: 'الأربعاء' },
        { idx: 4, label: 'الخميس' },
        { idx: 5, label: 'الجمعة' },
        { idx: 6, label: 'السبت' },
      ]
    : [
        { idx: 0, label: 'Sunday' },
        { idx: 1, label: 'Monday' },
        { idx: 2, label: 'Tuesday' },
        { idx: 3, label: 'Wednesday' },
        { idx: 4, label: 'Thursday' },
        { idx: 5, label: 'Friday' },
        { idx: 6, label: 'Saturday' },
      ];

  return (
    <div className={`space-y-6 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'إدارة التقويم التنفيذي والمواعيد' : 'Executive Calendar & Appointments'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'إدارة الجداول الزمنية المباشرة، اعتماد المواعيد وإعادة جدولتها، وتخصيص ساعات عمل المسؤولين.'
              : 'Real-time schedule management, status updates, rescheduling, and manager availability profiles.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-[#A30D25] text-white shadow-md'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{isAr ? 'جدول المواعيد' : 'Meetings View'}</span>
          </button>

          <button
            onClick={() => setViewMode('settings')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'settings'
                ? 'bg-[#A30D25] text-white shadow-md'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'قواعد وساعات التوفر' : 'Availability Rules'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1 font-semibold">
                {isAr ? 'تصفية حسب المسؤول' : 'Filter by Executive'}
              </label>
              <select
                value={managerFilter}
                onChange={(e) => setManagerFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
              >
                <option value="ALL">{isAr ? `كافة المسؤولين (${employees.length})` : `All Executives (${employees.length})`}</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {isAr ? emp.nameAr : emp.name} ({emp.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1 font-semibold">
                {isAr ? 'تصفية حسب القطاع' : 'Filter by Department'}
              </label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
              >
                <option value="ALL">{isAr ? 'كافة القطاعات' : 'All Departments'}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {isAr ? d.nameAr : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 uppercase tracking-wider mb-1 font-semibold">
                {isAr ? 'حالة الموعد' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200"
              >
                <option value="ALL">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="confirmed">{isAr ? 'مؤكد' : 'Confirmed'}</option>
                <option value="pending">{isAr ? 'معلق' : 'Pending'}</option>
                <option value="rescheduled">{isAr ? 'مجدول مجدداً' : 'Rescheduled'}</option>
                <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
              </select>
            </div>
          </div>

          {/* Bookings List / Grid */}
          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="p-12 rounded-2xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400">
                {isAr ? 'لم يتم العثور على أي مواعيد تطابق شروط التصفية.' : 'No meetings found matching your filter criteria.'}
              </div>
            ) : (
              filteredBookings.map((b) => {
                const manager = employees.find((e) => e.id === b.managerId);
                const dept = departments.find((d) => d.id === b.departmentId);

                const statusStyles: Record<string, string> = {
                  confirmed: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
                  pending: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
                  rescheduled: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
                  cancelled: 'bg-neutral-800 border-neutral-700 text-neutral-400 line-through',
                };

                const statusLabelsAr: Record<string, string> = {
                  confirmed: 'مؤكد',
                  pending: 'معلق للمراجعة',
                  rescheduled: 'مجدول مجدداً',
                  cancelled: 'ملغي',
                };

                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#ff4c68]">
                          {b.referenceNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            statusStyles[b.status] || ''
                          }`}
                        >
                          {isAr ? (statusLabelsAr[b.status] || b.status) : b.status}
                        </span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          {b.meetingType === 'in-person' ? (
                            <MapPin className="w-3 h-3 text-[#A30D25]" />
                          ) : (
                            <Video className="w-3 h-3 text-blue-400" />
                          )}
                          <span>
                            {b.meetingType === 'in-person'
                              ? (isAr ? 'حضوري' : 'In-person')
                              : (isAr ? 'عن بعد' : 'Online')}
                          </span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{b.subject}</h4>

                      <p className="text-xs text-neutral-300">
                        {isAr ? 'المشارك: ' : 'Attendee: '}
                        <span className="text-white font-medium">{b.attendeeName}</span>{' '}
                        {b.attendeeCompany && `(${b.attendeeCompany})`} •{' '}
                        <span className="text-neutral-400">{b.attendeeEmail}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#ff4c68]" />
                          <span>{isAr ? 'المضيف: ' : 'Host: '}</span>
                          <span className="text-white font-medium">
                            {manager ? (isAr ? manager.nameAr : manager.name) : b.managerId}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-neutral-300">
                          <Clock className="w-3 h-3 text-[#A30D25]" />
                          {b.date} ({b.startTime} - {b.endTime})
                        </span>
                        <span className="text-[11px] text-neutral-400">
                          {dept ? (isAr ? dept.nameAr : dept.nameEn) : ''}
                        </span>
                      </div>
                    </div>

                    {/* Actions on this meeting */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-900">
                      {b.status === 'pending' && canApprove && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{isAr ? 'اعتماد' : 'Approve'}</span>
                        </button>
                      )}

                      {b.status === 'pending' && canReject && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled', isAr ? 'اعتذار من المسؤول' : 'Declined by Host')}
                          className="py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-rose-400 text-xs font-semibold"
                        >
                          {isAr ? 'رفض' : 'Decline'}
                        </button>
                      )}

                      {canReschedule && b.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            setSelectedMeeting(b);
                            setRescheduleDate(b.date);
                            setRescheduleStart(b.startTime);
                            setRescheduleEnd(b.endTime);
                            setRescheduleOpen(true);
                          }}
                          className="py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إعادة جدولة' : 'Reschedule'}</span>
                        </button>
                      )}

                      {canCancel && b.status !== 'cancelled' && (
                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? 'هل أنت متأكد من إلغاء هذا الموعد التنفيذي؟' : 'Cancel this executive appointment?')) {
                              cancelBooking(b.id, isAr ? 'إلغاء إداري' : 'Administrative cancellation');
                            }
                          }}
                          className="py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 text-xs"
                        >
                          {isAr ? 'إلغاء الموعد' : 'Cancel'}
                        </button>
                      )}

                      {/* Download ICS */}
                      <button
                        onClick={() => {
                          if (!manager) return;
                          const ics = generateICSFile(
                            b,
                            isAr ? companySettings.brandNameAr : companySettings.brandNameEn,
                            isAr ? manager.nameAr : manager.name
                          );
                          const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${b.referenceNumber}.ics`;
                          a.click();
                        }}
                        className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                        title={isAr ? 'تحميل ملف التقويم ICS' : 'Download .ICS Calendar File'}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Availability Configuration View */
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6 max-w-2xl">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-base font-bold text-white font-serif-luxury uppercase">
              {isAr ? 'قواعد التوفر وساعات العمل للمسؤولين' : 'Manager Availability Rules & Working Hours'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {isAr
                ? 'تخصيص أيام العمل، مدة كل جلسة بالدقائق، والفاصل الزمني الإلزامي بين كل استشارة.'
                : 'Configure working days, consultation slot duration, and mandatory buffer intervals between sessions.'}
            </p>
          </div>

          {availabilitySaved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{isAr ? 'تم حفظ إعدادات التوفر وتحديث مولد المواعيد فوراً!' : 'Availability settings saved and applied to booking generator!'}</span>
            </div>
          )}

          <form onSubmit={handleSaveAvailability} className="space-y-6 text-xs">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1.5">
                {isAr ? 'اختيار المسؤول لتعديل ساعات عمله' : 'Select Executive Manager to Configure'}
              </label>
              <select
                value={settingsManagerId}
                onChange={(e) => {
                  setSettingsManagerId(e.target.value);
                  const m = employees.find((emp) => emp.id === e.target.value);
                  if (m) {
                    setWorkingDays(m.workingHours.days);
                    setStartHour(m.workingHours.start);
                    setEndHour(m.workingHours.end);
                    setSlotDuration(m.workingHours.slotDurationMinutes);
                    setBufferTime(m.workingHours.bufferMinutes);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {isAr ? emp.nameAr : emp.name} ({emp.title})
                  </option>
                ))}
              </select>
            </div>

            {/* Working Days Checkboxes */}
            <div>
              <label className="block text-neutral-300 font-semibold mb-2">
                {isAr ? 'أيام العمل الرسمية لاستقبال المواعيد' : 'Active Working Days'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dayLabels.map((d) => {
                  const active = workingDays.includes(d.idx);
                  return (
                    <button
                      type="button"
                      key={d.idx}
                      onClick={() => toggleDay(d.idx)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-colors ${
                        active
                          ? 'bg-[#A30D25]/15 border-[#A30D25] text-white'
                          : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <span>{d.label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#ff4c68]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours and Intervals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1">{isAr ? 'بداية الدوام' : 'Office Start'}</label>
                <input
                  type="time"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{isAr ? 'نهاية الدوام' : 'Office End'}</label>
                <input
                  type="time"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{isAr ? 'مدة الجلسة' : 'Slot Duration'}</label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                >
                  <option value={30}>{isAr ? '٣٠ دقيقة' : '30 minutes'}</option>
                  <option value={45}>{isAr ? '٤٥ دقيقة' : '45 minutes'}</option>
                  <option value={60}>{isAr ? '٦٠ دقيقة' : '60 minutes'}</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{isAr ? 'الفاصل الزمني' : 'Buffer Interval'}</label>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                >
                  <option value={10}>{isAr ? '١٠ دقائق' : '10 minutes'}</option>
                  <option value={15}>{isAr ? '١٥ دقيقة' : '15 minutes'}</option>
                  <option value={20}>{isAr ? '٢٠ دقيقة' : '20 minutes'}</option>
                  <option value={30}>{isAr ? '٣٠ دقيقة' : '30 minutes'}</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-wider font-bold transition-all"
            >
              {isAr ? 'حفظ قواعد وساعات العمل' : 'Save Working Rules'}
            </button>
          </form>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleOpen && selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0e0e0e] border border-neutral-800 p-6 space-y-4 text-right" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="text-base font-bold text-white font-serif-luxury uppercase">
              {isAr ? `إعادة جدولة الموعد (${selectedMeeting.referenceNumber})` : `Reschedule Meeting (${selectedMeeting.referenceNumber})`}
            </h3>
            <p className="text-xs text-neutral-400">
              {isAr
                ? `حدد تاريخاً وتوقيتاً جديدين للاجتماع مع المشارك ${selectedMeeting.attendeeName}.`
                : `Select new date and session timing for attendee ${selectedMeeting.attendeeName}.`}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'التاريخ الجديد' : 'New Date'}
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'وقت البدء' : 'Start Time'}
                  </label>
                  <input
                    type="time"
                    value={rescheduleStart}
                    onChange={(e) => setRescheduleStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'وقت الانتهاء' : 'End Time'}
                  </label>
                  <input
                    type="time"
                    value={rescheduleEnd}
                    onChange={(e) => setRescheduleEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setRescheduleOpen(false)}
                className="py-1.5 px-3 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  rescheduleBooking(selectedMeeting.id, rescheduleDate, rescheduleStart, rescheduleEnd);
                  setRescheduleOpen(false);
                }}
                className="py-1.5 px-4 rounded-lg bg-[#A30D25] text-white font-bold"
              >
                {isAr ? 'تأكيد إعادة الجدولة' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
