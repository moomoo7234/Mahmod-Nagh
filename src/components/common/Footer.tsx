import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HeartPulse, Shield, ExternalLink, ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { companySettings, setActiveView, language } = useApp();
  const isAr = language === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-neutral-900 overflow-hidden text-neutral-400" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Background Watermark */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
        <span className="text-[18vw] font-black tracking-tighter text-white font-serif-luxury uppercase whitespace-nowrap">
          {isAr ? 'صحة القلب' : 'HEART HEALTH'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className={`lg:col-span-2 space-y-4 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A30D25] to-[#40050e] flex items-center justify-center border border-[#A30D25]/40 shadow-[0_0_15px_rgba(163,13,37,0.4)]">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-base font-extrabold tracking-[0.16em] text-white font-serif-luxury uppercase">
                  {isAr ? companySettings.brandNameAr : companySettings.brandNameEn}
                </span>
                <span className="block text-[11px] tracking-wider text-[#A30D25] font-semibold font-serif-luxury">
                  {isAr ? 'شبكة صيدليات متميزة تغطي المملكة' : companySettings.brandNameAr}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {isAr
                ? 'شبكة صيدليات رائدة في المملكة العربية السعودية، ملتزمة بتقديم الرعاية الصيدلانية التخصصية والتفوق الإكلينيكي تحت مظلة رؤية السعودية 2030.'
                : 'Kingdom-wide retail pharmacy network and pharmaceutical distribution leader, dedicated to community wellness and clinical excellence under Saudi Vision 2030.'}
            </p>
            <div className="pt-2 text-xs text-neutral-400">
              {isAr ? 'السجل التجاري (CR): ' : 'Commercial Registration (CR): '}
              <span className="text-[#ff4c68] font-mono font-bold">1010398241</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`space-y-3 ${isAr ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury">
              {isAr ? 'روابط الشركة' : 'Company'}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveView('public');
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {isAr ? 'عن الشركة' : 'About Organization'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('public');
                    const el = document.getElementById('management');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {isAr ? 'القيادة التنفيذية' : 'Executive Leadership'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('public');
                    const el = document.getElementById('departments');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {isAr ? 'القطاعات المتخصصة' : 'Corporate Sectors'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('public');
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  {isAr ? 'المقر والتواصل' : 'Headquarters & Inquiries'}
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Compliance */}
          <div className={`space-y-3 ${isAr ? 'text-right' : 'text-left'}`}>
            <p className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury">
              {isAr ? 'الحوكمة والتراخيص' : 'Governance'}
            </p>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>{isAr ? 'هيئة الغذاء والدواء (SFDA) ونظام رصد ووصفتي' : 'Saudi Food & Drug Authority (SFDA) Wasfy Track & Trace'}</li>
              <li>{isAr ? 'ترخيص وزارة الصحة رقم 4482-990' : 'Ministry of Health Licensing No. 4482-990'}</li>
              <li>{isAr ? 'شهادة سلسلة التبريد الدوائي المعتمدة' : 'Cold-Chain Pharmaceutical Certification'}</li>
              <li>{isAr ? 'اليقظة الدوائية والجودة الإكلينيكية' : 'Corporate Quality & Pharmacovigilance'}</li>
            </ul>
          </div>

          {/* Portal Access & Scroll Top */}
          <div className="space-y-4">
            <p className={`text-xs font-bold text-white uppercase tracking-widest font-serif-luxury ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'الوصول السريع' : 'Executive Access'}
            </p>
            <button
              onClick={() => {
                setActiveView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#A30D25]" />
              <span>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="w-full py-2 px-3 rounded-lg bg-black hover:bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{isAr ? 'الرجوع للأعلى' : 'Back to Top'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} {isAr ? 'شركة صيدليات صحة القلب – جميع الحقوق محفوظة.' : 'HEART HEALTH. All Rights Reserved.'}</p>
          <p className="flex items-center gap-3">
            <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}</span>
            <span>•</span>
            <span className="text-[#A30D25]">{isAr ? 'الخصوصية والامتثال المؤسسي' : 'Privacy & Corporate Compliance'}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
