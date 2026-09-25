import { db, DbTimetableSlot } from '../database';

export class TimetableService {
  static getForClass(grade: string, section: string) {
    return db.timetable.filter(t => t.grade === grade && t.section === section);
  }

  static getForTeacher(teacherId: string) {
    return db.timetable.filter(t => t.teacherId === teacherId);
  }

  static createSlot(slotData: Omit<DbTimetableSlot, 'id'>) {
    // 1. Teacher double-booking check
    const teacherConflict = db.timetable.find(
      s =>
        s.dayOfWeek === slotData.dayOfWeek &&
        s.periodNumber === slotData.periodNumber &&
        s.teacherId === slotData.teacherId
    );
    if (teacherConflict) {
      throw new Error(
        `Teacher Conflict: ${slotData.teacherName} is already assigned to ${teacherConflict.grade}-${teacherConflict.section} during Period ${slotData.periodNumber} on ${slotData.dayOfWeek}.`
      );
    }

    // 2. Room double-booking check
    const roomConflict = db.timetable.find(
      s =>
        s.dayOfWeek === slotData.dayOfWeek &&
        s.periodNumber === slotData.periodNumber &&
        s.room.trim().toLowerCase() === slotData.room.trim().toLowerCase()
    );
    if (roomConflict) {
      throw new Error(
        `Room Conflict: Room ${slotData.room} is already booked by ${roomConflict.grade}-${roomConflict.section} during Period ${slotData.periodNumber}.`
      );
    }

    // 3. Class double-booking check
    const classConflict = db.timetable.find(
      s =>
        s.dayOfWeek === slotData.dayOfWeek &&
        s.periodNumber === slotData.periodNumber &&
        s.grade === slotData.grade &&
        s.section === slotData.section
    );
    if (classConflict) {
      throw new Error(
        `Class Conflict: ${slotData.grade}-${slotData.section} already has ${classConflict.subject} scheduled for Period ${slotData.periodNumber}.`
      );
    }

    const newSlot: DbTimetableSlot = {
      ...slotData,
      id: `tt-${Date.now()}`
    };
    db.timetable.push(newSlot);
    return newSlot;
  }

  static deleteSlot(id: string) {
    const idx = db.timetable.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Timetable slot not found');
    db.timetable.splice(idx, 1);
    return { success: true };
  }
}
