import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Department } from '../../types/index.ts';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Crown,
  TrendingUp,
  Stethoscope,
  Truck,
  Megaphone,
  Cpu,
} from 'lucide-react';

export const AdminDepartments: React.FC = () => {
  const {
    departments,
    employees,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    hasUserPermission,
    language,
  } = useApp();

  const isAr = language === 'ar';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    code: '',
    headManagerId: '',
    description: '',
    iconName: 'Building2',
    employeeCount: 0,
    active: true,
  });

  const canManage = hasUserPermission('manage_departments');

  const openAdd = () => {
    setEditingDept(null);
    setFormData({
      nameEn: '',
      nameAr: '',
      code: '',
      headManagerId: employees[0]?.id || '',
      description: '',
      iconName: 'Building2',
      employeeCount: 0,
      active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({
      nameEn: dept.nameEn,
      nameAr: dept.nameAr,
      code: dept.code,
      headManagerId: dept.headManagerId || employees[0]?.id || '',
      description: dept.description,
      iconName: dept.iconName,
      employeeCount: dept.employeeCount,
      active: dept.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.nameAr || !formData.code) return;

    if (editingDept) {
      updateDepartment(editingDept.id, formData);
    } else {
      addDepartment(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className={`space-y-6 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'إدارة القطاعات والإدارات التنفيذية' : 'Corporate Department Management'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'هيكلة القطاعات المؤسسية، وتعيين رؤساء الإدارات، وإدارة ظهور الأقسام في واجهة الحجز.'
              : 'Structure corporate operational divisions, assign department heads, and manage visibility.'}
          </p>
        </div>

        {canManage && (
          <button
            onClick={openAdd}
            className="py-2.5 px-4 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة قطاع جديد' : 'Add Department'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const head = employees.find((e) => e.id === dept.headManagerId);
          const deptStaff = employees.filter((e) => e.departmentId === dept.id);

          return (
            <div
              key={dept.id}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-[#ff4c68] font-bold">
                    {dept.code}
                  </span>
                  <div className="flex items-center gap-2">
                    {dept.active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        {isAr ? 'نشط' : 'Active'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-neutral-400 text-[10px] font-semibold">
                        <XCircle className="w-3 h-3" />
                        {isAr ? 'معطل' : 'Inactive'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#A30D25] font-serif-luxury font-bold uppercase">
                  {isAr ? dept.nameEn : dept.nameAr}
                </p>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {isAr ? dept.nameAr : dept.nameEn}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">{isAr ? 'رئيس القطاع:' : 'Department Head:'}</span>
                  <span className="font-semibold text-white">
                    {head ? (isAr ? head.nameAr : head.name) : (isAr ? 'غير مخصص' : 'Unassigned')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">{isAr ? 'الكادر المخصص:' : 'Assigned Staff:'}</span>
                  <span className="font-mono">
                    {deptStaff.length} {isAr ? 'موظف' : 'Employees'}
                  </span>
                </div>

                {canManage && (
                  <div className={`pt-2 flex items-center ${isAr ? 'justify-start' : 'justify-end'} gap-2`}>
                    <button
                      onClick={() => openEdit(dept)}
                      className="py-1 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>
                    {dept.id !== 'dept-exec' && (
                      <button
                        onClick={() => {
                          if (window.confirm(isAr ? `هل أنت متأكد من حذف قطاع ${dept.nameAr}؟` : `Delete department ${dept.nameEn}?`)) {
                            deleteDepartment(dept.id);
                          }
                        }}
                        className="py-1 px-2.5 rounded-lg bg-neutral-900 hover:bg-rose-950/60 text-rose-400 text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Department Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0e0e0e] border border-neutral-800 p-6 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="text-base font-bold text-white font-serif-luxury uppercase">
              {editingDept ? (isAr ? 'تعديل بيانات القطاع' : 'Edit Department') : (isAr ? 'إنشاء قطاع جديد' : 'Create Department')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'اسم القطاع (بالعربية) *' : 'Department Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'اسم القطاع (بالإنجليزية) *' : 'Department Name (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'رمز الكود *' : 'Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'رئيس القطاع' : 'Department Head'}
                  </label>
                  <select
                    value={formData.headManagerId}
                    onChange={(e) => setFormData({ ...formData, headManagerId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {isAr ? emp.nameAr : emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'الوصف المؤسسي' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-[#A30D25]"
                />
                <span className="text-neutral-300">
                  {isAr ? 'القطاع نشط ومعروض في الموقع وحجز المواعيد' : 'Department Active & Visible on Website'}
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-1.5 px-3 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-lg bg-[#A30D25] text-white font-bold"
                >
                  {isAr ? 'حفظ القطاع' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
