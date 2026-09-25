import { db, DbStudent } from '../database';

export class StudentService {
  static getAll(filters?: { grade?: string; section?: string; search?: string }) {
    let result = [...db.students];

    if (filters?.grade) {
      result = result.filter(s => s.grade === filters.grade);
    }
    if (filters?.section) {
      result = result.filter(s => s.section === filters.section);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q)
      );
    }

    return result;
  }

  static getById(id: string) {
    const student = db.students.find(s => s.id === id);
    if (!student) throw new Error('Student not found');
    return student;
  }

  static create(data: Omit<DbStudent, 'id' | 'attendanceRate' | 'gpa' | 'feeStatus'>) {
    const newStudent: DbStudent = {
      ...data,
      id: `std-${Date.now()}`,
      attendanceRate: 100.0,
      gpa: 0.0,
      feeStatus: 'PENDING'
    };
    db.students.push(newStudent);
    return newStudent;
  }

  static update(id: string, updates: Partial<DbStudent>) {
    const idx = db.students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found');
    db.students[idx] = { ...db.students[idx], ...updates };
    return db.students[idx];
  }
}
