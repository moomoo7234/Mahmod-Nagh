import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { PERMISSION_DEFINITIONS } from '../../data/mockData.ts';
import { Role } from '../../types/index.ts';
import { Shield, ShieldAlert, Plus, Check, Lock, Info, Save } from 'lucide-react';

export const AdminRoles: React.FC = () => {
  const { roles, updateRolePermissions, addRole, currentUser, language } = useApp();
  const isAr = language === 'ar';

  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'super-admin');
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  // Group permissions by category
  const categories = Array.from(new Set(PERMISSION_DEFINITIONS.map((p) => p.category)));

  const handleTogglePermission = (key: string) => {
    if (selectedRole.id === 'super-admin') return; // Super admin always has all permissions

    let nextPermissions: string[];
    if (selectedRole.permissions.includes(key)) {
      nextPermissions = selectedRole.permissions.filter((p) => p !== key);
    } else {
      nextPermissions = [...selectedRole.permissions, key];
    }

    updateRolePermissions(selectedRole.id, nextPermissions);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    addRole({
      name: newRoleName.trim(),
      description: newRoleDescription.trim() || (isAr ? 'دور تنظيمي مخصص' : 'Custom organizational role'),
      isSystem: false,
      permissions: ['view_own_meetings'],
    });

    setNewRoleName('');
    setNewRoleDescription('');
    setNewRoleModalOpen(false);
  };

  return (
    <div className={`space-y-6 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'إدارة الأدوار والصلاحيات الدقيقة (RBAC)' : 'Role-Based Access Control (RBAC)'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'تحديد الأدوار التنظيمية وضبط ١٦ صلاحية دقيقة مفعلة ومطبقة في النظام.'
              : 'Define organizational roles and configure 16 granular permissions enforced across the platform.'}
          </p>
        </div>

        <button
          onClick={() => setNewRoleModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#ff4c68]" />
          <span>{isAr ? 'إنشاء دور جديد' : 'Create Custom Role'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{isAr ? 'تم تحديث صلاحيات الدور ومزامنتها بنجاح.' : 'Role permissions updated successfully. Backend authorization synchronized.'}</span>
        </div>
      )}

      {/* Role Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800">
        {roles.map((r) => {
          const isSelected = selectedRoleId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRoleId(r.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#A30D25] text-white shadow-lg border border-[#ff4c68]/40'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{r.name}</span>
              {r.isSystem && (
                <span className="text-[9px] uppercase tracking-wider opacity-60">
                  {isAr ? 'نظامي' : 'System'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role Summary Banner */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {selectedRole.name}
            </h3>
            {selectedRole.id === 'super-admin' && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                {isAr ? 'صلاحيات كاملة غير مقيدة' : 'Unrestricted Authority'}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400">{selectedRole.description}</p>
        </div>

        <div className={isAr ? 'text-left' : 'text-right'}>
          <span className="text-xs font-mono font-bold text-[#ff4c68]">
            {selectedRole.id === 'super-admin'
              ? '16 / 16'
              : `${selectedRole.permissions.length} / 16`}
          </span>
          <span className="block text-[10px] text-neutral-400 uppercase">
            {isAr ? 'ممنوحة' : 'Granted'}
          </span>
        </div>
      </div>

      {/* Granular Permissions Matrix */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryPermissions = PERMISSION_DEFINITIONS.filter((p) => p.category === category);
          return (
            <div
              key={category}
              className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest font-serif-luxury flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A30D25]" />
                  <span>{isAr ? `صلاحيات قطاع: ${category}` : `${category} Permissions`}</span>
                </h4>
                <span className="text-[10px] text-neutral-400">
                  {categoryPermissions.length} {isAr ? 'عنصر تدقيق' : 'checks'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryPermissions.map((perm) => {
                  const isGranted =
                    selectedRole.id === 'super-admin' ||
                    selectedRole.permissions.includes(perm.key);
                  const isLocked = selectedRole.id === 'super-admin';

                  return (
                    <div
                      key={perm.key}
                      onClick={() => !isLocked && handleTogglePermission(perm.key)}
                      className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        isLocked
                          ? 'bg-neutral-900/40 border-neutral-800 cursor-default opacity-85'
                          : 'cursor-pointer hover:border-neutral-700 ' +
                            (isGranted
                              ? 'bg-[#A30D25]/10 border-[#A30D25]/40'
                              : 'bg-neutral-900/40 border-neutral-800/80')
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">{perm.label}</p>
                          <code className="text-[10px] text-neutral-400 font-mono" dir="ltr">
                            {perm.key}
                          </code>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">
                          {perm.description}
                        </p>
                      </div>

                      <div className="pt-0.5 shrink-0">
                        {isGranted ? (
                          <div className="w-5 h-5 rounded bg-[#A30D25] flex items-center justify-center text-white">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border border-neutral-700 bg-neutral-900" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for creating custom role */}
      {newRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0e0e0e] border border-neutral-800 p-6 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="text-base font-bold text-white font-serif-luxury uppercase">
              {isAr ? 'إنشاء دور جديد في النظام' : 'Create New Role'}
            </h3>
            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'اسم الدور *' : 'Role Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: مدقق جودة صيدلانية أول' : 'e.g. Senior Medical Auditor'}
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'الوصف الوظيفي والمسؤوليات' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  placeholder={isAr ? 'وضح المسؤوليات التنظيمية لهذا الدور...' : 'Describe the operational responsibilities of this role...'}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setNewRoleModalOpen(false)}
                  className="py-1.5 px-3 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-lg bg-[#A30D25] text-white font-bold"
                >
                  {isAr ? 'إنشاء الدور' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
