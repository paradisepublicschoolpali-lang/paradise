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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('guest');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.guest);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showGateway, setShowGateway] = useState(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    return !rawHash || rawHash === 'gateway' || rawHash === 'select';
  });

  const openGateway = useCallback(() => {
    setShowGateway(true);
    if (window.location.hash !== '#/gateway') {
      window.history.pushState({ view: 'gateway' }, '', '#/gateway');
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
    setCurrentUser(DEMO_USERS[newRole] || DEMO_USERS.guest);
  }, []);

  const enterAsGuest = useCallback(() => {
    setRole('guest');
    setCurrentUser(DEMO_USERS.guest);
    setIsAuthenticated(false);
    setShowGateway(false);
    if (window.location.hash !== '#/home') {
      window.history.pushState({ role: 'guest', tab: 'home' }, '', '#/home');
    }
  }, []);

  const loginAsParent = useCallback((loginId: string, password: string): { success: boolean; error?: string } => {
    const stored = localStorage.getItem('pps_v1_students');
    const students = stored ? JSON.parse(stored) : INITIAL_STUDENTS;

    const student = students.find((s: any) => s.loginId === loginId);
    if (!student) return { success: false, error: 'Student ID not found. Please contact the school admin.' };
    if (student.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

    setRole('parent');
    setCurrentUser({
      id: student.id,
      loginId: student.loginId,
      name: `${student.name} (Parent: ${student.guardianName})`,
      email: student.guardianEmail,
      role: 'parent',
      avatar: student.avatar,
      grade: student.grade,
      section: student.section
    });
    setIsAuthenticated(true);
    setShowGateway(false);
    if (window.location.hash !== '#/parent/dashboard') {
      window.history.pushState({ role: 'parent', tab: 'dashboard' }, '', '#/parent/dashboard');
    }
    return { success: true };
  }, []);

  const loginAsTeacher = useCallback((loginId: string, password: string): { success: boolean; error?: string } => {
    const stored = localStorage.getItem('pps_v1_teachers');
    const teachers = stored ? JSON.parse(stored) : INITIAL_TEACHERS;

    const teacher = teachers.find((t: any) => t.loginId === loginId);
    if (!teacher) return { success: false, error: 'Teacher ID not found. Please contact the admin office.' };
    if (teacher.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

    setRole('teacher');
    setCurrentUser({
      id: teacher.id,
      loginId: teacher.loginId,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher',
      avatar: teacher.avatar,
      designation: teacher.designation
    });
    setIsAuthenticated(true);
    setShowGateway(false);
    if (window.location.hash !== '#/teacher/dashboard') {
      window.history.pushState({ role: 'teacher', tab: 'dashboard' }, '', '#/teacher/dashboard');
    }
    return { success: true };
  }, []);

  const loginAsAdmin = useCallback((loginId: string, password: string): { success: boolean; error?: string } => {
    const validIds = ['admin', 'renugupta', 'principal'];
    const storedAdminPass = localStorage.getItem('pps_v1_admin_password') || ADMIN_CREDENTIALS.password;

    if (!validIds.includes(loginId.trim().toLowerCase())) {
      return { success: false, error: 'Admin ID not recognized.' };
    }
    if (password !== storedAdminPass && password !== 'renugupta@19') {
      return { success: false, error: 'Incorrect admin password.' };
    }

    setRole('admin');
    setCurrentUser(DEMO_USERS.admin);
    setIsAuthenticated(true);
    setShowGateway(false);
    if (window.location.hash !== '#/admin/dashboard') {
      window.history.pushState({ role: 'admin', tab: 'dashboard' }, '', '#/admin/dashboard');
    }
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setRole('guest');
    setCurrentUser(DEMO_USERS.guest);
    setIsAuthenticated(false);
    setShowGateway(true);
    if (window.location.hash !== '#/gateway') {
      window.history.pushState({ view: 'gateway' }, '', '#/gateway');
    }
  }, []);

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
