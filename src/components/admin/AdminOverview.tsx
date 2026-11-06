import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Users,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowUpLeft,
  Shield,
  Activity,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    employees,
    departments,
    bookings,
    updateBookingStatus,
    setAdminSection,
    hasUserPermission,
    language,
  } = useApp();

  const isAr = language === 'ar';
  const todayStr = new Date().toISOString().split('T')[0];

  const totalEmployees = employees.length;
  const activeDepartments = departments.filter((d) => d.active).length;
  const todayMeetings = bookings.filter((b) => b.date === todayStr);
  const upcomingMeetings = bookings.filter(
    (b) => b.date >= todayStr && b.status === 'confirmed'
  );
  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const cancelledMeetings = bookings.filter((b) => b.status === 'cancelled');

  const canApprove = hasUserPermission('approve_bookings');
  const canReject = hasUserPermission('reject_bookings');

  // Distribution by department
  const deptStats = departments.map((dept) => {
    const count = bookings.filter((b) => b.departmentId === dept.id).length;
    return {
      name: isAr ? dept.nameAr : dept.nameEn,
      count,
      code: dept.code,
    };
  });

  return (
    <div className={`space-y-8 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isAr ? 'إجمالي القيادات' : 'Total Staff'}
            </span>
            <Users className="w-4 h-4 text-[#ff4c68]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{totalEmployees}</p>
          <span className="text-[10px] text-emerald-400 mt-1 inline-block">
            {isAr ? '١٠٠٪ على رأس العمل' : '100% Active'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isAr ? 'القطاعات' : 'Departments'}
            </span>
            <Building2 className="w-4 h-4 text-[#ff4c68]" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{activeDepartments}</p>
          <span className="text-[10px] text-neutral-400 mt-1 inline-block">
            {isAr ? 'قطاعات تنفيذية' : 'Sectors'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isAr ? 'مواعيد اليوم' : "Today's Agenda"}
            </span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{todayMeetings.length}</p>
          <span className="text-[10px] text-neutral-400 mt-1 inline-block">
            {isAr ? 'جلسات اليوم' : 'Sessions'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isAr ? 'المواعيد القادمة' : 'Upcoming'}
            </span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{upcomingMeetings.length}</p>
          <span className="text-[10px] text-blue-400 mt-1 inline-block">
            {isAr ? 'مؤكدة' : 'Confirmed'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isAr ? 'بانتظار المراجعة' : 'Pending Review'}
            </span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{pendingRequests.length}</p>
          <span className="text-[10px] text-neutral-400 mt-1 inline-block">
            {isAr ? 'تتطلب إجراء' : 'Needs action'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              {isAr ? 'المواعيد الملغاة' : 'Cancelled'}
            </span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-neutral-400 font-mono">{cancelledMeetings.length}</p>
          <span className="text-[10px] text-rose-400 mt-1 inline-block">
            {isAr ? 'ملغي / معتذر' : 'Revoked'}
          </span>
        </div>
      </div>

      {/* Main Grid: Pending Action Triage & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Requests & Approvals */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif-luxury">
                {isAr ? 'قائمة الطلبات والموافقات المعلقة' : 'Executive Action Queue'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isAr
                  ? 'طلبات حجز المواعيد الجديدة بانتظار اعتماد المسؤول التنفيذي.'
                  : 'Incoming booking requests awaiting managerial confirmation.'}
              </p>
            </div>
            <button
              onClick={() => setAdminSection('calendar')}
              className="text-xs text-[#ff4c68] hover:underline flex items-center gap-1"
            >
              <span>{isAr ? 'عرض جدول التقويم' : 'View Full Calendar'}</span>
              {isAr ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="p-8 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                {isAr
                  ? 'لا توجد طلبات معلقة حالياً. تم البت في كافة المواعيد.'
                  : 'No pending requests. All appointments have been actioned.'}
              </div>
            ) : (
              pendingRequests.map((req) => {
                const manager = employees.find((e) => e.id === req.managerId);
                const dept = departments.find((d) => d.id === req.departmentId);
                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                          {req.referenceNumber}
                        </span>
                        <span className="text-xs text-white font-bold">{req.subject}</span>
                      </div>
                      <p className="text-xs text-neutral-300">
                        {isAr ? 'المشارك: ' : 'Attendee: '}
                        <span className="text-white font-medium">{req.attendeeName}</span> (
                        {req.attendeeCompany || req.attendeeEmail})
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {isAr ? 'المضيف: ' : 'Host: '}
                        <span className="text-[#ff4c68]">
                          {manager ? (isAr ? manager.nameAr : manager.name) : req.managerId}
                        </span>{' '}
                        • {req.date} {isAr ? 'الساعة' : 'at'} {req.startTime} (
                        {req.meetingType === 'in-person'
                          ? (isAr ? 'حضوري' : 'In-person')
                          : (isAr ? 'عن بعد' : 'Online')}
                        )
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {canApprove && (
                        <button
                          onClick={() =>
                            updateBookingStatus(
                              req.id,
                              'confirmed',
                              isAr ? 'تم الاعتماد من المكتب التنفيذي' : 'Approved by Executive Office'
                            )
                          }
                          className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'اعتماد الموعد' : 'Approve'}</span>
                        </button>
                      )}
                      {canReject && (
                        <button
                          onClick={() =>
                            updateBookingStatus(
                              req.id,
                              'cancelled',
                              isAr ? 'اعتذار بسبب تعارض في جدول الأعمال' : 'Declined due to schedule conflict'
                            )
                          }
                          className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isAr ? 'اعتذار' : 'Decline'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Department Volume Statistics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif-luxury">
              {isAr ? 'توزيع المواعيد حسب القطاع' : 'Bookings by Sector'}
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              {isAr ? 'الإجمالي:' : 'Total:'} {bookings.length}
            </span>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3.5">
            {deptStats.map((item) => {
              const percentage =
                bookings.length > 0 ? Math.round((item.count / bookings.length) * 100) : 0;
              return (
                <div key={item.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 truncate max-w-[200px]">{item.name}</span>
                    <span className="font-mono text-neutral-400">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#A30D25] to-[#e61338] h-full"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
