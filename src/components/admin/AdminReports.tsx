import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  Building,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
  Filter,
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, employees, departments, hasUserPermission, language } = useApp();
  const isAr = language === 'ar';

  const [dateRange, setDateRange] = useState('ALL');
  const canExport = hasUserPermission('export_reports');

  // Stats calculations
  const total = bookings.length;
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const cancelled = bookings.filter((b) => b.status === 'cancelled').length;

  const confirmationRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  // Department distribution
  const deptBreakdown = departments.map((d) => {
    const count = bookings.filter((b) => b.departmentId === d.id).length;
    return {
      name: isAr ? d.nameAr : d.nameEn,
      code: d.code,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  // Manager volume leaderboard
  const managerBreakdown = employees.map((emp) => {
    const count = bookings.filter((b) => b.managerId === emp.id).length;
    return {
      name: isAr ? emp.nameAr : emp.name,
      title: emp.title,
      count,
    };
  }).sort((a, b) => b.count - a.count);

  const handleExportCSV = () => {
    if (!canExport) return;

    const headers = [
      'Reference Number',
      'Date',
      'Start Time',
      'End Time',
      'Format',
      'Status',
      'Attendee Name',
      'Attendee Email',
      'Attendee Phone',
      'Attendee Company',
      'Executive Host',
      'Department',
      'Subject',
    ];

    const rows = bookings.map((b) => {
      const manager = employees.find((e) => e.id === b.managerId);
      const dept = departments.find((d) => d.id === b.departmentId);
      return [
        b.referenceNumber,
        b.date,
        b.startTime,
        b.endTime,
        b.meetingType,
        b.status,
        `"${b.attendeeName.replace(/"/g, '""')}"`,
        `"${b.attendeeEmail}"`,
        `"${b.attendeePhone}"`,
        `"${(b.attendeeCompany || '').replace(/"/g, '""')}"`,
        `"${manager ? (isAr ? manager.nameAr : manager.name).replace(/"/g, '""') : 'N/A'}"`,
        `"${dept ? (isAr ? dept.nameAr : dept.nameEn).replace(/"/g, '""') : 'N/A'}"`,
        `"${b.subject.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HEART_HEALTH_Executive_Meetings_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'التقارير التحليلية وتصدير البيانات' : 'Executive Analytics & Reports'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'معدلات الحجوزات، والتوزيع حسب القطاعات، ونشاط المسؤولين، وتصدير جداول البيانات بصيغة CSV.'
              : 'Booking velocity, departmental distribution, manager utilization, and CSV data export.'}
          </p>
        </div>

        {canExport && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تصدير كملف CSV' : 'Export CSV'}</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="py-2.5 px-4 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تحميل التقرير' : 'Download Report'}</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {isAr ? 'إجمالي الجلسات والمواعيد' : 'Total Consultations'}
          </p>
          <p className="text-2xl font-black text-white font-mono mt-1">{total}</p>
          <p className="text-[11px] text-neutral-400 mt-1">{isAr ? 'جلسة مسجلة' : 'Logged sessions'}</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {isAr ? 'نسبة الاعتماد والتأكيد' : 'Confirmation Ratio'}
          </p>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">{confirmationRate}%</p>
          <p className="text-[11px] text-emerald-500/80 mt-1">{confirmed} {isAr ? 'موعد مؤكد' : 'confirmed'}</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {isAr ? 'نسبة الإلغاء والاعتذار' : 'Cancellation Rate'}
          </p>
          <p className="text-2xl font-black text-neutral-300 font-mono mt-1">{cancellationRate}%</p>
          <p className="text-[11px] text-rose-400 mt-1">{cancelled} {isAr ? 'ملغي' : 'cancelled'}</p>
        </div>

        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
            {isAr ? 'قيد المراجعة والاعتماد' : 'Pending Triage'}
          </p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">{pending}</p>
          <p className="text-[11px] text-amber-400/80 mt-1">{isAr ? 'بانتظار إجراء' : 'In review'}</p>
        </div>
      </div>

      {/* Two Columns: Department Volume & Manager Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Department Volume */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-[#A30D25]" />
            <span>{isAr ? 'حجم المواعيد حسب القطاع' : 'Volume by Corporate Department'}</span>
          </h3>

          <div className="space-y-3 pt-2">
            {deptBreakdown.map((item) => (
              <div key={item.code} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">{item.name}</span>
                  <span className="font-mono text-neutral-400">
                    {item.count} {isAr ? 'جلسة' : 'sessions'} ({item.pct}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#A30D25] to-[#f01840] h-full"
                    style={{ width: `${Math.max(item.pct, 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Leaderboard */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#A30D25]" />
            <span>{isAr ? 'نشاط المقابلات حسب المسؤول' : 'Executive Meeting Volume'}</span>
          </h3>

          <div className="divide-y divide-neutral-900 pt-1">
            {managerBreakdown.map((mgr) => (
              <div key={mgr.name} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{mgr.name}</p>
                  <p className="text-[11px] text-neutral-400">{mgr.title}</p>
                </div>
                <div className={isAr ? 'text-left' : 'text-right'}>
                  <span className="font-mono font-bold text-white">{mgr.count}</span>
                  <span className="text-[10px] text-neutral-400 block uppercase">
                    {isAr ? 'موعد' : 'Bookings'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
