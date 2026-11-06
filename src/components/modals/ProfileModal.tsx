import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Calendar, Mail, Phone, MapPin, Clock, Shield, CheckCircle } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    selectedProfileEmployee,
    setSelectedProfileEmployee,
    departments,
    startBookingWithManager,
    language,
  } = useApp();

  if (!selectedProfileEmployee) return null;

  const isAr = language === 'ar';
  const employee = selectedProfileEmployee;
  const dept = departments.find((d) => d.id === employee.departmentId);

  const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayNames = isAr ? dayNamesAr : dayNamesEn;

  const workingDaysFormatted = employee.workingHours.days
    .map((dayIdx) => dayNames[dayIdx])
    .join('، ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c0c0c] border border-neutral-800 shadow-[0_0_50px_rgba(163,13,37,0.3)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProfileEmployee(null)}
          className={`absolute top-4 ${
            isAr ? 'left-4' : 'right-4'
          } z-20 p-2 rounded-full bg-black/60 hover:bg-black text-neutral-300 hover:text-white border border-neutral-700 transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Portrait */}
        <div className="md:w-5/12 relative aspect-[3/4] md:aspect-auto bg-neutral-900 shrink-0">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-80 md:hidden" />
          <div
            className={`absolute bottom-3 ${
              isAr ? 'right-3' : 'left-3'
            } flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-neutral-300`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? 'مسؤول تنفيذي نشط' : 'Active Executive'}</span>
          </div>
        </div>

        {/* Right Column: Bio & Details */}
        <div className={`md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#A30D25] uppercase tracking-wider font-serif-luxury">
                {isAr ? employee.name : employee.nameAr}
              </span>
              <h3 className="text-2xl font-bold text-white font-serif-luxury mt-0.5">
                {isAr ? employee.nameAr : employee.name}
              </h3>
              <p className="text-sm text-neutral-300 font-medium">
                {employee.title}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5 uppercase tracking-wider">
                {dept ? (isAr ? dept.nameAr : dept.nameEn) : (isAr ? 'القطاع التنفيذي' : 'Executive Department')}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                {isAr ? 'نبذة القيادة والخبرات' : 'Executive Profile'}
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {employee.bio}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A30D25] shrink-0" />
                <span>{employee.officeLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A30D25] shrink-0" />
                <span>{isAr ? `أيام العمل: ${workingDaysFormatted}` : `Working Days: ${workingDaysFormatted}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#A30D25] shrink-0" />
                <span>
                  {isAr
                    ? `ساعات المقابلات: ${employee.workingHours.start} - ${employee.workingHours.end} (${employee.workingHours.slotDurationMinutes} دقيقة للجلسة)`
                    : `Hours: ${employee.workingHours.start} - ${employee.workingHours.end} (${employee.workingHours.slotDurationMinutes} min per slot)`}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-neutral-800 flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedProfileEmployee(null);
                startBookingWithManager(employee);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#A30D25] to-[#78081a] hover:from-[#b80f2b] hover:to-[#8c0a20] text-white text-xs uppercase tracking-[0.18em] font-bold shadow-[0_0_20px_rgba(163,13,37,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>
                {isAr
                  ? `حجز موعد مع ${employee.nameAr}`
                  : `Book Meeting With ${employee.name.split(' ')[1] || employee.name}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
