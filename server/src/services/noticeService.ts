import { db, DbNotice } from '../database';

export class NoticeService {
  static getAll(audience?: string, grade?: string) {
    let result = [...db.notices];

    if (audience && audience !== 'ALL') {
      result = result.filter(
        n => n.targetAudience === 'ALL' || n.targetAudience === audience
      );
    }
    if (grade) {
      result = result.filter(n => !n.targetGrade || n.targetGrade === grade);
    }

    return result.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }

  static create(data: Omit<DbNotice, 'id' | 'date'>) {
    const newNotice: DbNotice = {
      ...data,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    db.notices.unshift(newNotice);
    return newNotice;
  }

  static delete(id: string) {
    const idx = db.notices.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Notice not found');
    db.notices.splice(idx, 1);
    return { success: true };
  }
}
