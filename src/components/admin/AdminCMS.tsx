import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CompanySettings } from '../../types/index.ts';
import {
  FileEdit,
  Save,
  Check,
  Image as ImageIcon,
  Building,
  User,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const { companySettings, updateCompanySettings, hasUserPermission, language } = useApp();
  const isAr = language === 'ar';

  const [formState, setFormState] = useState<CompanySettings>({ ...companySettings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const canManage = hasUserPermission('manage_system_settings');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(formState);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const executivePhotoPresets = [
    {
      name: isAr ? 'بدلة داكنة رسمية' : 'Executive Dark Suit',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
    },
    {
      name: isAr ? 'قيادة رعاية صحية' : 'Healthcare Executive',
      url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=1200&q=85',
    },
    {
      name: isAr ? 'شريك إداري وتنفيذي' : 'Managing Partner',
      url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85',
    },
  ];

  return (
    <div className={`space-y-6 animate-fadeIn max-w-4xl ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'إدارة محتوى الموقع والتصاميم (CMS)' : 'Website Content Management (CMS)'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'تعديل نصوص ورسائل البوابة التنفيذية، وبيانات الرئيس التنفيذي، والشعار، والمقر والاتصال.'
              : 'Edit live executive portal messaging, hero typography, CEO photography, and corporate credentials.'}
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleSave}
            className="py-2.5 px-5 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'نشر التحديثات فوراً' : 'Publish Changes to Live Site'}</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{isAr ? 'تم حفظ التعديلات ونشرها مباشرة على كافة صفحات المنصة!' : 'Website content updated and published live across all portal views!'}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Brand Identity & Headlines */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#A30D25]" />
            <span>{isAr ? 'العلامة التجارية وعناوين الواجهة' : 'Hero Branding & Headlines'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'اسم العلامة (بالعربية)' : 'Brand Name (Arabic)'}
              </label>
              <input
                type="text"
                value={formState.brandNameAr}
                onChange={(e) => setFormState({ ...formState, brandNameAr: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'اسم العلامة (بالإنجليزية)' : 'Brand Name (English)'}
              </label>
              <input
                type="text"
                value={formState.brandNameEn}
                onChange={(e) => setFormState({ ...formState, brandNameEn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'العنوان الرئيسي للواجهة' : 'Hero Main Headline'}
            </label>
            <input
              type="text"
              value={formState.heroHeadline}
              onChange={(e) => setFormState({ ...formState, heroHeadline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'المقدمة التنفيذية التوضيحية' : 'Hero Executive Introduction Sub-Headline'}
            </label>
            <textarea
              rows={2}
              value={formState.heroSubtitle}
              onChange={(e) => setFormState({ ...formState, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'شريط الإعلانات والأخبار العلوي' : 'Top Announcement Ticker Notice'}
            </label>
            <input
              type="text"
              value={formState.tickerText}
              onChange={(e) => setFormState({ ...formState, tickerText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>
        </div>

        {/* CEO / General Manager Profile Section */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-[#A30D25]" />
            <span>{isAr ? 'إعدادات وصورة الرئيس التنفيذي في الواجهة' : 'Chief Executive Centerpiece Configuration'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'اسم الرئيس التنفيذي / المدير العام' : 'CEO / General Manager Name'}
              </label>
              <input
                type="text"
                value={formState.ceoName}
                onChange={(e) => setFormState({ ...formState, ceoName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'المسمى الوظيفي التنفيذي الرسمي' : 'Official Executive Title'}
              </label>
              <input
                type="text"
                value={formState.ceoTitle}
                onChange={(e) => setFormState({ ...formState, ceoTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'النبذة والرؤية التنفيذية' : 'Executive Biography & Vision'}
            </label>
            <textarea
              rows={3}
              value={formState.ceoBio}
              onChange={(e) => setFormState({ ...formState, ceoBio: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'رابط صورة الرئيس التنفيذي (قابلة للاستبدال)' : 'CEO Portrait URL (Replaceable Asset)'}
            </label>
            <input
              type="text"
              value={formState.ceoPhoto}
              onChange={(e) => setFormState({ ...formState, ceoPhoto: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono text-[11px]"
              dir="ltr"
            />
            {/* Quick Presets */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-neutral-400">
                {isAr ? 'صور نموذجية جاهزة للاختيار:' : 'Curated Presets:'}
              </span>
              {executivePhotoPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => setFormState({ ...formState, ceoPhoto: preset.url })}
                  className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-[10px] text-neutral-300 border border-neutral-800"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Corporate Mission, Vision, and Credentials */}
        <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-[#A30D25]" />
            <span>{isAr ? 'نظرة عامة والرسالة والرؤية وبيانات الاتصال' : 'Corporate Overview & Contact Credentials'}</span>
          </h3>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'نبذة عن شركة صيدليات صحة القلب' : 'About HEART HEALTH Overview'}
            </label>
            <textarea
              rows={3}
              value={formState.aboutOverview}
              onChange={(e) => setFormState({ ...formState, aboutOverview: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'رسالة الشركة' : 'Corporate Mission'}
              </label>
              <textarea
                rows={3}
                value={formState.mission}
                onChange={(e) => setFormState({ ...formState, mission: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'رؤية الشركة' : 'Corporate Vision'}
              </label>
              <textarea
                rows={3}
                value={formState.vision}
                onChange={(e) => setFormState({ ...formState, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'هاتف السنترال' : 'Switchboard Phone'}
              </label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'البريد الرسمي' : 'Official Email'}
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold mb-1">
                {isAr ? 'رقم السجل التجاري' : 'CR Registration #'}
              </label>
              <input
                type="text"
                value={formState.crNumber}
                onChange={(e) => setFormState({ ...formState, crNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isAr ? 'العنوان الفعلي للمقر الرئيسي' : 'Executive HQ Physical Address'}
            </label>
            <input
              type="text"
              value={formState.address}
              onChange={(e) => setFormState({ ...formState, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
            />
          </div>
        </div>

        {canManage && (
          <div className={`flex ${isAr ? 'justify-start' : 'justify-end'} pt-2`}>
            <button
              type="submit"
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#A30D25] to-[#78081a] hover:from-[#b80f2b] hover:to-[#8c0a20] text-white text-xs uppercase tracking-widest font-bold shadow-lg"
            >
              {isAr ? 'نشر التعديلات على الموقع' : 'Publish Website Updates'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
