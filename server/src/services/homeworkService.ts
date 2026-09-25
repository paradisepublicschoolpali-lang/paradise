import { db, DbHomework, DbHomeworkSubmission } from '../database';

export class HomeworkService {
  static getForClass(grade: string, section: string) {
    return db.homework.filter(h => h.grade === grade && h.section === section);
  }

  static create(data: Omit<DbHomework, 'id' | 'assignedDate'>) {
    const newHw: DbHomework = {
      ...data,
      id: `hw-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0]
    };
    db.homework.push(newHw);
    return newHw;
  }

  static submitHomework(
    homeworkId: string,
    studentId: string,
    submissionUrl?: string,
    notes?: string
  ) {
    const hw = db.homework.find(h => h.id === homeworkId);
    if (!hw) throw new Error('Homework task not found');

    const student = db.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const existingIdx = db.submissions.findIndex(
      s => s.homeworkId === homeworkId && s.studentId === studentId
    );

    const submission: DbHomeworkSubmission = {
      id: existingIdx !== -1 ? db.submissions[existingIdx].id : `sub-${Date.now()}`,
      homeworkId,
      studentId,
      studentName: student.name,
      submittedAt: new Date().toISOString(),
      submissionUrl,
      notes,
      status: 'SUBMITTED'
    };

    if (existingIdx !== -1) {
      db.submissions[existingIdx] = submission;
    } else {
      db.submissions.push(submission);
    }

    return submission;
  }

  static gradeSubmission(
    submissionId: string,
    marksObtained: number,
    feedback: string
  ) {
    const sub = db.submissions.find(s => s.id === submissionId);
    if (!sub) throw new Error('Submission not found');

    sub.marksObtained = marksObtained;
    sub.feedback = feedback;
    sub.status = 'GRADED';
    return sub;
  }

  static getSubmissionsForHomework(homeworkId: string) {
    return db.submissions.filter(s => s.homeworkId === homeworkId);
  }
}
