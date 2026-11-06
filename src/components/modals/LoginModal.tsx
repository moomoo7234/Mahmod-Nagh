import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { DEFAULT_MASTER_PASSWORD } from '../../utils/auth.ts';
import {
  HeartPulse,
  Lock,
  Mail,
  Eye,
  EyeOff,
  X,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    login,
    employees,
    roles,
    companySettings,
    language,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ en: string; ar: string } | null>(null);
  const [showForgotTip, setShowForgotTip] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLoginModalOpen) {
        closeLoginModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoginModalOpen, closeLoginModal]);

  // Reset form when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setErrorMessage(null);
      setIsSubmitting(false);
      setShowForgotTip(false);
    }
  }, [isLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage({
        en: 'Please enter your corporate email address.',
        ar: 'يرجى إدخال البريد الإلكتروني الوظيفي.',
      });
      return;
    }

    if (!password) {
      setErrorMessage({
        en: 'Please enter your corporate password.',
        ar: 'يرجى إدخال كلمة المرور الوظيفية.',
      });
      return;
    }

    setIsSubmitting(true);

    // Subtle realistic authentication latency
    setTimeout(() => {
      const result = login({ email, password });
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMessage({
          en: result.error || 'Authentication failed. Please verify your corporate credentials.',
          ar: result.errorAr || 'فشل تسجيل الدخول. يرجى التأكد من صحة بيانات الدخول الوظيفية.',
        });
      }
    }, 400);
  };

  // Demo accounts for instant one-click testing
  const demoAccounts = [
    {
      emp: employees.find((e) => e.roleId === 'super-admin') || employees[0],
      roleLabelEn: 'Super Admin',
      roleLabelAr: 'المدير العام (صلاحيات كاملة)',
    },
    {
      emp: employees.find((e) => e.roleId === 'exec-manager') || employees[1],
      roleLabelEn: 'Executive Manager',
      roleLabelAr: 'إدارة تنفيذية',
    },
    {
      emp: employees.find((e) => e.roleId === 'dept-manager') || employees[2],
      roleLabelEn: 'Department Head',
      roleLabelAr: 'مدير قطاع',
    },
  ].filter((item) => item.emp !== undefined);

  const fillDemoAccount = (empEmail: string) => {
    setEmail(empEmail);
    setPassword(DEFAULT_MASTER_PASSWORD);
    setErrorMessage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Backdrop overlay dismiss */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={closeLoginModal}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        className="relative w-full max-w-lg bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(163,13,37,0.35)] overflow-hidden z-10 transition-all text-left"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Top Crimson Glow Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#40050e] via-[#A30D25] to-[#ff4c68]" />

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-neutral-800/80 relative">
          <button
            onClick={closeLoginModal}
            className={`absolute top-6 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors ${
              language === 'ar' ? 'left-6' : 'right-6'
            }`}
            aria-label={language === 'ar' ? 'إغلاق نافذة تسجيل الدخول' : 'Close Login Modal'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#A30D25] to-[#40050e] flex items-center justify-center border border-[#A30D25]/50 shadow-[0_0_25px_rgba(163,13,37,0.5)]">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#ff4c68]">
                  {language === 'ar' ? 'بوابة الدخول التنفيذي' : 'EXECUTIVE PORTAL ACCESS'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Shield className="w-2.5 h-2.5" />
                  SSL 256-BIT
                </span>
              </div>
              <h2
                id="login-modal-title"
                className="text-xl sm:text-2xl font-extrabold text-white tracking-wide font-serif-luxury mt-0.5"
              >
                {language === 'ar' ? companySettings.brandNameAr : companySettings.brandNameEn}
              </h2>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
            {language === 'ar'
              ? 'يرجى تسجيل الدخول باستخدام حسابك الوظيفي المعتمد لدى صيدليات صحة القلب للوصول إلى لوحة الإدارة وجداول المواعيد.'
              : 'Sign in with your verified HEART HEALTH corporate credentials to access the executive dashboard and booking management.'}
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#A30D25]/15 border border-[#A30D25]/50 text-neutral-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#ff4c68] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-white">
                  {language === 'ar' ? errorMessage.ar : errorMessage.en}
                </p>
              </div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300"
            >
              {language === 'ar' ? 'البريد الإلكتروني المؤسسي' : 'Corporate Email Address'}
            </label>
            <div className="relative">
              <div
                className={`absolute inset-y-0 flex items-center pointer-events-none text-neutral-500 ${
                  language === 'ar' ? 'right-3.5' : 'left-3.5'
                }`}
              >
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'sultan.alghamdi@hearthealth.sa'
                    : 'name@hearthealth.sa'
                }
                required
                className={`w-full py-3 bg-neutral-900/90 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A30D25] focus:ring-1 focus:ring-[#A30D25] transition-all ${
                  language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-300"
              >
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => setShowForgotTip(!showForgotTip)}
                className="text-xs text-neutral-400 hover:text-[#ff4c68] transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>{language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</span>
              </button>
            </div>

            <div className="relative">
              <div
                className={`absolute inset-y-0 flex items-center pointer-events-none text-neutral-500 ${
                  language === 'ar' ? 'right-3.5' : 'left-3.5'
                }`}
              >
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={`w-full py-3 bg-neutral-900/90 border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#A30D25] focus:ring-1 focus:ring-[#A30D25] transition-all ${
                  language === 'ar' ? 'pr-10 pl-11' : 'pl-10 pr-11'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 flex items-center text-neutral-400 hover:text-white transition-colors ${
                  language === 'ar' ? 'left-3.5' : 'right-3.5'
                }`}
                aria-label={
                  showPassword
                    ? language === 'ar'
                      ? 'إخفاء كلمة المرور'
                      : 'Hide password'
                    : language === 'ar'
                    ? 'إظهار كلمة المرور'
                    : 'Show password'
                }
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot password tip drawer */}
            {showForgotTip && (
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed mt-2 animate-fadeIn">
                <p className="font-semibold text-white mb-0.5">
                  {language === 'ar' ? 'إعادة تعيين كلمة المرور:' : 'Password Reset Protocol:'}
                </p>
                <p>
                  {language === 'ar'
                    ? `لأسباب أمنية، يرجى التواصل مع مسؤول النظام أو إدارة تقنية المعلومات في المقر الرئيسي بالرياض (${companySettings.phone}) أو تجربة كلمة المرور الافتراضية التجريبية:`
                    : `For security compliance, please contact IT Support at Riyadh HQ (${companySettings.phone}) or test with the master demo password:`}{' '}
                  <code className="text-[#ff4c68] font-mono font-bold bg-neutral-950 px-1.5 py-0.5 rounded">
                    {DEFAULT_MASTER_PASSWORD}
                  </code>
                </p>
              </div>
            )}
          </div>

          {/* Remember me & Security reassurance */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-[#A30D25] focus:ring-0 focus:ring-offset-0 accent-[#A30D25]"
              />
              <span>{language === 'ar' ? 'تذكر هذا الجهاز التنفيذي' : 'Remember this device'}</span>
            </label>
            <span className="text-[11px] text-neutral-400">
              {language === 'ar' ? 'جلسة مشفرة وآمنة' : 'Encrypted Session'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#A30D25] to-[#b80f2b] hover:from-[#b80f2b] hover:to-[#A30D25] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(163,13,37,0.4)] hover:shadow-[0_0_35px_rgba(163,13,37,0.6)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'ar' ? 'جاري التحقق من الهوية...' : 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الدخول إلى البوابة' : 'Sign In To Portal'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Footer */}
        <div className="p-5 sm:p-6 bg-neutral-950 border-t border-neutral-900 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#ff4c68]" />
              <span>{language === 'ar' ? 'حسابات تجريبية سريعة بنقرة واحدة:' : 'Quick Demo Profiles (1-Click Fill):'}</span>
            </p>
            <span className="text-[10px] text-neutral-400 font-mono">
              {DEFAULT_MASTER_PASSWORD}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {demoAccounts.map(({ emp, roleLabelEn, roleLabelAr }) => {
              if (!emp) return null;
              const isSelected = email === emp.email;
              return (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => fillDemoAccount(emp.email)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#A30D25]/15 border-[#A30D25] text-white'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0 border border-neutral-700"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {language === 'ar' ? emp.nameAr : emp.name}
                      </p>
                      <p className="text-[10px] text-[#ff4c68] font-medium truncate">
                        {language === 'ar' ? roleLabelAr : roleLabelEn}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-900">
            <span>{language === 'ar' ? 'الرياض • المملكة العربية السعودية' : 'Riyadh HQ • Kingdom of Saudi Arabia'}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              {language === 'ar' ? 'بوابة محمية بنظام RBAC' : 'RBAC Protected Gateway'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
