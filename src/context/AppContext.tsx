import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  Employee,
  MeetingBooking,
  Role,
  CompanySettings,
  AuditLog,
  MeetingStatus,
  AppNotification,
  ToastItem,
  LoginCredentials,
} from '../types/index.ts';
import { authenticateUser } from '../utils/auth.ts';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_ROLES,
  INITIAL_BOOKINGS,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData.ts';

interface AppContextType {
  // Locale state
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  toggleLanguage: () => void;

  // Real-time Notifications & Toasts
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id' | 'timestamp'>) => void;
  dismissToast: (id: string) => void;

  // Domain state
  departments: Department[];
  employees: Employee[];
  bookings: MeetingBooking[];
  roles: Role[];
  companySettings: CompanySettings;
  auditLogs: AuditLog[];
  currentUser: Employee | null;
  activeView: 'public' | 'booking' | 'admin';
  adminSection: 'overview' | 'employees' | 'roles' | 'departments' | 'calendar' | 'cms' | 'reports' | 'logs';
  selectedManagerForBooking: Employee | null;
  preselectedDepartmentId: string | null;
  selectedProfileEmployee: Employee | null;

  // View state handlers
  setActiveView: (view: 'public' | 'booking' | 'admin') => void;
  setAdminSection: (section: 'overview' | 'employees' | 'roles' | 'departments' | 'calendar' | 'cms' | 'reports' | 'logs') => void;
  startBookingWithManager: (manager: Employee) => void;
  startBookingWithDepartment: (deptId: string) => void;
  setSelectedProfileEmployee: (emp: Employee | null) => void;

  // Auth / Session & Modal
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: (options?: { returnView?: 'public' | 'booking' | 'admin' }) => void;
  closeLoginModal: () => void;
  login: (credentials: LoginCredentials) => { success: boolean; error?: string; errorAr?: string };
  logout: () => void;
  setCurrentUser: (emp: Employee | null) => void;
  switchRoleUser: (roleId: string) => void;

  // Departments actions
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Employees actions
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  resetEmployeePassword: (id: string) => string;

  // Bookings actions
  addBooking: (booking: Omit<MeetingBooking, 'id' | 'createdAt'>) => MeetingBooking;
  updateBookingStatus: (id: string, status: MeetingStatus, notes?: string) => void;
  rescheduleBooking: (id: string, date: string, startTime: string, endTime: string) => void;
  cancelBooking: (id: string, reason?: string) => void;

  // Roles actions
  updateRolePermissions: (roleId: string, permissions: string[]) => void;
  addRole: (role: Omit<Role, 'id'>) => void;

  // CMS Settings actions
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;

  // Audit Logs
  addAuditLog: (action: string, target: string, details: string) => void;

