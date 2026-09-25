import { db } from '../database';

export class ReportService {
  static getAttendanceSummaryReport(grade?: string) {
    let students = [...db.students];
    if (grade) students = students.filter(s => s.grade === grade);

    return students.map(s => {
      const logs = db.attendance.filter(a => a.studentId === s.id);
      const total = logs.length;
      const present = logs.filter(a => a.status === 'PRESENT').length;
      const absent = logs.filter(a => a.status === 'ABSENT').length;
      const late = logs.filter(a => a.status === 'LATE').length;

      return {
        studentId: s.id,
        name: s.name,
        admissionNo: s.admissionNo,
        grade: s.grade,
        section: s.section,
        totalWorkingDays: total,
        present,
        absent,
        late,
        attendancePercentage: s.attendanceRate
      };
    });
  }

  static getFeeCollectionReport() {
    return db.feeInvoices.map(inv => ({
      invoiceNo: inv.invoiceNo,
      studentName: inv.studentName,
      grade: `${inv.grade}-${inv.section}`,
      term: inv.term,
      dueDate: inv.dueDate,
      totalAmount: inv.amount,
      discount: inv.discount,
      paidAmount: inv.paidAmount,
      balanceDue: Math.max(0, inv.amount - inv.discount - inv.paidAmount),
      status: inv.status
    }));
  }

  static getStudentRoster(grade?: string, section?: string) {
    let students = [...db.students];
    if (grade) students = students.filter(s => s.grade === grade);
    if (section) students = students.filter(s => s.section === section);

    return students.map(s => ({
      admissionNo: s.admissionNo,
      rollNo: s.rollNo,
      name: s.name,
      grade: s.grade,
      section: s.section,
      gender: s.gender,
      guardianName: s.guardianName,
      guardianPhone: s.guardianPhone,
      feeStatus: s.feeStatus,
      attendanceRate: `${s.attendanceRate}%`,
      gpa: s.gpa
    }));
  }
}
