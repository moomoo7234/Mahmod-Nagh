import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  generateReferenceNumber,
  generateTimeSlots,
  isSlotAvailable,
  generateICSFile,
  generateGoogleCalendarUrl,
  TimeSlot,
} from '../../utils/bookingEngine.ts';
import { MeetingType, MeetingBooking } from '../../types/index.ts';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Download,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Video,
  MapPin,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Sparkles,
} from 'lucide-react';

export const MeetingBookingFlow: React.FC = () => {
  const {
    departments,
    employees,
    bookings,
    addBooking,
    selectedManagerForBooking,
    preselectedDepartmentId,
    setActiveView,
    companySettings,
    language,
  } = useApp();

  const isAr = language === 'ar';

  // Wizard state: 1 = Department, 2 = Manager, 3 = Date & Time, 4 = Details, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    preselectedDepartmentId || departments[0]?.id || ''
  );
  const [selectedManagerId, setSelectedManagerId] = useState<string>(
    selectedManagerForBooking?.id || ''
  );

  // Date selection (default to next working day)
  const getNextAvailableDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // give 2 days advance notice
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getNextAvailableDate());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Attendee info
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [attendeePhone, setAttendeePhone] = useState('+966 ');
  const [attendeeCompany, setAttendeeCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [meetingType, setMeetingType] = useState<MeetingType>('in-person');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<MeetingBooking | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // React to pre-selections if opened from a specific manager card
  useEffect(() => {
    if (selectedManagerForBooking) {
      setSelectedDeptId(selectedManagerForBooking.departmentId);
      setSelectedManagerId(selectedManagerForBooking.id);
      setCurrentStep(3); // Jump straight to date & slot selection
    } else if (preselectedDepartmentId) {
      setSelectedDeptId(preselectedDepartmentId);
      setCurrentStep(2);
    }
  }, [selectedManagerForBooking, preselectedDepartmentId]);

  const selectedManager = employees.find((e) => e.id === selectedManagerId);
  const selectedDepartment = departments.find((d) => d.id === selectedDeptId);

  // Generate available slots for the selected manager and date
  const availableSlots: TimeSlot[] = selectedManager
    ? generateTimeSlots(selectedManager.workingHours, selectedDate, bookings)
    : [];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!selectedManager || !selectedSlot) {
      setBookingError(
        isAr
          ? 'يرجى اختيار المسؤول التنفيذي وتحديد الفترة الزمنية للموعد.'
          : 'Please select an executive and time slot.'
      );
      return;
    }

    if (!attendeeName.trim() || !attendeeEmail.trim() || !subject.trim()) {
      setBookingError(
        isAr
          ? 'يرجى استكمال جميع الحقول الإلزامية للمتابعة.'
          : 'Please complete all required fields.'
      );
      return;
    }

    // Double-check availability to guarantee no double-booking
    const available = isSlotAvailable(
      selectedDate,
      selectedSlot.time,
      selectedSlot.endTime,
      bookings
    );

    if (!available) {
      setBookingError(
        isAr
          ? 'عذراً، تم حجز هذا التوقيت للتو من قِبل طرف آخر. يرجى اختيار فترة أخرى.'
          : 'This time slot was just booked by another attendee. Please pick another slot.'
      );
      return;
    }

    const refNum = generateReferenceNumber();
    const virtualMeetUrl =
      meetingType === 'online'
        ? `https://meet.google.com/hh-${Math.random().toString(36).slice(-3)}-${Math.random().toString(36).slice(-4)}`
        : undefined;

    const newBooking = addBooking({
      referenceNumber: refNum,
      departmentId: selectedDeptId,
      managerId: selectedManager.id,
      attendeeName: attendeeName.trim(),
      attendeeEmail: attendeeEmail.trim(),
      attendeePhone: attendeePhone.trim(),
      attendeeCompany: attendeeCompany.trim(),
      subject: subject.trim(),
      description: description.trim(),
      meetingType,
      date: selectedDate,
      startTime: selectedSlot.time,
      endTime: selectedSlot.endTime,
      status: 'confirmed',
      meetUrl: virtualMeetUrl,
    });

    setConfirmedBooking(newBooking);
    setCurrentStep(5);
  };

  const handleDownloadICS = () => {
    if (!confirmedBooking || !selectedManager) return;
    const icsContent = generateICSFile(
      confirmedBooking,
      isAr ? companySettings.brandNameAr : companySettings.brandNameEn,
      isAr ? selectedManager.nameAr : selectedManager.name
    );
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${confirmedBooking.referenceNumber}-executive-meeting.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyReference = () => {
    if (!confirmedBooking) return;
    const managerName = isAr ? selectedManager?.nameAr : selectedManager?.name;
    navigator.clipboard.writeText(
      `HEART HEALTH Meeting: ${confirmedBooking.referenceNumber}\nDate: ${confirmedBooking.date} at ${confirmedBooking.startTime}\nHost: ${managerName}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetBookingForm = () => {
    setCurrentStep(1);
    setSelectedSlot(null);
    setAttendeeName('');
    setAttendeeEmail('');
    setAttendeePhone('+966 ');
    setAttendeeCompany('');
    setSubject('');
    setDescription('');
    setConfirmedBooking(null);
    setBookingError(null);
  };

  return (
    <div
      className="min-h-screen bg-[#080808] text-white pt-8 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background radial crimson */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#A30D25]/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Title */}
        <div className="text-center mb-10 space-y-2">
          <button
            onClick={() => setActiveView('public')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{isAr ? 'العودة للرئيسية' : 'Return to Portal Home'}</span>
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A30D25]/15 border border-[#A30D25]/40 text-[#ff4c68] text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'التقويم التنفيذي الرسمي' : 'Official Executive Calendar'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif-luxury tracking-tight uppercase">
            {isAr ? 'حجز موعد واجتماع تنفيذي' : 'EXECUTIVE MEETING BOOKING'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            {isAr
              ? 'احجز استشارة رسمية، أو مراجعة إكلينيكية، أو تفاوض توريد وشراكة استراتيجية مع قيادات شركة صيدليات صحة القلب.'
              : 'Book formal consultations, clinical reviews, supplier negotiations, and executive dialogues with HEART HEALTH leadership.'}
          </p>
        </div>

        {/* Step Progress Indicators */}
        {currentStep < 5 && (
          <div className="mb-10">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { num: 1, title: isAr ? 'القطاع' : 'Department' },
                { num: 2, title: isAr ? 'المسؤول' : 'Executive' },
                { num: 3, title: isAr ? 'الموعد والوقت' : 'Date & Time' },
                { num: 4, title: isAr ? 'البيانات' : 'Details' },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1.5 transition-all text-xs ${
                      currentStep === s.num
                        ? 'bg-[#A30D25] text-white ring-4 ring-[#A30D25]/30'
                        : currentStep > s.num
                        ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                    }`}
                  >
                    {currentStep > s.num ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] uppercase tracking-wider font-semibold ${
                      currentStep === s.num ? 'text-white' : 'text-neutral-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-neutral-900 h-1 mt-4 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#A30D25] to-[#e61338] h-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Select Department */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-bold font-serif-luxury text-white uppercase tracking-wide">
                {isAr ? 'الخطوة ١: تحديد القطاع أو الإدارة' : 'Step 1: Select Corporate Department'}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {isAr
                  ? 'اختر القطاع المتوافق مع موضوع الاجتماع أو الاتفاقية المقترحة.'
                  : 'Choose the sector corresponding to the nature of your meeting or proposal.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments
                .filter((d) => d.active)
                .map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isAr ? 'text-right' : 'text-left'
                      } ${
                        isSelected
                          ? 'bg-[#A30D25]/15 border-[#A30D25] shadow-[0_0_20px_rgba(163,13,37,0.3)]'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-[#ff4c68] font-bold">
                          {dept.code}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#A30D25]" />}
                      </div>
                      <p className="text-xs text-[#A30D25] font-serif-luxury font-semibold">
                        {isAr ? dept.nameEn : dept.nameAr}
                      </p>
                      <h3 className="text-sm font-bold text-white mt-0.5">
                        {isAr ? dept.nameAr : dept.nameEn}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">
                        {dept.description}
                      </p>
                    </div>
                  );
                })}
            </div>

            <div className={`flex ${isAr ? 'justify-start' : 'justify-end'} pt-4`}>
              <button
                onClick={() => {
                  const deptManagers = employees.filter((e) => e.departmentId === selectedDeptId);
                  if (deptManagers.length > 0) {
                    setSelectedManagerId(deptManagers[0].id);
                  }
                  setCurrentStep(2);
                }}
                className="py-3 px-6 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2"
              >
                <span>{isAr ? 'المتابعة لاختيار المسؤول التنفيذي' : 'Continue to Executive Selection'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Manager */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white uppercase tracking-wide">
                  {isAr ? 'الخطوة ٢: اختيار المسؤول أو المدير التنفيذي' : 'Step 2: Select Executive or Manager'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isAr ? 'القطاع المختار: ' : 'Department: '}
                  <span className="text-white font-semibold">
                    {isAr ? selectedDepartment?.nameAr : selectedDepartment?.nameEn}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                {isAr ? 'تغيير القطاع' : 'Change Department'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {employees
                .filter((e) => e.departmentId === selectedDeptId && e.active)
                .map((emp) => {
                  const isSelected = selectedManagerId === emp.id;
                  return (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedManagerId(emp.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                        isAr ? 'text-right' : 'text-left'
                      } ${
                        isSelected
                          ? 'bg-[#A30D25]/15 border-[#A30D25] shadow-[0_0_20px_rgba(163,13,37,0.3)]'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-16 h-20 rounded-lg object-cover object-top shrink-0 border border-neutral-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-[#A30D25] font-serif-luxury font-bold uppercase">
                            {isAr ? emp.name : emp.nameAr}
                          </p>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#A30D25]" />}
                        </div>
                        <h3 className="text-sm font-bold text-white mt-0.5">
                          {isAr ? emp.nameAr : emp.name}
                        </h3>
                        <p className="text-xs text-neutral-300 font-medium">{emp.title}</p>
                        <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A30D25]" />
                          {isAr
                            ? `${emp.workingHours.slotDurationMinutes} دقيقة (${emp.workingHours.start} - ${emp.workingHours.end})`
                            : `${emp.workingHours.slotDurationMinutes} min slot (${emp.workingHours.start}-${emp.workingHours.end})`}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="py-2.5 px-4 rounded-lg bg-neutral-900 text-neutral-300 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800"
              >
                {isAr ? 'السابق' : 'Back'}
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="py-3 px-6 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2"
              >
                <span>{isAr ? 'اختيار التاريخ والموعد' : 'Select Calendar Slot'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Date & Time Slot Selection */}
        {currentStep === 3 && selectedManager && (
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-2">
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white uppercase tracking-wide">
                  {isAr ? 'الخطوة ٣: تحديد التاريخ والأوقات المتاحة' : 'Step 3: Select Date & Available Slot'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isAr ? 'المسؤول: ' : 'Manager: '}
                  <span className="text-white font-semibold">
                    {isAr ? selectedManager.nameAr : selectedManager.name}
                  </span>{' '}
                  ({selectedManager.title})
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                {isAr ? 'تغيير المسؤول' : 'Change Executive'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Date Input & Manager Schedule Rules */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-2">
                    {isAr ? 'تاريخ الموعد *' : 'Appointment Date *'}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1.5">
                    {isAr
                      ? 'أيام العمل الرسمية: الأحد إلى الخميس (أسبوع الأعمال السعودي).'
                      : 'Standard working days: Sunday to Thursday (Saudi Business Week).'}
                  </p>
                </div>

                {/* Manager working summary */}
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs space-y-2">
                  <p className="font-bold text-white uppercase tracking-wider">
                    {isAr ? 'جدول المواعيد التنفيذي' : 'Executive Availability Profile'}
                  </p>
                  <p className="text-neutral-400">
                    {isAr ? 'ساعات العمل: ' : 'Office Hours: '}
                    <span className="text-white font-mono">
                      {selectedManager.workingHours.start} - {selectedManager.workingHours.end}
                    </span>
                  </p>
                  <p className="text-neutral-400">
                    {isAr ? 'مدة الجلسة: ' : 'Slot Duration: '}
                    <span className="text-white">
                      {selectedManager.workingHours.slotDurationMinutes} {isAr ? 'دقيقة' : 'minutes'}
                    </span>{' '}
                    (+ {selectedManager.workingHours.bufferMinutes} {isAr ? 'دقيقة فاصل' : 'm buffer'})
                  </p>
                  <p className="text-neutral-400">
                    {isAr ? 'منع التعارض المزدوج: ' : 'Double-Booking Guard: '}
                    <span className="text-emerald-400 font-semibold">
                      {isAr ? 'مفعل وفوري' : 'Active & Enforced'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Slots Grid */}
              <div className="md:col-span-7">
                <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-2">
                  {isAr ? `الفترات المتاحة ليوم ${selectedDate}` : `Available Slots for ${selectedDate}`}
                </label>

                {availableSlots.length === 0 ? (
                  <div className="p-8 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-sm font-semibold text-white">
                      {isAr ? 'لا توجد مواعيد متاحة في هذا اليوم' : 'No Slots on this Date'}
                    </p>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                      {isAr
                        ? `${selectedManager.nameAr} غير متاح في هذا التاريخ (إما عطلة أو جدول محجوز بالكامل). يرجى اختيار تاريخ آخر.`
                        : `${selectedManager.name} is not available on this date. Please choose another date.`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#A30D25] text-white shadow-[0_0_15px_rgba(163,13,37,0.5)] border border-[#ff4d6a]'
                              : slot.available
                              ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800'
                              : 'bg-neutral-950 text-neutral-600 border border-neutral-900 cursor-not-allowed line-through'
                          }`}
                        >
                          <span className="font-mono text-sm">{slot.formatted}</span>
                          <span className="text-[10px] opacity-75 mt-0.5">
                            {isAr ? `حتى ${slot.endTime}` : `until ${slot.endTime}`}
                          </span>
                          {!slot.available && (
                            <span className="text-[9px] text-rose-500 font-mono no-underline">
                              {isAr ? 'محجوز' : 'Booked'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              <button
                onClick={() => setCurrentStep(2)}
                className="py-2.5 px-4 rounded-lg bg-neutral-900 text-neutral-300 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800"
              >
                {isAr ? 'السابق' : 'Back'}
              </button>
              <button
                disabled={!selectedSlot}
                onClick={() => setCurrentStep(4)}
                className={`py-3 px-6 rounded-xl text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${
                  selectedSlot
                    ? 'bg-[#A30D25] hover:bg-[#c20f2e] text-white shadow-lg'
                    : 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                }`}
              >
                <span>{isAr ? 'المتابعة لبيانات الحضور' : 'Continue to Attendee Info'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Attendee Info & Meeting Subject */}
        {currentStep === 4 && selectedManager && selectedSlot && (
          <form
            onSubmit={handleConfirmBooking}
            className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white uppercase tracking-wide">
                  {isAr ? 'الخطوة ٤: تفاصيل الاجتماع وبيانات المشارك' : 'Step 4: Meeting Details & Attendee Information'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  {isAr
                    ? `الموعد مع ${selectedManager.nameAr} في ${selectedDate} الساعة ${selectedSlot.formatted}`
                    : `Appointment with ${selectedManager.name} on ${selectedDate} at ${selectedSlot.formatted}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                {isAr ? 'تغيير الموعد' : 'Change Slot'}
              </button>
            </div>

            {bookingError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Meeting Type Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-2">
                {isAr ? 'صيغة ومكان الاجتماع *' : 'Meeting Format *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMeetingType('in-person')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    isAr ? 'text-right' : 'text-left'
                  } ${
                    meetingType === 'in-person'
                      ? 'bg-[#A30D25]/20 border-[#A30D25] text-white shadow-md'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <MapPin className="w-5 h-5 text-[#ff4c68] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      {isAr ? 'اجتماع حضوري في قاعة الإدارة' : 'In-Person Boardroom'}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {isAr ? 'المقر الرئيسي، طريق الملك فهد، الرياض' : 'HEART HEALTH HQ, King Fahd Rd, Riyadh'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingType('online')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    isAr ? 'text-right' : 'text-left'
                  } ${
                    meetingType === 'online'
                      ? 'bg-[#A30D25]/20 border-[#A30D25] text-white shadow-md'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <Video className="w-5 h-5 text-[#ff4c68] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      {isAr ? 'اجتماع مرئي مشفر (Google Meet)' : 'Virtual Conference'}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {isAr ? 'جلسة فيديو رقمية عالية الأمان' : 'Encrypted Google Meet video session'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Attendee Info Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                  {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  placeholder={isAr ? 'مثال: المهندس منصور الفايز' : 'e.g. Eng. Mansoor Al-Fayez'}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                  {isAr ? 'البريد الإلكتروني المؤسسي *' : 'Corporate Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  placeholder="m.fayez@partner.sa"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                  {isAr ? 'رقم الجوال *' : 'Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  placeholder="+966 50 XXX XXXX"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                  {isAr ? 'الشركة / الجهة التابع لها' : 'Company / Organization'}
                </label>
                <input
                  type="text"
                  value={attendeeCompany}
                  onChange={(e) => setAttendeeCompany(e.target.value)}
                  placeholder={isAr ? 'مثال: شركة حلول الأدوية السعودية' : 'e.g. Saudi Pharma Solutions Ltd.'}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                />
              </div>
            </div>

            {/* Subject and Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                  {isAr ? 'موضوع الاجتماع *' : 'Meeting Subject *'}
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: اتفاقية توريد حصري لأدوية القلب والأوعية الدموية'
                      : 'e.g. Exclusive Distribution Agreement for Cardiology Therapeutics'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                  {isAr ? 'جدول الأعمال وتفاصيل الاجتماع *' : 'Meeting Agenda & Description *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isAr
                      ? 'يرجى إيجاز النقاط الرئيسية، أو نطاق التعاون التجاري، أو المستندات المراد مراجعتها أثناء الجلسة...'
                      : 'Briefly describe the key discussion items, commercial scope, or documentation to be reviewed...'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="py-2.5 px-4 rounded-lg bg-neutral-900 text-neutral-300 text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800"
              >
                {isAr ? 'السابق' : 'Back'}
              </button>
              <button
                type="submit"
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#A30D25] to-[#78081a] hover:from-[#b80f2b] hover:to-[#8c0a20] text-white text-xs uppercase tracking-widest font-bold shadow-[0_0_25px_rgba(163,13,37,0.4)] transition-all flex items-center gap-2 border border-[#ff4c68]/40"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وحجز الموعد التنفيذي' : 'Confirm & Lock Appointment'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Confirmation Screen */}
        {currentStep === 5 && confirmedBooking && selectedManager && (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0c0c0c] border border-neutral-800 shadow-[0_0_60px_rgba(163,13,37,0.3)] space-y-8 animate-fadeIn text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#A30D25] tracking-widest uppercase font-serif-luxury">
                {isAr ? 'تم تأكيد الموعد بنجاح' : 'Booking Confirmed'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-luxury uppercase tracking-tight mt-1">
                {isAr ? 'تم تسجيل وتثبيت الموعد التنفيذي' : 'EXECUTIVE APPOINTMENT RESERVED'}
              </h2>
              <p className="text-xs text-neutral-400 mt-2 max-w-md mx-auto">
                {isAr
                  ? 'تم إدراج موعدك في التقويم التنفيذي الرسمي لشركة صيدليات صحة القلب، وتوليد إشعار فوري للمسؤول.'
                  : "Your appointment has been registered in HEART HEALTH's executive calendar system. A confirmation notification has been prepared."}
              </p>
            </div>

            {/* Reference Number Box */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 max-w-md mx-auto flex items-center justify-between">
              <div className={isAr ? 'text-right' : 'text-left'}>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block">
                  {isAr ? 'الرقم المرجعي للحجز' : 'Booking Reference Number'}
                </span>
                <span className="text-lg font-mono font-bold text-[#ff4c68]">
                  {confirmedBooking.referenceNumber}
                </span>
              </div>
              <button
                onClick={copyReference}
                className="py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الرقم' : 'Copy')}</span>
              </button>
            </div>

            {/* Summary Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto p-6 rounded-xl bg-neutral-900/50 border border-neutral-800/80 text-xs ${
                isAr ? 'text-right' : 'text-left'
              }`}
            >
              <div>
                <p className="text-neutral-400 uppercase tracking-wider text-[10px]">
                  {isAr ? 'المسؤول المضيف' : 'Executive Host'}
                </p>
                <p className="text-white font-bold mt-0.5">
                  {isAr ? selectedManager.nameAr : selectedManager.name}
                </p>
                <p className="text-neutral-400 text-[11px]">{selectedManager.title}</p>
              </div>

              <div>
                <p className="text-neutral-400 uppercase tracking-wider text-[10px]">
                  {isAr ? 'التاريخ والوقت' : 'Date & Time'}
                </p>
                <p className="text-white font-bold mt-0.5">{confirmedBooking.date}</p>
                <p className="text-[#ff4c68] font-mono text-[11px] font-semibold">
                  {confirmedBooking.startTime} - {confirmedBooking.endTime} ({isAr ? 'بتوقيت مكة' : 'AST'})
                </p>
              </div>

              <div>
                <p className="text-neutral-400 uppercase tracking-wider text-[10px]">
                  {isAr ? 'المشارك' : 'Attendee'}
                </p>
                <p className="text-white font-semibold mt-0.5">{confirmedBooking.attendeeName}</p>
                <p className="text-neutral-400 text-[11px]">{confirmedBooking.attendeeEmail}</p>
              </div>

              <div>
                <p className="text-neutral-400 uppercase tracking-wider text-[10px]">
                  {isAr ? 'الصيغة والمقر' : 'Format & Location'}
                </p>
                <p className="text-white font-semibold mt-0.5">
                  {confirmedBooking.meetingType === 'in-person'
                    ? (isAr ? 'حضوري' : 'In-Person')
                    : (isAr ? 'عن بعد' : 'Virtual')}
                </p>
                <p className="text-neutral-400 text-[11px]">
                  {confirmedBooking.meetingType === 'in-person'
                    ? (isAr ? 'قاعة المجلس التنفيذي، الرياض' : 'HQ Boardroom, King Fahd Rd, Riyadh')
                    : (isAr ? 'جلسة فيديو عبر Google Meet' : 'Google Meet Virtual Session')}
                </p>
              </div>

              {confirmedBooking.meetUrl && (
                <div className="sm:col-span-2 pt-2 border-t border-neutral-800">
                  <p className="text-neutral-400 uppercase tracking-wider text-[10px]">
                    {isAr ? 'رابط الاجتماع المرئي' : 'Video Conference Link'}
                  </p>
                  <a
                    href={confirmedBooking.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#ff4c68] hover:underline font-mono text-xs flex items-center gap-1 mt-0.5"
                  >
                    <span>{confirmedBooking.meetUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Calendar Integration Actions (Google Calendar Web + Apple/Outlook ICS download) */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                {isAr ? 'المزامنة مع تقويمك الشخصي' : 'Calendar Synchronization'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Direct Google Calendar Link */}
                <a
                  href={generateGoogleCalendarUrl(
                    confirmedBooking,
                    isAr ? companySettings.brandNameAr : companySettings.brandNameEn,
                    isAr ? selectedManager.nameAr : selectedManager.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <CalendarIcon className="w-4 h-4 text-[#ff4c68]" />
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>

                {/* Apple Calendar / Outlook ICS File Download */}
                <button
                  onClick={handleDownloadICS}
                  className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4 text-[#ff4c68]" />
                  <span>{isAr ? 'تحميل ملف ICS' : 'Download .ICS'}</span>
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                {isAr
                  ? 'متوافق مع Apple Calendar و Microsoft Outlook و Google Calendar.'
                  : 'Compatible with Apple Calendar, Microsoft Outlook, and Google Calendar.'}
              </p>
            </div>

            {/* Final Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-neutral-900">
              <button
                onClick={resetBookingForm}
                className="py-2.5 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs uppercase tracking-wider font-semibold border border-neutral-800"
              >
                {isAr ? 'حجز موعد إضافي' : 'Schedule Another Meeting'}
              </button>
              <button
                onClick={() => setActiveView('public')}
                className="py-2.5 px-6 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-wider font-bold"
              >
                {isAr ? 'العودة للرئيسية' : 'Return to Website'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
