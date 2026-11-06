import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ShieldCheck, Target, Eye, Award, Sparkles, Activity } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { companySettings, language } = useApp();
  const isAr = language === 'ar';

  return (
    <section id="about" className="relative py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      {/* Subtle crimson glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#A30D25]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A30D25]/10 border border-[#A30D25]/30 text-[#ff4c68] text-xs font-semibold uppercase tracking-widest">
            <Activity className="w-3.5 h-3.5" />
            <span>{isAr ? 'الإرث والتاريخ المؤسسي' : 'Corporate Heritage'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
            {isAr ? 'عن صيدليات صحة القلب' : 'ABOUT HEART HEALTH'}
          </h2>
          <p className="text-[#A30D25] text-sm font-semibold tracking-widest uppercase font-serif-luxury">
            {isAr ? companySettings.brandNameAr : 'HEART HEALTH PHARMACIES CO.'}
          </p>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed pt-2">
            {isAr
              ? 'تأسست شركة صيدليات صحة القلب لتكون ركيزة وطنية رائدة في الرعاية الصيدلانية التخصصية، ومزوداً موثوقاً للعلاجات القلبية والحرجة والمزمنة وفق أعلى اشتراطات هيئة الغذاء والدواء السعودية (SFDA) ومستهدفات برنامج تحول القطاع الصحي لرؤية السعودية 2030.'
              : companySettings.aboutOverview}
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission */}
          <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 relative overflow-hidden group hover:border-[#A30D25]/50 transition-all text-right">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A30D25]/10 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="w-12 h-12 rounded-xl bg-[#A30D25]/20 border border-[#A30D25]/40 flex items-center justify-center text-[#ff4c68] mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide mb-3">
              {isAr ? 'رسالتنا المؤسسية' : 'Our Mission'}
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {isAr
                ? 'تقديم خدمات صيدلانية متقدمة واستشارات دوائية إكلينيكية ترتكز على سلامة المريض، مع ضمان توافر المستحضرات النادرة والمستلزمات الطبية عبر سلسلة توريد مبردة ومعتمدة، وبناء شراكات وثيقة مع الممارسين الصحيين والمستشفيات.'
                : companySettings.mission}
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 relative overflow-hidden group hover:border-[#A30D25]/50 transition-all text-right">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A30D25]/10 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform" />
            <div className="w-12 h-12 rounded-xl bg-[#A30D25]/20 border border-[#A30D25]/40 flex items-center justify-center text-[#ff4c68] mb-6">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide mb-3">
              {isAr ? 'رؤيتنا المستقبلية' : 'Our Vision'}
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed">
              {isAr
                ? 'أن نكون الخيار الأول والوجهة المرجعية الأكثر موثوقية في مجال الصيدلة التخصصية وصحة القلب والأوعية الدموية في المملكة ومنطقة الخليج، والنموذج القيادي للتحول الرقمي الصيدلاني والحوكمة المؤسسية.'
                : companySettings.vision}
            </p>
          </div>
        </div>

        {/* Corporate Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-6 rounded-xl bg-neutral-950 border border-neutral-800 ${isAr ? 'text-right' : 'text-left'}`}>
            <ShieldCheck className="w-8 h-8 text-[#A30D25] mb-4" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-2">
              {isAr ? 'اعتماد هيئة الغذاء والدواء' : 'SFDA Certified'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr
                ? 'التزام مطلق بمعايير الهيئة العامة للغذاء والدواء وتطبيق التتبع الإلكتروني لبرنامج وصفتي ورصد.'
                : 'Uncompromising adherence to Saudi Food & Drug Authority standards and Wasfy serialization protocols.'}
            </p>
          </div>

          <div className={`p-6 rounded-xl bg-neutral-950 border border-neutral-800 ${isAr ? 'text-right' : 'text-left'}`}>
            <Award className="w-8 h-8 text-[#A30D25] mb-4" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-2">
              {isAr ? 'سلسلة التبريد الذكية' : 'Cold-Chain Integrity'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr
                ? 'مراقبة فورية وإنترنت الأشياء لدرجات الحرارة في المستودعات المركزية وأسطول النقل المبرد الإقليمي.'
                : 'Real-time IoT temperature monitoring across warehouse logistics hubs and regional fleet delivery vehicles.'}
            </p>
          </div>

          <div className={`p-6 rounded-xl bg-neutral-950 border border-neutral-800 ${isAr ? 'text-right' : 'text-left'}`}>
            <Sparkles className="w-8 h-8 text-[#A30D25] mb-4" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-2">
              {isAr ? 'الحوكمة التنفيذية' : 'Executive Governance'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr
                ? 'إشراف استراتيجي تحت قيادة مجلس الإدارة مع امتثال عملياتي دقيق ونزاهة مالية وشفافية تعاقدية.'
                : 'Board-led strategic stewardship with granular operational compliance, transparency, and fiscal integrity.'}
            </p>
          </div>

          <div className={`p-6 rounded-xl bg-neutral-950 border border-neutral-800 ${isAr ? 'text-right' : 'text-left'}`}>
            <Activity className="w-8 h-8 text-[#A30D25] mb-4" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider mb-2">
              {isAr ? 'رؤية السعودية 2030' : 'Vision 2030 Healthcare'}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isAr
                ? 'مساهمة فاعلة في برنامج التحول الصحي الوطني وتوطين الكفاءات الصيدلانية ودعم الاقتصاد المعرفي.'
                : "Proud contributor to the Kingdom's national healthcare transformation, empowering Saudi pharmacists."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
