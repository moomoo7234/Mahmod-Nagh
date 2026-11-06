import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Employee } from '../../types/index.ts';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  KeyRound,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Check,
  Copy,
  AlertTriangle,
} from 'lucide-react';

export const AdminEmployees: React.FC = () => {
  const {
    employees,
    departments,
    roles,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    resetEmployeePassword,
    hasUserPermission,
    language,
  } = useApp();

  const isAr = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Password reset feedback
  const [resetFeedback, setResetFeedback] = useState<{ id: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    title: '',
    departmentId: departments[0]?.id || '',
    email: '',
    phone: '+966 5',
    roleId: roles[0]?.id || 'employee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    bio: '',
    officeLocation: 'Executive HQ, Riyadh',
    active: true,
    isExecutive: false,
    startHour: '09:00',
    endHour: '17:00',
    duration: 45,
    buffer: 15,
  });

  const canAdd = hasUserPermission('add_employees');
  const canEdit = hasUserPermission('edit_employees');

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      nameAr: '',
      title: '',
      departmentId: departments[0]?.id || '',
      email: '',
      phone: '+966 5',
      roleId: roles[0]?.id || 'employee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
      bio: '',
      officeLocation: isAr ? 'المقر التنفيذي بالرياض' : 'Executive HQ, Riyadh',
      active: true,
      isExecutive: false,
      startHour: '09:00',
      endHour: '17:00',
      duration: 45,
      buffer: 15,
    });
    setModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      nameAr: emp.nameAr,
      title: emp.title,
      departmentId: emp.departmentId,
      email: emp.email,
      phone: emp.phone,
      roleId: emp.roleId,
      avatar: emp.avatar,
      bio: emp.bio,
      officeLocation: emp.officeLocation,
      active: emp.active,
      isExecutive: emp.isExecutive || false,
      startHour: emp.workingHours.start,
      endHour: emp.workingHours.end,
      duration: emp.workingHours.slotDurationMinutes,
      buffer: emp.workingHours.bufferMinutes,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.title) return;

    const workingHours = {
      days: [0, 1, 2, 3, 4], // Sun-Thu
      start: formData.startHour,
      end: formData.endHour,
      slotDurationMinutes: Number(formData.duration),
      bufferMinutes: Number(formData.buffer),
    };

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, {
        name: formData.name,
        nameAr: formData.nameAr,
        title: formData.title,
        departmentId: formData.departmentId,
        email: formData.email,
        phone: formData.phone,
        roleId: formData.roleId,
        avatar: formData.avatar,
        bio: formData.bio,
        officeLocation: formData.officeLocation,
        active: formData.active,
        isExecutive: formData.isExecutive,
        workingHours,
      });
    } else {
      addEmployee({
        name: formData.name,
        nameAr: formData.nameAr,
        title: formData.title,
        departmentId: formData.departmentId,
        email: formData.email,
        phone: formData.phone,
        roleId: formData.roleId,
        avatar: formData.avatar,
        bio: formData.bio,
        officeLocation: formData.officeLocation,
        active: formData.active,
        isExecutive: formData.isExecutive,
        workingHours,
      });
    }

    setModalOpen(false);
  };

  const handlePasswordReset = (emp: Employee) => {
    const temp = resetEmployeePassword(emp.id);
    setResetFeedback({ id: emp.id, password: temp });
  };

  const copyPassword = () => {
    if (!resetFeedback) return;
    navigator.clipboard.writeText(resetFeedback.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDeptFilter === 'ALL' || emp.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className={`space-y-6 animate-fadeIn ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif-luxury uppercase tracking-wide">
            {isAr ? 'إدارة الموظفين والقيادات التنفيذية' : 'Employee & Executive Management'}
          </h2>
          <p className="text-xs text-neutral-400">
            {isAr
              ? 'إنشاء وتعديل حسابات الكادر، وتخصيص ساعات العمل وسجلات التقويم وتعيين الصلاحيات.'
              : 'Provision staff accounts, configure working hours, and assign organizational roles.'}
          </p>
        </div>

        {canAdd && (
          <button
            onClick={openAddModal}
            className="py-2.5 px-4 rounded-xl bg-[#A30D25] hover:bg-[#c20f2e] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAr ? 'إضافة موظف جديد' : 'Add New Employee'}</span>
          </button>
        )}
      </div>

      {/* Temporary Password Modal / Notification */}
      {resetFeedback && (
        <div className="p-4 rounded-xl bg-neutral-900 border border-[#A30D25]/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-[#ff4c68] shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                {isAr ? 'تم توليد كلمة مرور مؤقتة' : 'Temporary Password Issued'}
              </p>
              <p className="text-xs text-neutral-400">
                {isAr ? 'بيانات الدخول الجديدة: ' : 'Credentials generated: '}
                <span className="font-mono text-[#ff4c68] font-bold text-sm">
                  {resetFeedback.password}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyPassword}
              className="py-1.5 px-3 rounded-lg bg-neutral-800 text-xs text-white hover:bg-neutral-700 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
            </button>
            <button
              onClick={() => setResetFeedback(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              {isAr ? 'إغلاق' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className={`w-4 h-4 text-neutral-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم أو البريد أو المسمى الوظيفي...' : 'Search by employee name, email, or title...'}
            className={`w-full ${isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#A30D25]`}
          />
        </div>

        <select
          value={selectedDeptFilter}
          onChange={(e) => setSelectedDeptFilter(e.target.value)}
          className="w-full sm:w-60 px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-[#A30D25]"
        >
          <option value="ALL">{isAr ? 'كافة القطاعات' : 'All Departments'}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {isAr ? d.nameAr : d.nameEn} ({d.code})
            </option>
          ))}
        </select>
      </div>

      {/* Table of Employees */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className={`w-full ${isAr ? 'text-right' : 'text-left'} text-xs`}>
            <thead className="bg-neutral-900/60 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">{isAr ? 'الموظف / المسؤول' : 'Employee'}</th>
                <th className="py-3 px-4">{isAr ? 'القطاع' : 'Department'}</th>
                <th className="py-3 px-4">{isAr ? 'الدور والصلاحية' : 'Role & Access'}</th>
                <th className="py-3 px-4">{isAr ? 'ساعات الدوام' : 'Schedule'}</th>
                <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                <th className={`py-3 px-4 ${isAr ? 'text-left' : 'text-right'}`}>{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredEmployees.map((emp) => {
                const dept = departments.find((d) => d.id === emp.departmentId);
                const role = roles.find((r) => r.id === emp.roleId);
                return (
                  <tr key={emp.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-11 rounded-lg object-cover object-top border border-neutral-800"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{isAr ? emp.nameAr : emp.name}</p>
                          <p className="text-[11px] text-[#A30D25] font-serif-luxury">{isAr ? emp.name : emp.nameAr}</p>
                          <p className="text-[10px] text-neutral-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-medium">
                        {dept ? (isAr ? dept.nameAr : dept.nameEn) : (isAr ? 'غير مخصص' : 'Unassigned')}
                      </span>
                      <span className="block text-[10px] text-neutral-400 font-mono">
                        {dept?.code}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-200 text-[10px] font-semibold">
                        {role?.name || emp.roleId}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-300">
                      <div>
                        {emp.workingHours.start} - {emp.workingHours.end}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {emp.workingHours.slotDurationMinutes} {isAr ? 'د للجلسة' : 'm slot'} (+{emp.workingHours.bufferMinutes}{isAr ? 'د فاصل' : 'm'})
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {emp.active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          {isAr ? 'نشط' : 'Active'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-neutral-400 text-[10px] font-semibold">
                          <XCircle className="w-3 h-3" />
                          {isAr ? 'معطل' : 'Deactivated'}
                        </span>
                      )}
                    </td>

                    <td className={`py-3 px-4 ${isAr ? 'text-left' : 'text-right'}`}>
                      <div className={`flex items-center ${isAr ? 'justify-start' : 'justify-end'} gap-1.5`}>
                        {canEdit && (
                          <button
                            onClick={() => openEditModal(emp)}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white"
                            title={isAr ? 'تعديل البيانات' : 'Edit Details'}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handlePasswordReset(emp)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-400"
                          title={isAr ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        {canEdit && emp.id !== 'emp-ceo' && (
                          <button
                            onClick={() => {
                              if (window.confirm(isAr ? `هل أنت متأكد من حذف حساب ${emp.nameAr}؟` : `Are you sure you want to delete ${emp.name}?`)) {
                                deleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/60 text-rose-400"
                            title={isAr ? 'حذف الحساب' : 'Delete Account'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl bg-[#0e0e0e] border border-neutral-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white font-serif-luxury uppercase">
                {editingEmployee
                  ? (isAr ? 'تعديل بيانات الحساب' : 'Edit Employee Account')
                  : (isAr ? 'إضافة وتعيين موظف جديد' : 'Provision New Account')}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'الاسم بالإنجليزية *' : 'English Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'الاسم بالعربية *' : 'Arabic Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'المسمى الوظيفي *' : 'Job Title *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'القطاع / الإدارة *' : 'Department *'}
                  </label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {isAr ? d.nameAr : d.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isAr ? 'الدور والصلاحية (RBAC) *' : 'Role (RBAC) *'}
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isAr ? 'رابط الصورة الشخصية (Avatar URL)' : 'Avatar Photo URL'}
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
                />
              </div>

              {/* Working Hours configuration */}
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <p className="font-bold text-white uppercase text-[11px] tracking-wider">
                  {isAr ? 'التقويم المستقل وساعات المقابلات' : 'Independent Calendar & Working Hours'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">
                      {isAr ? 'بداية الدوام' : 'Start Time'}
                    </label>
                    <input
                      type="time"
                      value={formData.startHour}
                      onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                      className="w-full px-2 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">
                      {isAr ? 'نهاية الدوام' : 'End Time'}
                    </label>
                    <input
                      type="time"
                      value={formData.endHour}
                      onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                      className="w-full px-2 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">
                      {isAr ? 'مدة الجلسة (د)' : 'Duration (min)'}
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 text-[10px] mb-1">
                      {isAr ? 'الفاصل الزمني (د)' : 'Buffer (min)'}
                    </label>
                    <input
                      type="number"
                      value={formData.buffer}
                      onChange={(e) => setFormData({ ...formData, buffer: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-[#A30D25]"
                  />
                  <span className="text-neutral-300">{isAr ? 'الحساب نشط' : 'Account Active'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExecutive}
                    onChange={(e) => setFormData({ ...formData, isExecutive: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-[#A30D25]"
                  />
                  <span className="text-neutral-300">{isAr ? 'إظهار في واجهة الإدارة العليا (Hero)' : 'Feature on Executive Hero'}</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2 px-4 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-[#A30D25] hover:bg-[#c20f2e] text-white font-bold"
                >
                  {isAr ? 'حفظ الحساب' : 'Save Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
