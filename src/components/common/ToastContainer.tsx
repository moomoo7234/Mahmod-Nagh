import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, language } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed top-20 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 ${
        language === 'ar' ? 'left-0 sm:left-6' : 'right-0 sm:right-6'
      }`}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning' || toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top-4 flex items-start gap-3 relative overflow-hidden ${
              isSuccess
                ? 'bg-[#0d1c14]/95 border-emerald-500/40 text-emerald-200'
                : isWarning
                ? 'bg-[#1e0a0d]/95 border-rose-500/40 text-rose-200'
                : 'bg-[#140b0e]/95 border-[#A30D25]/50 text-neutral-100'
            }`}
          >
            {/* Glowing left accent line */}
            <div
              className={`absolute top-0 bottom-0 ${
                language === 'ar' ? 'right-0' : 'left-0'
              } w-1.5 ${
                isSuccess
                  ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                  : isWarning
                  ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                  : 'bg-[#A30D25] shadow-[0_0_12px_#A30D25]'
              }`}
            />

            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {!isSuccess && !isWarning && <Bell className="w-5 h-5 text-[#ff4c68]" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <h4 className="text-xs font-bold text-white tracking-wide">
                {toast.title}
              </h4>
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
