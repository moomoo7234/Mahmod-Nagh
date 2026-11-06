import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Calendar, ArrowRight, UserCheck, Shield, Clock } from 'lucide-react';

export const ManagementSection: React.FC = () => {
  const {
    employees,
    departments,
    startBookingWithManager,
    setSelectedProfileEmployee,
    language,
  } = useApp();

  const isAr = language === 'ar';

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId);
    if (!dept) return isAr ? 'الإدارة العامة' : 'Management';
    return isAr ? dept.nameAr : dept.nameEn;
  };

  return (
    <section id="management" className="relative py-24 bg-[#080808] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#A30D25]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A30D25]/10 border border-[#A30D25]/30 text-[#ff4c68] text-xs font-semibold uppercase tracking-widest mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>{isAr ? 'المجلس التنفيذي والقيادات العليا' : 'Executive Board & Officers'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
              {isAr ? 'فريق الإدارة العليا' : 'MANAGEMENT TEAM'}
            </h2>
            <p className="text-[#A30D25] text-sm font-semibold tracking-widest uppercase font-serif-luxury mt-1">
              {isAr ? 'نخبة القيادات الصيدلانية والتنفيذية' : 'Executive Leadership & Direction'}
            </p>
          </div>
          <p className="text-neutral-400 text-sm max-w-md">
            {isAr
              ? 'تواصل مباشر مع الإدارة التنفيذية للشراكات الاستراتيجية، ومفاوضات التوريد، والامتثال الصيدلاني، ومشاريع التوسع في المملكة.'
              : 'Direct access to senior executive leadership for strategic partnerships, healthcare joint ventures, supplier relations, and corporate governance.'}
          </p>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {employees.map((member) => {
            const isCEO = member.id === 'emp-ceo';
            return (
              <div
                key={member.id}
                className={`group relative rounded-2xl bg-neutral-950 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isCEO
                    ? 'border-[#A30D25] shadow-[0_0_30px_rgba(163,13,37,0.3)]'
                    : 'border-neutral-800/80 hover:border-[#A30D25]/60 hover:shadow-[0_0_25px_rgba(163,13,37,0.2)]'
                }`}
              >
                {/* Portrait Header */}
                <div
                  onClick={() => setSelectedProfileEmployee(member)}
                  className="relative aspect-[4/5] overflow-hidden bg-neutral-900 cursor-pointer"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />

                  {/* Status Badge */}
                  <div
                    className={`absolute top-3 ${
                      isAr ? 'right-3' : 'left-3'
                    } flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-neutral-300 font-medium`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isAr ? 'متاح للمواعيد' : 'Accepting Appointments'}</span>
                  </div>

                  {isCEO && (
                    <div
                      className={`absolute top-3 ${
                        isAr ? 'left-3' : 'right-3'
                      } px-2 py-0.5 rounded bg-[#A30D25] text-[9px] uppercase tracking-widest font-bold text-white shadow-md`}
                    >
                      {isAr ? 'الرئيس التنفيذي' : 'Chief Executive'}
                    </div>
                  )}

                  {/* Name and Title in Card Bottom */}
                  <div className={`absolute bottom-3 inset-x-3 ${isAr ? 'text-right' : 'text-left'}`}>
                    <p className="text-[11px] text-[#A30D25] font-semibold tracking-wider uppercase font-serif-luxury">
                      {isAr ? member.name : member.nameAr}
                    </p>
                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-white transition-colors">
                      {isAr ? member.nameAr : member.name}
                    </h3>
                    <p className="text-xs text-neutral-300 font-medium line-clamp-1 mt-0.5">
                      {member.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">
                      {getDepartmentName(member.departmentId)}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A30D25]" />
                      {isAr
                        ? `الأحد - الخميس (${member.workingHours.start} - ${member.workingHours.end})`
                        : `Sun-Thu (${member.workingHours.start}-${member.workingHours.end})`}
                    </span>
                    <span>{member.workingHours.slotDurationMinutes} {isAr ? 'دقيقة' : 'min'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startBookingWithManager(member)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#A30D25] hover:bg-[#c40f2f] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isAr ? 'حجز موعد' : 'Book Meeting'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedProfileEmployee(member)}
                      className="py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 transition-colors"
                      title={isAr ? 'عرض الملف' : 'View Profile'}
                    >
                      {isAr ? 'الملف' : 'Profile'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
