import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Send,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { companySettings, addAuditLog, language } = useApp();
  const isAr = language === 'ar';

  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: isAr ? 'الاستفسارات العامة' : 'General Inquiries',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.fullName || !formState.email || !formState.message) return;

    addAuditLog(
      'CONTACT_INQUIRY',
      formState.fullName,
      `Submitted inquiry for ${formState.department}: "${formState.message.slice(0, 50)}..."`
    );

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({
        fullName: '',
        email: '',
        phone: '',
        department: isAr ? 'الاستفسارات العامة' : 'General Inquiries',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="relative py-24 bg-[#080808] border-t border-white/5 overflow-hidden">
      {/* Background crimson ambient light */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#A30D25]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A30D25]/10 border border-[#A30D25]/30 text-[#ff4c68] text-xs font-semibold uppercase tracking-widest">
            <Building className="w-3.5 h-3.5" />
            <span>{isAr ? 'المقر الرئيسي بالرياض' : 'Executive Headquarters'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-serif-luxury uppercase tracking-tight">
            {isAr ? 'التواصل والمقر التنفيذي' : 'CONTACT & HEADQUARTERS'}
          </h2>
          <p className="text-[#A30D25] text-sm font-semibold tracking-widest uppercase font-serif-luxury">
            {isAr ? 'قنوات الاتصال المؤسسي والشراكات' : 'Corporate Communications & Governance'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Corporate Information Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A30D25]/15 border border-[#A30D25]/30 flex items-center justify-center text-[#ff4c68] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {isAr ? 'العنوان التنفيذي' : 'Executive Address'}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {isAr ? 'برج الأعمال، طريق الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية' : companySettings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A30D25]/15 border border-[#A30D25]/30 flex items-center justify-center text-[#ff4c68] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {isAr ? 'سنترال الإدارة العامة' : 'Executive Switchboard'}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 font-mono" dir="ltr">
                    {companySettings.phone}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? 'الأحد - الخميس: 08:30 ص إلى 05:00 م (بتوقيت مكة)' : 'Sun - Thu: 08:30 - 17:00 (AST)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A30D25]/15 border border-[#A30D25]/30 flex items-center justify-center text-[#ff4c68] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {isAr ? 'المراسلات الرسمية' : 'Official Inquiries'}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 font-mono" dir="ltr">
                    {companySettings.email}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? 'الرد التنفيذي خلال ٢٤ ساعة عمل' : 'Direct response within 24 business hours'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-neutral-900">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {isAr ? 'السجل التجاري' : 'Commercial Registration (CR)'}
                  </h4>
                  <p className="text-xs text-[#ff4c68] font-mono mt-0.5" dir="ltr">
                    CR #{companySettings.crNumber}
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    {isAr ? 'الغرفة التجارية بالرياض • ترخيص هيئة الغذاء والدواء' : 'Riyadh Chamber of Commerce & SFDA Licensed'}
                  </p>
                </div>
              </div>
            </div>

            {/* Riyadh HQ Badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#170508] to-neutral-950 border border-[#A30D25]/30 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-neutral-300 font-medium">
                {isAr
                  ? 'قاعات الاجتماعات التنفيذية وأنظمة الاتصال المرئي جاهزة بالمقر'
                  : 'HQ Boardroom & Telepresence Suites Active in Riyadh'}
              </p>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className={`p-8 sm:p-10 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl ${isAr ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide mb-2">
                {isAr ? 'إرسال استفسار أو مراسلة تنفيذية' : 'Send Corporate Inquiry'}
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                {isAr
                  ? 'للاتصالات المؤسسية المباشرة، وتسجيل الموردين، والمقترحات الاستثمارية.'
                  : 'For non-scheduled communications, vendor registrations, or media inquiries.'}
              </p>

              {submitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    {isAr ? 'تم استلام مراسلتكم بنجاح' : 'Inquiry Received'}
                  </h4>
                  <p className="text-xs text-neutral-300 max-w-sm">
                    {isAr
                      ? 'شكراً لتواصلكم. تم تسجيل الرسالة في جدول المتابعة التنفيذية وسيتم الرد من قِبل المكتب المختص في أقرب وقت.'
                      : 'Thank you. Your message has been logged in the executive communication queue. A representative will contact you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                        {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.fullName}
                        onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                        placeholder={isAr ? 'د. محمد الكندي' : 'e.g. Dr. Mohammed Al-Kindi'}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                        {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="m.kindi@enterprise.sa"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                        {isAr ? 'رقم الجوال' : 'Mobile Number'}
                      </label>
                      <input
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="+966 5X XXX XXXX"
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                        {isAr ? 'القطاع المستهدف' : 'Target Department'}
                      </label>
                      <select
                        value={formState.department}
                        onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25]"
                      >
                        <option value={isAr ? 'الاستفسارات العامة' : 'General Inquiries'}>
                          {isAr ? 'الاستفسارات التنفيذية العامة' : 'General Executive Inquiries'}
                        </option>
                        <option value={isAr ? 'مكتب الرئيس التنفيذي' : 'Executive Office'}>
                          {isAr ? 'مكتب الرئيس التنفيذي' : 'Office of the CEO'}
                        </option>
                        <option value={isAr ? 'المالية والاستثمار' : 'Finance & Investment'}>
                          {isAr ? 'المالية والاستثمار' : 'Finance & Investment'}
                        </option>
                        <option value={isAr ? 'الجودة والشؤون الصيدلانية' : 'Medical Affairs'}>
                          {isAr ? 'الجودة والشؤون الصيدلانية (SFDA)' : 'Medical & SFDA Affairs'}
                        </option>
                        <option value={isAr ? 'سلاسل الإمداد والمشتريات' : 'Supply Chain'}>
                          {isAr ? 'سلاسل الإمداد والمستودعات' : 'Procurement & Warehouses'}
                        </option>
                        <option value={isAr ? 'الصحة الرقمية وتقنية المعلومات' : 'Digital Health'}>
                          {isAr ? 'تقنية المعلومات والصحة الرقمية' : 'IT & Health Informatics'}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
                      {isAr ? 'نص الرسالة أو الاستفسار *' : 'Inquiry Message *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={
                        isAr
                          ? 'يرجى توضيح طبيعة الاستفسار أو المقترح الاستثماري أو مجالات التعاون المشترك...'
                          : 'Please specify the nature of your inquiry, commercial proposal, or strategic topic...'
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#A30D25] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#A30D25] to-[#78081a] hover:from-[#b80f2b] hover:to-[#8c0a20] text-white text-xs uppercase tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(163,13,37,0.3)] transition-all flex items-center justify-center gap-2 border border-[#A30D25]/50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال المراسلة التنفيذية' : 'Transmit Executive Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
