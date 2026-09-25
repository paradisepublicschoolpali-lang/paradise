import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database';
import { config } from '../config';

export class AuthService {
  static async login(identifier: string, password: string) {
    const cleanId = identifier.trim().toLowerCase();

    const user = db.users.find(
      u =>
        u.loginId.toLowerCase() === cleanId ||
        u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, ''))
    );

    if (!user || !user.isActive) {
      throw new Error('Invalid credentials or account deactivated.');
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials.');
    }

    // Role-specific redirect mapping
    let redirectUrl = '/';
    if (user.role === 'SUPER_ADMIN' || user.role === 'SCHOOL_ADMIN') {
      redirectUrl = '/admin/dashboard';
    } else if (user.role === 'TEACHER') {
      redirectUrl = '/teacher/dashboard';
    } else if (user.role === 'ACCOUNTANT') {
      redirectUrl = '/admin/fees';
    } else if (user.role === 'PARENT') {
      redirectUrl = '/parent/dashboard';
    } else if (user.role === 'STUDENT') {
      redirectUrl = '/student/dashboard';
    }

    const payload = {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, config.refreshTokenSecret, { expiresIn: '30d' });

    // Link profile data if student or parent
    let profileData: any = null;
    if (user.role === 'STUDENT') {
      profileData = db.students.find(s => s.userId === user.id);
    } else if (user.role === 'PARENT') {
      const parent = db.parents.find(p => p.userId === user.id);
      if (parent) {
        const children = db.students.filter(s => parent.childIds.includes(s.id));
        profileData = { ...parent, children };
      }
    } else if (user.role === 'TEACHER') {
      profileData = db.teachers.find(t => t.userId === user.id);
    }

    return {
      success: true,
      token,
      refreshToken,
      user: {
        ...payload,
        avatarUrl: user.avatarUrl,
        profile: profileData
      },
      redirectUrl
    };
  }

  static async getCurrentUser(userId: string) {
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error('User session not found.');

    let profileData: any = null;
    if (user.role === 'STUDENT') {
      profileData = db.students.find(s => s.userId === user.id);
    } else if (user.role === 'PARENT') {
      const parent = db.parents.find(p => p.userId === user.id);
      if (parent) {
        const children = db.students.filter(s => parent.childIds.includes(s.id));
        profileData = { ...parent, children };
      }
    } else if (user.role === 'TEACHER') {
      profileData = db.teachers.find(t => t.userId === user.id);
    }

    return {
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      profile: profileData
    };
  }
}
