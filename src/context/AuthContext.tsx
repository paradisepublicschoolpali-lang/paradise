import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS, INITIAL_STUDENTS, INITIAL_TEACHERS } from '../data/mockData';

// Admin credentials
const ADMIN_CREDENTIALS = { loginId: 'admin', password: 'renugupta@19' };

interface AuthContextType {
  role: UserRole;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  showGateway: boolean;
  switchRole: (role: UserRole) => void;
  loginAsParent: (loginId: string, password: string) => { success: boolean; error?: string };
  loginAsTeacher: (loginId: string, password: string) => { success: boolean; error?: string };
  loginAsAdmin: (loginId: string, password: string) => { success: boolean; error?: string };
  enterAsGuest: () => void;
  openGateway: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'pps_v1_auth_session';

interface StoredSession {
  role: UserRole;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  showGateway: boolean;
}

const getInitialSession = (): StoredSession => {
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const saved = localStorage.getItem(SESSION_KEY);
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as StoredSession;
      if (rawHash.startsWith('admin')) {
        return { ...parsed, role: 'admin', showGateway: false, isAuthenticated: true, currentUser: parsed.currentUser || DEMO_USERS.admin };
      }
      if (rawHash.startsWith('parent')) {
        return { ...parsed, role: 'parent', showGateway: false, isAuthenticated: true };
      }
      if (rawHash.startsWith('teacher')) {
        return { ...parsed, role: 'teacher', showGateway: false, isAuthenticated: true };
      }
      if (rawHash === 'gateway' || rawHash === 'select') {
        return { ...parsed, showGateway: true };
      }
      return parsed;
    } catch {
      // fallback
    }
  }

  if (rawHash.startsWith('admin')) {
    return { role: 'admin', currentUser: DEMO_USERS.admin, isAuthenticated: true, showGateway: false };
  }
  if (rawHash.startsWith('parent')) {
    return { role: 'parent', currentUser: DEMO_USERS.parent, isAuthenticated: true, showGateway: false };
  }
  if (rawHash.startsWith('teacher')) {
    return { role: 'teacher', currentUser: DEMO_USERS.teacher, isAuthenticated: true, showGateway: false };
  }
  if (!rawHash || rawHash === 'gateway' || rawHash === 'select') {
    return { role: 'guest', currentUser: DEMO_USERS.guest, isAuthenticated: false, showGateway: true };
  }

  return { role: 'guest', currentUser: DEMO_USERS.guest, isAuthenticated: false, showGateway: false };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<StoredSession>(getInitialSession);

  const role = session.role;
  const currentUser = session.currentUser;
  const isAuthenticated = session.isAuthenticated;
  const showGateway = session.showGateway;

  // Persist session to localStorage on any change
  const saveSession = useCallback((newSession: Partial<StoredSession>) => {
    setSession(prev => {
      const updated = { ...prev, ...newSession };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const openGateway = useCallback(() => {
    saveSession({ showGateway: true });
    if (window.location.hash !== '#/gateway') {
      window.history.pushState({ view: 'gateway' }, '', '#/gateway');
    }
  }, [saveSession]);

  const switchRole = useCallback((newRole: UserRole) => {
    saveSession({
      role: newRole,
      currentUser: DEMO_USERS[newRole] || DEMO_USERS.guest,
      showGateway: false,
      isAuthenticated: newRole !== 'guest'
    });
  }, [saveSession]);

  const enterAsGuest = useCallback(() => {
    saveSession({
      role: 'guest',
      currentUser: DEMO_USERS.guest,
      isAuthenticated: false,
      showGateway: false
    });
    if (window.location.hash !== '#/home') {
      window.history.pushState({ role: 'guest', tab: 'home' }, '', '#/home');
    }
  }, [saveSession]);

  const loginAsParent = useCallback((loginId: string, password: string): { success: boolean; error?: string } => {
    const stored = localStorage.getItem('pps_v1_students');
    const students = stored ? JSON.parse(stored) : INITIAL_STUDENTS;

    const student = students.find((s: any) => s.loginId === loginId);
    if (!student) return { success: false, error: 'Student ID not found. Please contact the school admin.' };
    if (student.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

    const parentUser: UserProfile = {
      id: student.id,
      loginId: student.loginId,
      name: `${student.name} (Parent: ${student.guardianName})`,
      email: student.guardianEmail,
      role: 'parent',
      avatar: student.avatar,
      grade: student.grade,
      section: student.section
    };

    saveSession({
      role: 'parent',
      currentUser: parentUser,
      isAuthenticated: true,
      showGateway: false
    });

    if (window.location.hash !== '#/parent/dashboard') {
      window.history.pushState({ role: 'parent', tab: 'dashboard' }, '', '#/parent/dashboard');
    }
    return { success: true };
  }, [saveSession]);

  const loginAsTeacher = useCallback((loginId: string, password: string): { success: boolean; error?: string } => {
    const stored = localStorage.getItem('pps_v1_teachers');
    const teachers = stored ? JSON.parse(stored) : INITIAL_TEACHERS;

    const teacher = teachers.find((t: any) => t.loginId === loginId);
    if (!teacher) return { success: false, error: 'Teacher ID not found. Please contact the admin office.' };
    if (teacher.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

    const teacherUser: UserProfile = {
      id: teacher.id,
      loginId: teacher.loginId,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      avatar: teacher.avatar,
      designation: teacher.designation
    };

    saveSession({
      role: 'teacher',
      currentUser: teacherUser,
      isAuthenticated: true,
      showGateway: false
    });

    if (window.location.hash !== '#/teacher/dashboard') {
      window.history.pushState({ role: 'teacher', tab: 'dashboard' }, '', '#/teacher/dashboard');
    }
    return { success: true };
  }, [saveSession]);

  const loginAsAdmin = useCallback((loginId: string, password: string): { success: boolean; error?: string } => {
    const validIds = ['admin', 'renugupta', 'principal'];
    const storedAdminPass = localStorage.getItem('pps_v1_admin_password') || ADMIN_CREDENTIALS.password;

    if (!validIds.includes(loginId.trim().toLowerCase())) {
      return { success: false, error: 'Admin ID not recognized.' };
    }
    if (password !== storedAdminPass && password !== 'renugupta@19') {
      return { success: false, error: 'Incorrect admin password.' };
    }

    saveSession({
      role: 'admin',
      currentUser: DEMO_USERS.admin,
      isAuthenticated: true,
      showGateway: false
    });

    if (window.location.hash !== '#/admin/dashboard') {
      window.history.pushState({ role: 'admin', tab: 'dashboard' }, '', '#/admin/dashboard');
    }
    return { success: true };
  }, [saveSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    saveSession({
      role: 'guest',
      currentUser: DEMO_USERS.guest,
      isAuthenticated: false,
      showGateway: true
    });
    if (window.location.hash !== '#/gateway') {
      window.history.pushState({ view: 'gateway' }, '', '#/gateway');
    }
  }, [saveSession]);

  return (
    <AuthContext.Provider value={{
      role,
      currentUser,
      isAuthenticated,
      showGateway,
      switchRole,
      loginAsParent,
      loginAsTeacher,
      loginAsAdmin,
      enterAsGuest,
      openGateway,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
