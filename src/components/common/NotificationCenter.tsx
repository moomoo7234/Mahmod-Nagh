import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Clock,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    language,
    setActiveView,
    setAdminSection,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const formatTimestamp = (isoStr: string) => {
    const diffMs = Date.now() - new Date(isoStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (language === 'ar') {
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      return new Date(isoStr).toLocaleDateString('ar-SA');
    } else {
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return new Date(isoStr).toLocaleDateString('en-US');
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'new_booking':
        return <Calendar className="w-4 h-4 text-[#ff4c68]" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-rose-400" />;
      case 'rescheduled':
        return <RotateCcw className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
    setActiveView('admin');
    setAdminSection('calendar');
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
        title={language === 'ar' ? 'مركز التنبيهات والإشعارات' : 'Notification Center'}
        aria-label="Notification Center"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#A30D25] text-[10px] font-bold text-white shadow-[0_0_10px_rgba(163,13,37,0.8)] border border-black animate-pulse">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Notification Center Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e0e0e] border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 overflow-hidden ${
              language === 'ar' ? 'left-0 sm:left-auto sm:right-auto' : 'right-0'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#A30D25]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-serif-luxury">
                  {language === 'ar' ? 'مركز الإشعارات الفورية' : 'Notification Center'}
                </h3>
                {unreadNotificationsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#A30D25]/20 text-[#ff4c68] text-[10px] font-bold">
                    {unreadNotificationsCount} {language === 'ar' ? 'جديد' : 'new'}
                  </span>
                )}
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  title={language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">
                    {language === 'ar' ? 'قراءة الكل' : 'Mark all read'}
                  </span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 bg-neutral-900/40 border-b border-neutral-800/80 flex items-center gap-2 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-[#A30D25] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'كافة التنبيهات' : 'All'} ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filter === 'unread'
                    ? 'bg-[#A30D25] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'غير المقروءة' : 'Unread'} ({unreadNotificationsCount})
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-neutral-900">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  {language === 'ar'
                    ? 'لا توجد إشعارات جديدة حالياً'
                    : 'No notifications to display'}
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id)}
                    className={`p-3.5 transition-colors cursor-pointer text-left flex items-start gap-3 hover:bg-neutral-900/60 ${
                      !n.read ? 'bg-[#170a0e]/60' : 'bg-transparent'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 shrink-0 mt-0.5">
                      {renderIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs font-bold truncate ${!n.read ? 'text-white' : 'text-neutral-300'}`}>
                          {language === 'ar' ? n.titleAr : n.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 shrink-0 flex items-center gap-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimestamp(n.timestamp)}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {language === 'ar' ? n.messageAr : n.message}
                      </p>

                      {n.referenceNumber && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-mono font-bold text-[#ff4c68]">
                            {n.referenceNumber}
                          </span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                            <span>{language === 'ar' ? 'عرض في التقويم' : 'View in calendar'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      )}
                    </div>

                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-[#A30D25] shrink-0 mt-1" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-neutral-400 hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{language === 'ar' ? 'مسح السجل' : 'Clear all'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('admin');
                    setAdminSection('calendar');
                    setIsOpen(false);
                  }}
                  className="text-[11px] text-[#ff4c68] hover:underline font-semibold px-2 py-1"
                >
                  {language === 'ar' ? 'فتح جدول المواعيد' : 'Open Schedule'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
