import { db, DbFeeInvoice } from '../database';

export class FeeService {
  static getAllInvoices(filters?: { grade?: string; status?: DbFeeInvoice['status'] }) {
    let result = [...db.feeInvoices];
    if (filters?.grade) {
      result = result.filter(i => i.grade === filters.grade);
    }
    if (filters?.status) {
      result = result.filter(i => i.status === filters.status);
    }
    return result;
  }

  static getInvoicesForStudent(studentId: string) {
    return db.feeInvoices.filter(i => i.studentId === studentId);
  }

  static getSummary() {
    let totalExpected = 0;
    let totalCollected = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const today = new Date().toISOString().split('T')[0];

    for (const inv of db.feeInvoices) {
      const net = Math.max(0, inv.amount - inv.discount);
      totalExpected += net;
      totalCollected += inv.paidAmount;

      if (inv.paidAmount < net) {
        if (today > inv.dueDate) {
          overdueCount++;
        } else {
          pendingCount++;
        }
      }
    }

    return {
      totalExpected,
      totalCollected,
      totalPending: Math.max(0, totalExpected - totalCollected),
      pendingCount,
      overdueCount
    };
  }

  static recordPayment(
    invoiceId: string,
    amount: number,
    method: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'CHEQUE',
    transactionId?: string
  ) {
    const inv = db.feeInvoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('Invoice not found');

    const net = Math.max(0, inv.amount - inv.discount);
    const balance = net - inv.paidAmount;

    if (amount <= 0 || amount > balance) {
      throw new Error(`Invalid payment amount. Maximum balance payable is ₹${balance}.`);
    }

    const receiptNo = `REC-${Date.now().toString().slice(-6)}`;
    const payment = {
      id: `pay-${Date.now()}`,
      amount,
      date: new Date().toISOString().split('T')[0],
      method,
      transactionId: transactionId || `TXN-${Date.now()}`,
      receiptNo
    };

    inv.payments.push(payment);
    inv.paidAmount += amount;

    if (inv.paidAmount >= net) {
      inv.status = 'PAID';
    } else {
      inv.status = 'PARTIAL';
    }

    // Sync student fee status
    const student = db.students.find(s => s.id === inv.studentId);
    if (student) {
      student.feeStatus = inv.status;
    }

    return { success: true, payment, invoice: inv };
  }
}
