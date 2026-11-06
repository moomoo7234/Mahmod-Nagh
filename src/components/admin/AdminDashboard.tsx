import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { NotificationCenter } from '../common/NotificationCenter.tsx';
import { AdminOverview } from './AdminOverview.tsx';
import { AdminEmployees } from './AdminEmployees.tsx';
import { AdminRoles } from './AdminRoles.tsx';
import { AdminDepartments } from './AdminDepartments.tsx';
import { AdminCalendar } from './AdminCalendar.tsx';
import { AdminCMS } from './AdminCMS.tsx';
import { AdminReports } from './AdminReports.tsx';
import { AdminAuditLogs } from './AdminAuditLogs.tsx';
import {
  LayoutDashboard,
  Users,
  Shield,
  Building2,
  Calendar,
  FileEdit,
  BarChart3,
  History,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  HeartPulse,
  Languages,
  LogOut,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminSection,
    setAdminSection,
    setActiveView,
    currentUser,
    isAuthenticated,
    logout,
    openLoginModal,
    roles,
    switchRoleUser,
    companySettings,
    language,
    toggleLanguage,
  } = useApp();

  const currentRole = roles.find((r) => r.id === currentUser?.roleId);

  const navItems = [
    {
      id: 'overview',
      label: language === 'ar' ? 'نظرة عامة والمهام' : 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'employees',
      label: language === 'ar' ? 'الموظفين والقيادات' : 'Employees',
      icon: Users,
    },
    {
      id: 'roles',
      label: language === 'ar' ? 'الأدوار والصلاحيات (RBAC)' : 'Roles & RBAC',
      icon: Shield,
    },
    {
      id: 'departments',
      label: language === 'ar' ? 'القطاعات والإدارات' : 'Departments',
      icon: Building2,
    },
    {
      id: 'calendar',
      label: language === 'ar' ? 'جدول المواعيد والتقويم' : 'Calendar & Bookings',
      icon: Calendar,
    },
    {
      id: 'cms',
      label: language === 'ar' ? 'إدارة محتوى الموقع' : 'Website CMS',
      icon: FileEdit,
    },
    {
      id: 'reports',
      label: language === 'ar' ? 'التقارير وتصدير البيانات' : 'Reports & Export',
      icon: BarChart3,
    },
    {
      id: 'logs',
      label: language === 'ar' ? 'سجل الرقابة والأمان' : 'Audit Logs',
      icon: History,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0c0c0c]/90 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('public')}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{language === 'ar' ? 'الموقع العام' : 'Public Site'}</span>
            </button>

            <div className="h-4 w-px bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A30D25] to-[#40050e] flex items-center justify-center border border-[#A30D25]/40 shadow-sm">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold font-serif-luxury tracking-wider text-white hidden sm:inline-block">
                {language === 'ar'
                  ? 'بوابة الإدارة التنفيذية لشركة صيدليات صحة القلب'
                  : 'HEART HEALTH EXECUTIVE PORTAL'}
              </span>
            </div>
          </div>

          {/* User profile, notifications, and language */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Languages className="w-3.5 h-3.5 text-[#ff4c68]" />
              <span className="font-bold text-[11px]">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-6 h-6 rounded-full object-cover border border-neutral-700"
              />
              <div className="text-left hidden md:block">
                <span className="font-semibold text-white block leading-tight">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-[#ff4c68] font-bold block uppercase">
                  {currentRole?.name}
                </span>
              </div>
            </div>

            {/* Role Switcher */}
            <select
              value={currentUser?.roleId}
              onChange={(e) => switchRoleUser(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-semibold focus:outline-none focus:border-[#A30D25]"
              title="Test view as different role"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {language === 'ar' ? `الدور: ${r.name}` : `Role: ${r.name}`}
                </option>
              ))}
            </select>

            {/* Logout Action Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-rose-950/60 border border-neutral-800 hover:border-rose-900/60 text-xs text-rose-300 hover:text-white transition-colors"
              title={language === 'ar' ? 'تسجيل الخروج من الجلسة' : 'Sign Out of Executive Session'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">{language === 'ar' ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Access Gate if not authenticated */}
      {!isAuthenticated && (
        <div className="max-w-xl mx-auto my-20 p-8 rounded-2xl bg-[#0c0c0c] border border-white/10 text-center shadow-[0_0_50px_rgba(163,13,37,0.3)]">
          <div className="w-16 h-16 rounded-2xl bg-[#A30D25]/20 border border-[#A30D25]/50 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[#ff4c68]" />
          </div>
          <h2 className="text-xl font-bold font-serif-luxury text-white mb-2">
            {language === 'ar' ? 'يلزم تسجيل الدخول للوصول إلى لوحة الإدارة' : 'Executive Authentication Required'}
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            {language === 'ar'
              ? 'هذه المنطقة مخصصة لأعضاء الإدارة التنفيذية ورؤساء القطاعات بصيدليات صحة القلب. يرجى تسجيل الدخول بحسابك الوظيفي المعتمد.'
              : 'This portal is restricted to authorized HEART HEALTH executive management and department heads. Please authenticate using your verified credentials.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => openLoginModal({ returnView: 'admin' })}
              className="px-6 py-2.5 rounded-xl bg-[#A30D25] hover:bg-[#b80f2b] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(163,13,37,0.4)]"
            >
              {language === 'ar' ? 'تسجيل الدخول الآن' : 'Sign In Now'}
            </button>
            <button
              onClick={() => setActiveView('public')}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold border border-neutral-800 transition-colors"
            >
              {language === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Layout */}
      {isAuthenticated && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            {language === 'ar' ? 'الوحدات الإدارية والرقابية' : 'Administrative Modules'}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = adminSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminSection(item.id)}
                className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-[#A30D25] text-white shadow-[0_0_20px_rgba(163,13,37,0.3)] font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  language === 'ar' ? (
                    <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                  )
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {adminSection === 'overview' && <AdminOverview />}
          {adminSection === 'employees' && <AdminEmployees />}
          {adminSection === 'roles' && <AdminRoles />}
          {adminSection === 'departments' && <AdminDepartments />}
          {adminSection === 'calendar' && <AdminCalendar />}
          {adminSection === 'cms' && <AdminCMS />}
          {adminSection === 'reports' && <AdminReports />}
          {adminSection === 'logs' && <AdminAuditLogs />}
        </main>
      </div>
      )}
    </div>
  );
};
