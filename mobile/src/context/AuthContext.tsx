import React, { createContext, useContext, useState, useCallback } from 'react';
import { MobileUser, UserRole } from '../types';
import { MOBILE_DEMO_USERS } from '../data/authUsers';
import { mobileApiService } from '../services/apiService';

interface AuthContextType {
  currentUser: MobileUser;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (loginId: string, password: string, targetRole?: UserRole) => Promise<{ success: boolean; error?: string }>;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to parent so user sees the rich school app immediately or can log in
  const [currentUser, setCurrentUser] = useState<MobileUser>(MOBILE_DEMO_USERS.parent);
  const [role, setRole] = useState<UserRole>('parent');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (
    loginId: string,
    password: string,
    targetRole?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    const cleanId = loginId.trim().toLowerCase();

    try {
      // 1. Attempt live API login with port 5000 backend
      const isOnline = await mobileApiService.isBackendAvailable();
      if (isOnline) {
        try {
          const res = await mobileApiService.login(cleanId, password);
          if (res.success && res.user) {
            const mappedRole: UserRole =
              res.user.role === 'SUPER_ADMIN' || res.user.role === 'SCHOOL_ADMIN'
                ? 'admin'
                : res.user.role === 'TEACHER'
                ? 'teacher'
                : 'parent';

            const userObj: MobileUser = {
              id: res.user.id,
              loginId: res.user.loginId,
              name: res.user.name,
              email: res.user.email,
              role: mappedRole,
              avatar: res.user.avatarUrl,
              designation: res.user.designation || undefined,
              phone: res.user.phone
            };

            setCurrentUser(userObj);
            setRole(mappedRole);
            setIsAuthenticated(true);
            setIsLoading(false);
            return { success: true };
          }
        } catch {
          // Fall through to local verification if network / server throws
        }
      }

      // 2. Offline / Demo credentials validation
      let matchedUser: MobileUser | null = null;
      let detectedRole: UserRole = targetRole || 'parent';

      if (cleanId === 'admin' || cleanId.includes('principal') || cleanId.includes('renu')) {
        if (password === 'admin123' || password === 'renugupta@19' || password === 'admin') {
          matchedUser = MOBILE_DEMO_USERS.admin;
          detectedRole = 'admin';
        }
      } else if (cleanId.includes('sunita') || cleanId.includes('teacher') || cleanId.includes('rajesh')) {
        if (password === 'teacher123' || password === 'teacher') {
          matchedUser = MOBILE_DEMO_USERS.teacher;
          detectedRole = 'teacher';
        }
      } else if (cleanId.includes('vikram') || cleanId.includes('parent') || cleanId.includes('aryan') || cleanId.includes('sharma')) {
        if (password === 'parent123' || password === 'parent' || password === 'student123') {
          matchedUser = MOBILE_DEMO_USERS.parent;
          detectedRole = 'parent';
        }
      } else if (targetRole && MOBILE_DEMO_USERS[targetRole]) {
        // Allow role selection fallback
        matchedUser = MOBILE_DEMO_USERS[targetRole];
        detectedRole = targetRole;
      }

      if (matchedUser) {
        setCurrentUser(matchedUser);
        setRole(detectedRole);
        setIsAuthenticated(true);
        setIsLoading(false);
        return { success: true };
      }

      const errMsg = 'Invalid credentials. Try: admin/admin123, sunita.science/teacher123, or vikram.sharma/parent123';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    } catch (e: any) {
      const errMsg = e.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
  }, []);

  const quickLogin = useCallback((newRole: UserRole) => {
    const demo = MOBILE_DEMO_USERS[newRole] || MOBILE_DEMO_USERS.parent;
    setCurrentUser(demo);
    setRole(newRole);
    setIsAuthenticated(newRole !== 'guest');
    setError(null);
  }, []);

  const logout = useCallback(() => {
    mobileApiService.clearToken();
    setIsAuthenticated(false);
    setCurrentUser(MOBILE_DEMO_USERS.guest);
    setRole('guest');
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isLoading,
        error,
        login,
        quickLogin,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
