import { db, DbAdmission } from '../database';

export class AdmissionService {
  static getAll(status?: DbAdmission['status']) {
    if (status) {
      return db.admissions.filter(a => a.status === status);
    }
    return db.admissions;
  }

  static submit(data: Omit<DbAdmission, 'id' | 'applicationNo' | 'submissionDate' | 'status'>) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newApp: DbAdmission = {
      ...data,
      id: `adm-${Date.now()}`,
      applicationNo: `PPS-ADM-2026-${randomNum}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED'
    };
    db.admissions.unshift(newApp);
    return newApp;
  }

  static updateStatus(id: string, status: DbAdmission['status'], notes?: string) {
    const app = db.admissions.find(a => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = status;
    if (notes) app.notes = notes;
    return app;
  }

  static convertToStudent(id: string, rollNo: string, section = 'A') {
    const app = db.admissions.find(a => a.id === id);
    if (!app) throw new Error('Application not found');

    const randomAdmissionNo = `PPS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = {
      id: `std-${Date.now()}`,
      userId: `usr-std-${Date.now()}`,
      admissionNo: randomAdmissionNo,
      rollNo,
      name: app.applicantName,
      grade: app.gradeApplying,
      section,
      dob: app.dob,
      gender: app.gender as any,
      guardianName: app.parentName,
      guardianPhone: app.parentPhone,
      guardianEmail: app.parentEmail,
      address: app.address,
      attendanceRate: 100.0,
      gpa: 0.0,
      feeStatus: 'PENDING' as const
    };

    db.students.push(newStudent);
    app.status = 'ENROLLED';
    return newStudent;
  }
}
