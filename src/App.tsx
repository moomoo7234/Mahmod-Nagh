import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { LoadingScreen } from './components/common/LoadingScreen.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { Header } from './components/common/Header.tsx';
import { Footer } from './components/common/Footer.tsx';
import { Hero } from './components/public/Hero.tsx';
import { AboutSection } from './components/public/AboutSection.tsx';
import { ManagementSection } from './components/public/ManagementSection.tsx';
import { DepartmentsSection } from './components/public/DepartmentsSection.tsx';
import { ContactSection } from './components/public/ContactSection.tsx';
import { MeetingBookingFlow } from './components/booking/MeetingBookingFlow.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { ProfileModal } from './components/modals/ProfileModal.tsx';
import { LoginModal } from './components/modals/LoginModal.tsx';

function MainApp() {
  const { activeView, language } = useApp();

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#080808] text-neutral-100 flex flex-col font-sans selection:bg-[#A30D25] selection:text-white"
    >
      <LoadingScreen />
      <ToastContainer />

      {activeView !== 'admin' && <Header />}

      <main className="flex-1">
        {activeView === 'public' && (
          <>
            <Hero />
            <AboutSection />
            <ManagementSection />
            <DepartmentsSection />
            <ContactSection />
          </>
        )}

        {activeView === 'booking' && <MeetingBookingFlow />}

        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {activeView !== 'admin' && <Footer />}

      <ProfileModal />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
