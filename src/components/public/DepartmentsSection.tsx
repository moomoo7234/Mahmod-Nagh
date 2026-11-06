import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Building2,
  Calendar,
  Crown,
  TrendingUp,
  Stethoscope,
  Truck,
  Users,
  Megaphone,
  Cpu,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const DepartmentsSection: React.FC = () => {
  const { departments, employees, startBookingWithDepartment, language } = useApp();
  const isAr = language === 'ar';

  // Helper to render appropriate Lucide icon by name
  const renderDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6" />;
      case 'Truck':
        return <Truck className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  const activeDepartments = departments.filter((d) => d.active);

  return (
    <section id="departments" className="relative py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#A30D25]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A30D25]/10 border border-[#A30D25]/30 text-[#ff4c68] text-xs font-semibold uppercase tracking-widest mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'الهيكل المؤسسي للشركة' : 'Corporate Structure'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
              {isAr ? 'القطاعات والإدارات المتخصصة' : 'CORPORATE DEPARTMENTS'}
            </h2>
            <p className="text-[#A30D25] text-sm font-semibold tracking-widest uppercase font-serif-luxury mt-1">
              {isAr ? 'منظومة صيدلانية متكاملة وحوكمة رفيعة' : 'Specialized Executive Sectors'}
            </p>
          </div>
          <p className="text-neutral-400 text-sm max-w-md">
            {isAr
              ? 'حوكمة هيكلية تضمن تنسيقاً سريعاً بين الجودة الإكلينيكية، والهيكلة المالية، واللوجستيات المبردة، والصحة الرقمية.'
              : 'Structured governance ensuring rapid cross-departmental coordination across clinical compliance, financial structuring, cold-chain logistics, and digital health.'}
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeDepartments.map((dept) => {
            const headManager = employees.find((e) => e.id === dept.headManagerId);
            return (
              <div
                key={dept.id}
                className="group relative rounded-2xl bg-neutral-950 border border-neutral-800/80 hover:border-[#A30D25]/60 hover:shadow-[0_0_30px_rgba(163,13,37,0.25)] p-6 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#A30D25]/15 border border-[#A30D25]/30 flex items-center justify-center text-[#ff4c68] group-hover:scale-110 group-hover:bg-[#A30D25] group-hover:text-white transition-all">
                      {renderDeptIcon(dept.iconName)}
                    </div>
                    <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                      {dept.code}
                    </span>
                  </div>

                  <p className="text-xs text-[#A30D25] font-semibold tracking-wider uppercase font-serif-luxury">
                    {isAr ? dept.nameEn : dept.nameAr}
                  </p>
                  <h3 className="text-lg font-bold text-white tracking-wide mt-1 mb-2">
                    {isAr ? dept.nameAr : dept.nameEn}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-900 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>{isAr ? 'المسؤول التنفيذي:' : 'Leadership:'}</span>
                    <span className="text-white font-medium truncate max-w-[140px]">
                      {headManager ? (isAr ? headManager.nameAr : headManager.name) : (isAr ? 'مسؤول مكلف' : 'Assigned Lead')}
                    </span>
                  </div>

                  <button
                    onClick={() => startBookingWithDepartment(dept.id)}
                    className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-[#A30D25] text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 group-hover:bg-[#A30D25] group-hover:text-white"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حجز موعد بالقطاع' : 'Book Department'}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
