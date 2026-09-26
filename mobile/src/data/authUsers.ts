import { MobileUser } from '../types';

export const MOBILE_DEMO_USERS: Record<string, MobileUser> = {
  parent: {
    id: 'usr-par-1',
    loginId: 'vikram.sharma',
    name: 'Mr. Vikram Sharma',
    email: 'vikram.sharma@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    grade: 'Aryan (Class 8-A) & Anvi (Class 1-A)',
    phone: '+91 98290 34567'
  },
  teacher: {
    id: 'usr-tch-1',
    loginId: 'sunita.science',
    name: 'Mrs. Sunita Verma',
    email: 's.verma@paradiseschool.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    designation: 'HOD Science & Class Teacher 8-A',
    grade: 'Class 8-A, Class 7-B',
    phone: '+91 98110 23456'
  },
  admin: {
    id: 'usr-adm-1',
    loginId: 'admin',
    name: 'Dr. Renu Gupta',
    email: 'principal@paradiseschool.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=300',
    designation: 'Principal & Head of Institution',
    phone: '+91 2932 224567'
  },
  guest: {
    id: 'usr-gst-1',
    loginId: 'guest',
    name: 'Guest Visitor',
    email: 'visitor@paradiseschool.edu',
    role: 'guest',
    designation: 'Prospective Parent / Visitor'
  }
};

export const DEMO_CREDENTIALS = [
  { role: 'parent', label: 'Parent Portal', id: 'vikram.sharma', pass: 'parent123', desc: 'Monitor Aryan (8-A) & Anvi (1-A)' },
  { role: 'teacher', label: 'Teacher Portal', id: 'sunita.science', pass: 'teacher123', desc: 'Class 8-A attendance & homework' },
  { role: 'admin', label: 'Admin Portal', id: 'admin', pass: 'admin123', desc: 'Full ERP oversight & school metrics' },
];
