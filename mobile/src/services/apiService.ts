import { Platform } from 'react-native';

/**
 * Unified Backend ERP API Service for Mobile App
 * Connects to the same centralized Node.js/PostgreSQL backend on port 5000.
 * Automatically resolves emulator localhost (10.0.2.2 for Android emulator) vs web/iOS.
 */

const getApiBaseUrl = () => {
  if (Platform.OS === 'android') {
    // Android emulator alias for host machine localhost
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

class MobileApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
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

  async isBackendAvailable(): Promise<boolean> {
    try {
      const healthUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000/health' : 'http://localhost:5000/health';
      const res = await fetch(healthUrl, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }

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

  async getStudents() {
    return this.request<{ success: boolean; students: any[] }>('/students');
  }

  async getTimetable(params?: { grade?: string; section?: string; teacherId?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; timetable: any[] }>(`/timetable${query ? `?${query}` : ''}`);
  }

  async getAttendance(params?: { studentId?: string; grade?: string; section?: string; date?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; attendance: any[] }>(`/attendance${query ? `?${query}` : ''}`);
  }

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

  async getResults(params?: { studentId?: string; examId?: string; grade?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; results: any[] }>(`/exams/results${query ? `?${query}` : ''}`);
  }

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

  async getNotices(params?: { category?: string; targetAudience?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; notices: any[] }>(`/notices${query ? `?${query}` : ''}`);
  }

  async getEvents() {
    return this.request<{ success: boolean; events: any[] }>('/events');
  }
}

export const mobileApiService = new MobileApiService();