  // Permission helper for currentUser
  hasUserPermission: (permissionKey: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language state - defaults to Arabic ('ar') as requested (+حول اللغه الي العربيه)
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('hh_language');
    return saved === 'en' ? 'en' : 'ar';
  });

  // Local storage cache keys with fallback to initial data
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('hh_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('hh_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [bookings, setBookings] = useState<MeetingBooking[]>(() => {
    const saved = localStorage.getItem('hh_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('hh_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('hh_company_settings');
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_SETTINGS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('hh_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('hh_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Toasts state (transient in-memory)
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Default logged in as Dr. Sultan Al-Ghamdi (Super Admin)
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const savedUserId = localStorage.getItem('hh_current_user_id');
    if (savedUserId === 'guest') return null;
    if (savedUserId) {
      const found = employees.find((e) => e.id === savedUserId);
      if (found) return found;
    }
    return employees.find((e) => e.roleId === 'super-admin') || employees[0] || null;
  });

  const isAuthenticated = currentUser !== null;

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginReturnView, setLoginReturnView] = useState<'public' | 'booking' | 'admin' | null>(null);

  const openLoginModal = (options?: { returnView?: 'public' | 'booking' | 'admin' }) => {
    if (options?.returnView) {
      setLoginReturnView(options.returnView);
    }
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginReturnView(null);
  };

  const [activeView, setActiveView] = useState<'public' | 'booking' | 'admin'>('public');
  const [adminSection, setAdminSection] = useState<'overview' | 'employees' | 'roles' | 'departments' | 'calendar' | 'cms' | 'reports' | 'logs'>('overview');
  const [selectedManagerForBooking, setSelectedManagerForBooking] = useState<Employee | null>(null);
  const [preselectedDepartmentId, setPreselectedDepartmentId] = useState<string | null>(null);
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<Employee | null>(null);

  // Sync language and DOM direction (RTL / LTR)
  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('hh_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hh_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('hh_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hh_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('hh_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('hh_company_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('hh_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('hh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Toast actions
  const showToast = (toastData: Omit<ToastItem, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      ...toastData,
      id,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 visible toasts

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Notification actions
  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Also show toast alert
    showToast({
      type: notifData.type === 'approved' ? 'success' : notifData.type === 'cancelled' || notifData.type === 'rejected' ? 'warning' : 'info',
      title: language === 'ar' ? notifData.titleAr : notifData.title,
      message: language === 'ar' ? notifData.messageAr : notifData.message,
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser ? currentUser.name : 'System Visitor',
      actorEmail: currentUser ? currentUser.email : 'public@guest.sa',
      action,
      target,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const startBookingWithManager = (manager: Employee) => {
    setSelectedManagerForBooking(manager);
    setPreselectedDepartmentId(manager.departmentId);
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBookingWithDepartment = (deptId: string) => {
    setPreselectedDepartmentId(deptId);
    const deptHead = employees.find((e) => e.departmentId === deptId && e.isExecutive);
    setSelectedManagerForBooking(deptHead || null);
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRoleUser = (roleId: string) => {
    const userForRole = employees.find((e) => e.roleId === roleId);
    if (userForRole) {
      setCurrentUser(userForRole);
      localStorage.setItem('hh_current_user_id', userForRole.id);
      addAuditLog('ROLE_SWITCH', `User: ${userForRole.name}`, `Switched current session to role: ${roleId}`);
      showToast({
        type: 'info',
        title: language === 'ar' ? 'تم تبديل هوية الدور' : 'Role Identity Switched',
        message: language === 'ar' ? `أنت تتصفح الآن بصفتك: ${userForRole.name}` : `Currently simulating: ${userForRole.name}`,
      });
    }
  };

  const login = (credentials: LoginCredentials) => {
    const result = authenticateUser(credentials, employees);
    if (!result.success || !result.user) {
      showToast({
        type: 'error',
        title: language === 'ar' ? 'فشل تسجيل الدخول' : 'Authentication Failed',
        message: language === 'ar' ? (result.errorAr || 'بيانات الدخول غير صحيحة') : (result.error || 'Invalid credentials'),
      });
      return result;
    }

    setCurrentUser(result.user);
    localStorage.setItem('hh_current_user_id', result.user.id);
    addAuditLog('USER_LOGIN', result.user.name, `Successful login for ${result.user.email} (${result.user.roleId})`);

    showToast({
      type: 'success',
      title: language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Authentication Successful',
      message: language === 'ar'
        ? `مرحباً بك، ${result.user.nameAr || result.user.name}`
        : `Welcome, ${result.user.name}`,
    });

    closeLoginModal();

    if (loginReturnView) {
      setActiveView(loginReturnView);
      setLoginReturnView(null);
    }

    return { success: true };
  };

  const logout = () => {
    const prev = currentUser;
    setCurrentUser(null);
    localStorage.setItem('hh_current_user_id', 'guest');
    if (prev) {
      addAuditLog('USER_LOGOUT', prev.name, `User signed out from executive session`);
    }
    if (activeView === 'admin') {
      setActiveView('public');
    }
    showToast({
      type: 'info',
      title: language === 'ar' ? 'تم تسجيل الخروج' : 'Signed Out',
      message: language === 'ar' ? 'تم إنهاء الجلسة التنفيذية بنجاح' : 'Executive session ended successfully',
    });
  };

  const hasUserPermission = (permissionKey: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.roleId === 'super-admin') return true;
    const userRole = roles.find((r) => r.id === currentUser.roleId);
    if (!userRole) return false;
    return userRole.permissions.includes(permissionKey);
  };

  // Department actions
  const addDepartment = (deptData: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
    };
    setDepartments((prev) => [...prev, newDept]);
    addAuditLog('CREATE_DEPARTMENT', newDept.nameEn, `Created new department: ${newDept.nameEn} (${newDept.code})`);
    showToast({
      type: 'success',
      title: language === 'ar' ? 'تم إضافة قطاع جديد' : 'New Department Created',
      message: language === 'ar' ? `${newDept.nameAr} (${newDept.code})` : `${newDept.nameEn} (${newDept.code})`,
    });
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
    addAuditLog('UPDATE_DEPARTMENT', id, `Updated department parameters.`);
    showToast({
      type: 'info',
      title: language === 'ar' ? 'تم تحديث بيانات القطاع' : 'Department Updated',
      message: language === 'ar' ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully',
    });
  };

  const deleteDepartment = (id: string) => {
    const target = departments.find((d) => d.id === id);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('DELETE_DEPARTMENT', target ? target.nameEn : id, `Department removed.`);
    showToast({
      type: 'warning',
      title: language === 'ar' ? 'تم حذف القطاع' : 'Department Deleted',
      message: target ? target.nameAr : id,
    });
  };

  // Employee actions
  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
    addAuditLog('CREATE_EMPLOYEE', newEmp.name, `Added employee ${newEmp.name} to ${newEmp.departmentId}.`);
    showToast({
      type: 'success',
      title: language === 'ar' ? 'تم إضافة موظف جديد' : 'New Employee Account Created',
      message: `${newEmp.name} (${newEmp.title})`,
    });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
    addAuditLog('UPDATE_EMPLOYEE', id, `Profile information modified.`);
    showToast({
      type: 'info',
      title: language === 'ar' ? 'تم تحديث بيانات الموظف' : 'Employee Profile Updated',
      message: language === 'ar' ? 'تم تطبيق إعدادات الجدول والملف الشخصي' : 'Schedule & profile updated',
    });
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('DELETE_EMPLOYEE', target ? target.name : id, `Employee account terminated.`);
    showToast({
      type: 'warning',
      title: language === 'ar' ? 'تم حذف الحساب' : 'Account Terminated',
      message: target ? target.name : id,
    });
  };

  const resetEmployeePassword = (id: string): string => {
    const tempPassword = `HH-${Math.random().toString(36).slice(-8)}!`;
    addAuditLog('RESET_PASSWORD', id, `Temporary password issued for account.`);
    showToast({
      type: 'info',
      title: language === 'ar' ? 'تم إصدار كلمة مرور مؤقتة' : 'Temporary Password Generated',
      message: language === 'ar' ? 'تم نسخ بيانات الاعتماد للموظف' : 'Credentials ready for employee',
    });
    return tempPassword;
  };

  // Booking actions
  const addBooking = (bookingData: Omit<MeetingBooking, 'id' | 'createdAt'>): MeetingBooking => {
    const newBooking: MeetingBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    addAuditLog('NEW_BOOKING', newBooking.referenceNumber, `Booked with manager: ${newBooking.managerId} on ${newBooking.date} at ${newBooking.startTime}`);

    const manager = employees.find((e) => e.id === newBooking.managerId);

    // Trigger Real-time Notification
    addNotification({
      title: `New Executive Meeting: ${newBooking.referenceNumber}`,
      titleAr: `طلب موعد تنفيذي جديد: ${newBooking.referenceNumber}`,
      message: `${newBooking.attendeeName} booked a meeting with ${manager?.name || 'Executive'} on ${newBooking.date} at ${newBooking.startTime}.`,
      messageAr: `حجز ${newBooking.attendeeName} موعداً مع ${manager?.nameAr || 'القيادة التنفيذية'} بتاريخ ${newBooking.date} الساعة ${newBooking.startTime}.`,
      type: 'new_booking',
      referenceNumber: newBooking.referenceNumber,
      bookingId: newBooking.id,
    });

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: MeetingStatus, notes?: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status, notes: notes !== undefined ? notes : b.notes, updatedAt: new Date().toISOString() }
          : b
      )
    );
    addAuditLog('UPDATE_BOOKING_STATUS', id, `Status updated to ${status}. Notes: ${notes || 'none'}`);

    if (booking) {
      if (status === 'confirmed') {
        addNotification({
          title: `Meeting Confirmed: ${booking.referenceNumber}`,
          titleAr: `تم اعتماد الموعد: ${booking.referenceNumber}`,
          message: `The meeting with ${booking.attendeeName} on ${booking.date} at ${booking.startTime} is now confirmed.`,
          messageAr: `تمت الموافقة على الموعد الخاص بـ ${booking.attendeeName} بتاريخ ${booking.date} الساعة ${booking.startTime}.`,
          type: 'approved',
          referenceNumber: booking.referenceNumber,
          bookingId: booking.id,
        });
      } else if (status === 'cancelled') {
        addNotification({
          title: `Meeting Cancelled: ${booking.referenceNumber}`,
          titleAr: `تم إلغاء الموعد: ${booking.referenceNumber}`,
          message: `The meeting with ${booking.attendeeName} has been cancelled.`,
          messageAr: `تم إلغاء الموعد الخاص بـ ${booking.attendeeName} (${booking.referenceNumber}).`,
          type: 'cancelled',
          referenceNumber: booking.referenceNumber,
          bookingId: booking.id,
        });
      }
    }
  };

  const rescheduleBooking = (id: string, date: string, startTime: string, endTime: string) => {
    const booking = bookings.find((b) => b.id === id);
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              date,
              startTime,
              endTime,
              status: 'rescheduled',
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );
    addAuditLog('RESCHEDULE_BOOKING', id, `Rescheduled to ${date} from ${startTime} to ${endTime}`);

    if (booking) {
      addNotification({
        title: `Meeting Rescheduled: ${booking.referenceNumber}`,
        titleAr: `تمت إعادة جدولة الموعد: ${booking.referenceNumber}`,
        message: `Meeting updated to ${date} at ${startTime} - ${endTime}.`,
        messageAr: `تم تعديل الموعد إلى تاريخ ${date} في تمام الساعة ${startTime} حتى ${endTime}.`,
        type: 'rescheduled',
        referenceNumber: booking.referenceNumber,
        bookingId: booking.id,
      });
    }
  };

  const cancelBooking = (id: string, reason?: string) => {
    updateBookingStatus(id, 'cancelled', reason);
  };

  // Role actions
  const updateRolePermissions = (roleId: string, permissions: string[]) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions } : r))
    );
    addAuditLog('UPDATE_ROLE_PERMISSIONS', roleId, `Permissions updated (${permissions.length} total granted)`);
    showToast({
      type: 'success',
      title: language === 'ar' ? 'تم تحديث مصفوفة الصلاحيات' : 'Role Permissions Updated',
      message: language === 'ar' ? `تم اعتماد ${permissions.length} صلاحية بنجاح` : `${permissions.length} permissions active`,
    });
  };

  const addRole = (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
    };
    setRoles((prev) => [...prev, newRole]);
    addAuditLog('CREATE_ROLE', newRole.name, `New custom role created.`);
    showToast({
      type: 'success',
      title: language === 'ar' ? 'تم إنشاء دور تنظيمي جديد' : 'New Role Created',
      message: newRole.name,
    });
  };

  // CMS Settings
  const updateCompanySettings = (updates: Partial<CompanySettings>) => {
    setCompanySettings((prev) => ({ ...prev, ...updates }));
    addAuditLog('UPDATE_CMS_SETTINGS', 'Company Settings', `Website and hero content updated.`);
    showToast({
      type: 'success',
      title: language === 'ar' ? 'تم نشر التعديلات بنجاح' : 'CMS Content Published',
      message: language === 'ar' ? 'الموقع يعرض الآن النصوص والبيانات المحدثة' : 'Live portal updated with new copy and assets',
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        toasts,
        showToast,
        dismissToast,
        departments,
        employees,
        bookings,
        roles,
        companySettings,
        auditLogs,
        currentUser,
        isAuthenticated,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        activeView,
        adminSection,
        selectedManagerForBooking,
        preselectedDepartmentId,
        selectedProfileEmployee,
        setActiveView,
        setAdminSection,
        startBookingWithManager,
        startBookingWithDepartment,
        setSelectedProfileEmployee,
        setCurrentUser,
        switchRoleUser,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        resetEmployeePassword,
        addBooking,
        updateBookingStatus,
        rescheduleBooking,
        cancelBooking,
        updateRolePermissions,
        addRole,
        updateCompanySettings,
        addAuditLog,
        hasUserPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
