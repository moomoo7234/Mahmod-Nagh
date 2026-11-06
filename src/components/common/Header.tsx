import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { NotificationCenter } from './NotificationCenter.tsx';
import {
  HeartPulse,
  Calendar,
  Shield,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  Building,
  Users,
  Compass,
  Languages,
  LogIn,
  LogOut,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    isAuthenticated,
    openLoginModal,
    logout,
    roles,
    switchRoleUser,
    companySettings,
    language,
    toggleLanguage,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const currentRoleName =
    roles.find((r) => r.id === currentUser?.roleId)?.name || 'Executive';

  const navigateToSection = (sectionId: string) => {
    setActiveView('public');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080808]/90 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <button
            onClick={() => {
              setActiveView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3.5 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#A30D25] to-[#40050e] flex items-center justify-center border border-[#A30D25]/40 shadow-[0_0_20px_rgba(163,13,37,0.4)] group-hover:shadow-[0_0_28px_rgba(163,13,37,0.7)] transition-all">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="block text-lg font-extrabold tracking-[0.14em] text-white font-serif-luxury uppercase">
                {language === 'ar' ? companySettings.brandNameAr : companySettings.brandNameEn}
              </span>
              <span className="block text-xs tracking-wider text-[#A30D25] font-semibold font-serif-luxury">
                {language === 'ar' ? 'بوابة الإدارة وحجز المواعيد' : companySettings.brandNameAr}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => navigateToSection('hero')}
              className={`text-sm tracking-wider font-semibold transition-colors ${
                activeView === 'public'
                  ? 'text-white hover:text-[#A30D25]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <button
              onClick={() => navigateToSection('about')}
              className="text-sm tracking-wider font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'ar' ? 'عن الشركة' : 'About'}
            </button>
            <button
              onClick={() => navigateToSection('management')}
              className="text-sm tracking-wider font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'ar' ? 'القيادة التنفيذية' : 'Leadership'}
            </button>
            <button
              onClick={() => navigateToSection('departments')}
              className="text-sm tracking-wider font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'ar' ? 'القطاعات' : 'Departments'}
            </button>
            <button
              onClick={() => navigateToSection('contact')}
              className="text-sm tracking-wider font-semibold text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'ar' ? 'التواصل والمقر' : 'Contact'}
            </button>
          </nav>

          {/* Action CTAs, Language Toggle, Notification Center & Portal Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-200 transition-colors"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Languages className="w-3.5 h-3.5 text-[#ff4c68]" />
              <span className="font-bold">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Quick Role Switcher Pill & User Info if Authenticated, or Login Button if Guest */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 transition-colors"
                  title="Session profile & roles"
                >
                  <div className="w-2 h-2 rounded-full bg-[#A30D25] animate-ping" />
                  <span className="font-semibold text-white">{currentUser?.name.split(' ')[0] || currentRoleName}</span>
                  <span className="text-[10px] text-[#ff4c68] font-bold hidden md:inline">({currentRoleName})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {roleDropdownOpen && (
                  <div
                    className={`absolute mt-2 w-64 rounded-xl bg-[#121212] border border-neutral-800 shadow-2xl py-2 z-50 text-left ${
                      language === 'ar' ? 'left-0' : 'right-0'
                    }`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    onMouseLeave={() => setRoleDropdownOpen(false)}
                  >
                    <div className="px-3 py-1.5 border-b border-neutral-800/80 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                      <span>{language === 'ar' ? 'الجلسة التنفيذية (RBAC)' : 'Active Session'}</span>
                      <span className="text-[9px] text-[#ff4c68] font-mono">ONLINE</span>
                    </div>

                    <div className="px-3 py-2 border-b border-neutral-800/60 bg-neutral-950/40">
                      <p className="text-xs font-bold text-white leading-tight">
                        {language === 'ar' ? currentUser?.nameAr || currentUser?.name : currentUser?.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <div className="px-3 py-1 text-[10px] text-neutral-400 uppercase font-semibold">
                        {language === 'ar' ? 'تبديل الدور للتجربة:' : 'Switch Demo Role:'}
                      </div>
                      {roles.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            switchRoleUser(r.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-neutral-800/80 transition-colors ${
                            currentUser?.roleId === r.id
                              ? 'text-[#A30D25] font-bold bg-[#A30D25]/10'
                              : 'text-neutral-300'
                          }`}
                        >
                          <span>{r.name}</span>
                          {currentUser?.roleId === r.id && (
                            <UserCheck className="w-3.5 h-3.5 text-[#A30D25]" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-neutral-800 px-2">
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          logout();
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'تسجيل الخروج من الجلسة' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white border border-[#A30D25]/40 hover:border-[#A30D25] shadow-sm hover:shadow-[0_0_15px_rgba(163,13,37,0.3)] transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-[#ff4c68]" />
                <span>{language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}

            {/* Book A Meeting Primary Action */}
            <button
              onClick={() => {
                setActiveView('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider font-bold transition-all shadow-lg ${
                activeView === 'booking'
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#A30D25] hover:bg-[#b80f2b] text-white hover:shadow-[0_0_20px_rgba(163,13,37,0.5)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حجز موعد تنفيذي' : 'Book Meeting'}</span>
            </button>

            {/* Portal / Admin Access Toggle */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openLoginModal({ returnView: 'admin' });
                } else {
                  setActiveView(activeView === 'admin' ? 'public' : 'admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs tracking-wider font-semibold border transition-all ${
                activeView === 'admin'
                  ? 'bg-neutral-800 text-white border-neutral-600'
                  : 'bg-transparent text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#A30D25]" />
              <span>{activeView === 'admin' ? (language === 'ar' ? 'مغادرة الإدارة' : 'Exit Portal') : (language === 'ar' ? 'بوابة الإدارة' : 'Portal')}</span>
            </button>
          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-1.5 px-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 font-bold"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <NotificationCenter />
            <button
              onClick={() => setActiveView(activeView === 'booking' ? 'public' : 'booking')}
              className="p-2 rounded-lg bg-[#A30D25] text-white"
              title="Book Meeting"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden border-t border-neutral-800 bg-[#0c0c0c] px-4 pt-4 pb-6 space-y-4 text-left"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveView('public');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-lg bg-neutral-900 text-xs font-semibold text-white flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#A30D25]" />
              {language === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <button
              onClick={() => {
                setActiveView('booking');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-lg bg-[#A30D25] text-xs font-semibold text-white flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-white" />
              {language === 'ar' ? 'حجز موعد' : 'Book Meeting'}
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setMobileMenuOpen(false);
                  openLoginModal({ returnView: 'admin' });
                } else {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }
              }}
              className="py-2.5 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white flex items-center gap-2 col-span-2"
            >
              <Shield className="w-4 h-4 text-[#A30D25]" />
              {language === 'ar' ? 'بوابة الإدارة التنفيذية' : 'Executive Admin Portal'}
            </button>
          </div>

          {/* Mobile Login / User Profile Card */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#A30D25]/50"
                  />
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {language === 'ar' ? currentUser?.nameAr || currentUser?.name : currentUser?.name}
                    </p>
                    <p className="text-[10px] text-[#ff4c68] font-semibold">
                      {currentRoleName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-900/60 text-rose-300 hover:text-white text-xs flex items-center gap-1 font-semibold"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{language === 'ar' ? 'خروج' : 'Logout'}</span>
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">
                    {language === 'ar' ? 'بوابة القيادة التنفيذية' : 'Executive Leadership'}
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {language === 'ar' ? 'قم بتسجيل الدخول للوصول للإدارة' : 'Sign in to access administration'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#A30D25] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'دخول' : 'Sign In'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-800 space-y-1">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-2 pb-1">
              {language === 'ar' ? 'أقسام المنصة' : 'Navigate Sections'}
            </p>
            <button
              onClick={() => navigateToSection('about')}
              className="w-full text-left py-2 px-3 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
            >
              {language === 'ar' ? 'عن صيدليات صحة القلب' : 'About HEART HEALTH'}
            </button>
            <button
              onClick={() => navigateToSection('management')}
              className="w-full text-left py-2 px-3 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
            >
              {language === 'ar' ? 'فريق الإدارة والقيادة التنفيذية' : 'Executive Leadership'}
            </button>
            <button
              onClick={() => navigateToSection('departments')}
              className="w-full text-left py-2 px-3 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
            >
              {language === 'ar' ? 'القطاعات والإدارات المتخصصة' : 'Corporate Departments'}
            </button>
            <button
              onClick={() => navigateToSection('contact')}
              className="w-full text-left py-2 px-3 text-sm text-neutral-300 hover:bg-neutral-900 rounded-md"
            >
              {language === 'ar' ? 'التواصل والمقر بالرياض' : 'Corporate Contact & Headquarters'}
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-2 pb-2">
              {language === 'ar' ? 'تبديل الدور للتجربة (RBAC)' : 'Select Demo Role (RBAC)'}
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    switchRoleUser(r.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                    currentUser?.roleId === r.id
                      ? 'bg-[#A30D25]/20 text-[#A30D25] font-bold border border-[#A30D25]/40'
                      : 'bg-neutral-900/60 text-neutral-300'
                  }`}
                >
                  <span>{r.name}</span>
                  {currentUser?.roleId === r.id && <UserCheck className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
