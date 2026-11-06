import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Shield, Clock, Search, User, Filter, AlertCircle } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs, language } = useApp();
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    return (
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={`space-y-6 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'سجل الرقابة الإدارية والأمان (Audit Trail)' : 'System Audit & Security Logs'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'توثيق غير قابل للتعديل لكافة الإجراءات الإدارية، تعديلات الصلاحيات، وحركات حجز المواعيد.'
              : 'Immutable tracking of administrative actions, permission modifications, and booking lifecycle events.'}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className={`w-4 h-4 text-neutral-400 absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث في سجل الرقابة...' : 'Search audit trail...'}
            className={`w-full ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white`}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className={`w-full ${isAr ? 'text-right' : 'text-left'} text-xs`}>
            <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                <th className="py-3 px-4">{isAr ? 'المستخدم المنفذ' : 'Actor'}</th>
                <th className="py-3 px-4">{isAr ? 'نوع الإجراء' : 'Action'}</th>
                <th className="py-3 px-4">{isAr ? 'المورد المستهدف' : 'Target Resource'}</th>
                <th className="py-3 px-4">{isAr ? 'التفاصيل' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                    {new Date(log.timestamp).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="font-semibold text-white block">{log.actorName}</span>
                    <span className="text-[10px] text-neutral-400 font-mono" dir="ltr">{log.actorEmail}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#A30D25]/15 border border-[#A30D25]/30 text-[#ff4c68] text-[10px] font-bold uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-neutral-200">{log.target}</td>
                  <td className="py-3 px-4 font-sans text-neutral-400 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
