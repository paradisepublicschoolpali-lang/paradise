import { db, DbExam, DbExamResult } from '../database';

export class ExamService {
  static getAllExams() {
    return db.exams;
  }

  static getExamById(id: string) {
    const exam = db.exams.find(e => e.id === id);
    if (!exam) throw new Error('Exam not found');
    return exam;
  }

  static getResultsForStudent(studentId: string) {
    // Only published results can be viewed by students/parents
    return db.results.filter(r => r.studentId === studentId && r.isPublished);
  }

  static getResultsForExam(examId: string) {
    return db.results.filter(r => r.examId === examId);
  }

  static enterStudentMarks(
    examId: string,
    studentId: string,
    subjects: { subject: string; marksObtained: number; remarks?: string }[],
    teacherRemarks?: string
  ) {
    const exam = db.exams.find(e => e.id === examId);
    if (!exam) throw new Error('Exam not found');

    const student = db.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student not found');

    // Bounds checking
    const gradedSubjects = subjects.map(s => {
      const examSubject = exam.subjects.find(sub => sub.subject === s.subject);
      const maxMarks = examSubject ? examSubject.maxMarks : 100;

      if (s.marksObtained < 0 || s.marksObtained > maxMarks) {
        throw new Error(
          `Validation Error: Marks obtained for ${s.subject} (${s.marksObtained}) cannot exceed maximum allowed marks (${maxMarks}) or be negative.`
        );
      }

      const pct = (s.marksObtained / maxMarks) * 100;
      let grade = 'F';
      if (pct >= 91) grade = 'A1';
      else if (pct >= 81) grade = 'A2';
      else if (pct >= 71) grade = 'B1';
      else if (pct >= 61) grade = 'B2';
      else if (pct >= 51) grade = 'C1';
      else if (pct >= 41) grade = 'C2';
      else if (pct >= 33) grade = 'D';

      return {
        subject: s.subject,
        marksObtained: s.marksObtained,
        maxMarks,
        grade,
        remarks: s.remarks
      };
    });

    const totalMarks = gradedSubjects.reduce((acc, curr) => acc + curr.marksObtained, 0);
    const maxTotal = gradedSubjects.reduce((acc, curr) => acc + curr.maxMarks, 0);
    const percentage = parseFloat(((totalMarks / maxTotal) * 100).toFixed(1));
    const gpa = parseFloat((percentage / 10).toFixed(1));

    let overallGrade = 'D';
    if (percentage >= 90) overallGrade = 'A1 (Gold Honors)';
    else if (percentage >= 80) overallGrade = 'A2 (Distinction)';
    else if (percentage >= 70) overallGrade = 'B1 (First Class)';
    else if (percentage >= 60) overallGrade = 'B2 (Second Class)';
    else if (percentage >= 50) overallGrade = 'C1 (Pass)';

    const existingIdx = db.results.findIndex(r => r.examId === examId && r.studentId === studentId);

    const resultEntry: DbExamResult = {
      id: existingIdx !== -1 ? db.results[existingIdx].id : `res-${Date.now()}`,
      examId,
      examName: exam.title,
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      section: student.section,
      subjects: gradedSubjects,
      totalMarks,
      maxTotal,
      percentage,
      gpa,
      overallGrade,
      teacherRemarks,
      isPublished: existingIdx !== -1 ? db.results[existingIdx].isPublished : false
    };

    if (existingIdx !== -1) {
      db.results[existingIdx] = resultEntry;
    } else {
      db.results.push(resultEntry);
    }

    return resultEntry;
  }

  static publishResults(examId: string) {
    const exam = db.exams.find(e => e.id === examId);
    if (!exam) throw new Error('Exam not found');

    const examResults = db.results.filter(r => r.examId === examId);
    // Sort and calculate ranks
    examResults.sort((a, b) => b.percentage - a.percentage);
    examResults.forEach((res, idx) => {
      res.rank = idx + 1;
      res.isPublished = true;
    });

    exam.status = 'PUBLISHED';
    return { success: true, count: examResults.length };
  }
}
