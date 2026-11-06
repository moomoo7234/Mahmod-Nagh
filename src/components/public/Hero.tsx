import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HeartPulse, ArrowUpRight, ArrowUpLeft, Calendar, Sparkles, Building, ChevronDown, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const {
    companySettings,
    employees,
    startBookingWithManager,
    setActiveView,
    setSelectedProfileEmployee,
    language,
  } = useApp();

  const ceo = employees.find((e) => e.id === 'emp-ceo') || employees[0];
  const teamMembers = employees.filter((e) => e.id !== 'emp-ceo' && e.isExecutive).slice(0, 4);

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#080808] pt-8 pb-16">
      {/* Background Cinematic Lighting & Radial Crimson Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-[#A30D25]/25 via-[#5C0615]/20 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A30D25]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#40050e]/20 blur-[130px] pointer-events-none" />

      {/* Huge Background Typography (HEART HEALTH) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.06] transform -translate-y-12">
        <span className="text-[17vw] font-black tracking-tighter text-white font-serif-luxury uppercase whitespace-nowrap">
          {language === 'ar' ? 'صحة القلب' : 'HEART HEALTH'}
        </span>
      </div>

      {/* Top Banner Notice / Ticker */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8">
        <div className="flex items-center justify-between border-y border-white/10 py-2.5 overflow-hidden">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A30D25] font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{language === 'ar' ? 'البوابة التنفيذية للمملكة' : 'Kingdom Executive Portal'}</span>
          </div>
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium truncate max-w-2xl">
            {language === 'ar'
              ? 'شبكة صيدليات متميزة تغطي المملكة • المقر التنفيذي بالرياض • شريك التحول الصحي لرؤية السعودية 2030'
              : companySettings.tickerText}
          </div>
        </div>
      </div>

      {/* Main Editorial Hero Composition */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Column: Executive Introduction */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#A30D25]/15 border border-[#A30D25]/40 text-[#ff4c68] text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4c68] animate-ping" />
              <span>{language === 'ar' ? 'منصة حجز الاجتماعات التنفيذية' : 'Executive Meeting Booking Platform'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-serif-luxury leading-[1.12]">
              {language === 'ar' ? (
                <>
                  ريادة مستقبل <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#A30D25]">
                    الرعاية الصيدلانية
                  </span> <br />
                  والتميز الصحي
                </>
              ) : (
                <>
                  ARCHITECTING <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#A30D25]">
                    PHARMACEUTICAL
                  </span> <br />
                  EXCELLENCE
                </>
              )}
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light max-w-lg">
              {language === 'ar'
                ? 'الجسر الاستراتيجي بين الرعاية الإكلينيكية المتقدمة، وسلاسل الإمداد فائقة الدقة، والقيادة الصيدلانية في المملكة العربية السعودية.'
                : companySettings.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setActiveView('booking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#A30D25] to-[#750718] text-white text-xs uppercase tracking-[0.14em] font-bold shadow-[0_0_30px_rgba(163,13,37,0.4)] hover:shadow-[0_0_40px_rgba(163,13,37,0.7)] transition-all transform hover:-translate-y-0.5 border border-[#ff4d6a]/40"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>{language === 'ar' ? 'حجز موعد مع القيادة' : 'Book Executive Meeting'}</span>
                {language === 'ar' ? (
                  <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                )}
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('management');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs tracking-wider font-semibold border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <span>{language === 'ar' ? 'التعرف على الإدارة' : 'Meet Leadership'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-900">
              <div>
                <p className="text-2xl font-black text-white font-serif-luxury tracking-tight font-mono">120+</p>
                <p className="text-[11px] text-neutral-400 tracking-wider">
                  {language === 'ar' ? 'صيدلية معتمدة' : 'Pharmacies'}
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-white font-serif-luxury tracking-tight font-mono">8</p>
                <p className="text-[11px] text-neutral-400 tracking-wider">
                  {language === 'ar' ? 'قطاعات تنفيذية' : 'Executive Depts'}
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#A30D25] font-serif-luxury tracking-tight font-mono">100%</p>
                <p className="text-[11px] text-neutral-400 tracking-wider">
                  {language === 'ar' ? 'مطابق لـ SFDA' : 'SFDA Certified'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hero Composition with CEO & Surrounding Team */}
          <div className="lg:col-span-7 relative flex items-center justify-center pt-8 lg:pt-0">
            {/* Subtle red spotlight behind center */}
            <div className="absolute w-72 h-72 rounded-full bg-[#A30D25]/30 blur-3xl" />

            <div className="relative w-full max-w-[540px] aspect-[4/5] flex items-center justify-center">
              {/* Surrounding Management Team Portraits (Behind and around CEO) */}
              {teamMembers.map((member, idx) => {
                const positions = [
                  'top-2 left-0 -rotate-3',
                  'top-4 right-0 rotate-3',
                  'bottom-6 left-2 rotate-2',
                  'bottom-8 right-2 -rotate-2',
                ];
                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedProfileEmployee(member)}
                    className={`absolute z-10 w-28 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl transition-all duration-300 hover:scale-110 hover:z-30 hover:border-[#A30D25] cursor-pointer group ${positions[idx]}`}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute bottom-2 inset-x-2 text-left">
                      <p className="text-[10px] font-bold text-white truncate">
                        {language === 'ar' ? member.nameAr : member.name}
                      </p>
                      <p className="text-[8px] text-[#A30D25] truncate">{member.title}</p>
                    </div>
                  </div>
                );
              })}

              {/* CEO Centerpiece Portrait */}
              <div
                className="relative z-20 w-64 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#A30D25]/80 bg-[#0d0d0d] shadow-[0_0_50px_rgba(163,13,37,0.5)] group cursor-pointer transition-all duration-300"
                onClick={() => setSelectedProfileEmployee(ceo)}
              >
                <img
                  src={ceo?.avatar || companySettings.ceoPhoto}
                  alt={ceo?.name || companySettings.ceoName}
                  className="w-full h-full object-cover object-top contrast-110 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30 opacity-90" />
                <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />

                {/* CEO Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#A30D25]/50">
                  <div className="w-2 h-2 rounded-full bg-[#A30D25] animate-pulse" />
                  <span className="text-[10px] tracking-widest font-bold text-white">
                    {language === 'ar' ? 'المدير العام' : 'General Manager'}
                  </span>
                </div>

                {/* CEO Details Bottom Overlay */}
                <div className="absolute bottom-4 inset-x-4 text-left z-10">
                  <span className="text-xs font-semibold text-[#ff4d6a] tracking-wider uppercase font-serif-luxury">
                    {language === 'ar' ? 'الرئيس التنفيذي والعضو المنتدب' : 'Chief Executive Officer'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-serif-luxury tracking-wide">
                    {language === 'ar' ? ceo?.nameAr : ceo?.name}
                  </h3>
                  <p className="text-[11px] text-neutral-300 line-clamp-1 mt-0.5">
                    {language === 'ar' ? 'قيادة التوسع الصيدلاني والتحول الرقمي الصحي' : (ceo?.title || companySettings.ceoTitle)}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ceo) startBookingWithManager(ceo);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#A30D25] hover:bg-[#c20f2e] text-white text-[10px] font-bold tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{language === 'ar' ? 'حجز موعد' : 'Book Meeting'}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfileEmployee(ceo);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold transition-colors"
                    >
                      {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
