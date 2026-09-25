/**
 * Unified Backend ERP API Service Bridge
 * Connects Web Management Dashboard and Mobile App to the centralized Node.js/PostgreSQL backend on port 5000.
 * Falls back seamlessly to the harmonized local database if the API server is temporarily offline.
 */

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      this.token = localStorage.getItem('pps_v1_jwt_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pps_v1_jwt_token', token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pps_v1_jwt_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    return response.json();
  }

  // Health Check
  async isBackendAvailable(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:5000/health', { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Auth
  async login(loginId: string, password: string) {
    const data = await this.request<{ success: boolean; token: string; user: any; redirectUrl: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ loginId, password })
      }
    );
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  // Students
  async getStudents() {
    return this.request<{ success: boolean; students: any[] }>('/students');
  }

  async getStudentById(id: string) {
    return this.request<{ success: boolean; student: any }>(`/students/${id}`);
  }

  // Attendance
  async getAttendance(params?: { studentId?: string; grade?: string; section?: string; date?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; attendance: any[] }>(`/attendance${query ? `?${query}` : ''}`);
  }

  async recordAttendance(records: { studentId: string; status: string; date: string; remarks?: string }[]) {
    return this.request<{ success: boolean; count: number }>('/attendance', {
      method: 'POST',
      body: JSON.stringify({ records })
    });
  }

  // Timetable
  async getTimetable(params?: { grade?: string; section?: string; teacherId?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; timetable: any[] }>(`/timetable${query ? `?${query}` : ''}`);
  }

  // Homework
  async getHomework(params?: { grade?: string; section?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; homework: any[] }>(`/homework${query ? `?${query}` : ''}`);
  }

  async submitHomework(submission: { homeworkId: string; studentId: string; notes?: string }) {
    return this.request<{ success: boolean; submission: any }>('/homework/submissions', {
      method: 'POST',
      body: JSON.stringify(submission)
    });
  }

  // Exams & Results
  async getExams() {
    return this.request<{ success: boolean; exams: any[] }>('/exams');
  }

  async getResults(params?: { studentId?: string; examId?: string; grade?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; results: any[] }>(`/exams/results${query ? `?${query}` : ''}`);
  }

  // Fees
  async getFees(params?: { studentId?: string; status?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; invoices: any[]; metrics?: any }>(`/fees${query ? `?${query}` : ''}`);
  }

  async recordFeePayment(invoiceId: string, payment: { amount: number; method: string; transactionId?: string }) {
    return this.request<{ success: boolean; invoice: any; payment: any }>(`/fees/${invoiceId}/payments`, {
      method: 'POST',
      body: JSON.stringify(payment)
    });
  }

  // Notices
  async getNotices(params?: { category?: string; targetAudience?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; notices: any[] }>(`/notices${query ? `?${query}` : ''}`);
  }

  // Events
  async getEvents() {
    return this.request<{ success: boolean; events: any[] }>('/events');
  }

  // Admissions
  async submitAdmission(data: any) {
    return this.request<{ success: boolean; admission: any }>('/admissions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export const apiService = new ApiService();
