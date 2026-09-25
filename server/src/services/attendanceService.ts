import { db, DbAttendance } from '../database';

export class AttendanceService {
  static getForClass(grade: string, section: string, date: string) {
    return db.attendance.filter(
      a => a.grade === grade && a.section === section && a.date === date
    );
  }

  static getForStudent(studentId: string) {
    return db.attendance.filter(a => a.studentId === studentId);
  }

  static markClassAttendance(
    grade: string,
    section: string,
    date: string,
    records: { studentId: string; status: DbAttendance['status']; remarks?: string }[],
    recordedBy: string
  ) {
    const updatedEntries: DbAttendance[] = [];

    for (const record of records) {
      const student = db.students.find(s => s.id === record.studentId);
      if (!student) continue;

      const existingIdx = db.attendance.findIndex(
        a => a.studentId === record.studentId && a.date === date
      );

      const entry: DbAttendance = {
        id: existingIdx !== -1 ? db.attendance[existingIdx].id : `att-${Date.now()}-${record.studentId}`,
        studentId: student.id,
        studentName: student.name,
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        grade,
        section,
        date,
        status: record.status,
        remarks: record.remarks,
        recordedBy
      };

      if (existingIdx !== -1) {
        db.attendance[existingIdx] = entry;
      } else {
        db.attendance.push(entry);
      }
      updatedEntries.push(entry);

      // Recalculate student overall attendance rate
      const studentLogs = db.attendance.filter(a => a.studentId === student.id);
      const presents = studentLogs.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      student.attendanceRate = parseFloat(((presents / studentLogs.length) * 100).toFixed(1));
    }

    return updatedEntries;
  }
}
