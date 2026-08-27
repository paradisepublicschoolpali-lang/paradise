import React, { useState } from 'react';
import { FeeItem } from '../../types';
import { Modal } from './Modal';
import { formatCurrency } from '../../utils/helpers';
import { CreditCard, QrCode, Building2, CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';

interface PaymentModalProps {
  feeItem: FeeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ feeItem, isOpen, onClose }) => {
  const { payFeeInvoice } = useSchoolData();
  const { toast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [cardNumber, setCardNumber] = useState('5123 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('VIKRAM SHARMA');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<FeeItem | null>(null);

  if (!feeItem) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      const methodLabel = paymentMethod === 'card' ? 'Debit / Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking';
      payFeeInvoice(feeItem.id, methodLabel as any);
      
      setReceiptData({
        ...feeItem,
        status: 'Paid',
        paidAmount: feeItem.totalAmount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: methodLabel as any,
        transactionId: `TXN-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#3B82F6', '#1E40AF', '#10B981']
      });

      toast('Payment Successful!', `Fee Invoice ${feeItem.invoiceNo} paid in full (${formatCurrency(feeItem.totalAmount)})`, 'success');
    }, 1200);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSuccess ? 'Official Fee Receipt' : 'Online Fee Payment'}
      subtitle={isSuccess ? `Official Tax Receipt for ${feeItem.term}` : 'Secure 256-Bit Encrypted School Gateway'}
      maxWidth="2xl"
    >
      {isSuccess && receiptData ? (
        <div className="space-y-5 text-xs">
          {/* Success Banner */}
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-emerald-950 font-cinzel">Payment Confirmed & Settled</h4>
            <p className="text-xs text-emerald-800">
              Your transaction has been verified and settled with Paradise Public School Treasury Account.
            </p>
            <div className="pt-2 font-mono text-xs text-emerald-900 font-bold">
              Transaction Ref: {receiptData.transactionId}
            </div>
          </div>

          {/* Receipt Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <div>
                <strong className="text-slate-900 text-sm">Paradise Public School</strong>
                <p className="text-slate-500 text-[11px]">CBSE Affiliation No: 2130842 • Tuition Fee Receipt</p>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-slate-800">{receiptData.invoiceNo}</span>
                <p className="text-slate-500 text-[10px]">{receiptData.paymentDate}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-slate-700">
              <div className="flex justify-between"><span>Scholar Name:</span> <strong className="text-slate-900">{receiptData.studentName}</strong></div>
              <div className="flex justify-between"><span>Class & Section:</span> <strong className="text-slate-900">{receiptData.grade}</strong></div>
              <div className="flex justify-between"><span>Billing Term:</span> <strong className="text-slate-900">{receiptData.term}</strong></div>
              <div className="flex justify-between"><span>Payment Channel:</span> <strong className="text-blue-700">{receiptData.paymentMethod}</strong></div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Tuition Amount Settled:</span>
                <span className="text-blue-700 font-mono">{formatCurrency(receiptData.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Print Fee Receipt</span>
            </button>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 text-xs">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Due Term:</span>
              <strong className="text-sm text-slate-900 font-cinzel">{feeItem.term} ({feeItem.studentName})</strong>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Amount Payable:</span>
              <span className="text-xl font-bold font-mono text-blue-700">{formatCurrency(feeItem.totalAmount)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold">Select Indian Payment Mode:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5 text-blue-600" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>RuPay / Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'netbanking'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Method Form Details */}
          {paymentMethod === 'upi' && (
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-32 h-32 mx-auto bg-white p-2 border border-slate-300 rounded-xl flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Scan using <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or <strong>BHIM UPI</strong> app
              </p>
              <div className="text-[11px] text-slate-500 font-mono">UPI ID: paradiseschool@sbi</div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Card Number (RuPay / Visa / Mastercard)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-slate-700 font-semibold">Select Bank Account:</label>
              <select
                value={selectedBank}
                onChange={e => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium"
              >
                <option>State Bank of India (SBI)</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Punjab National Bank (PNB)</option>
                <option>Kotak Mahindra Bank</option>
                <option>Bank of Baroda</option>
              </select>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md"
            >
              {isProcessing ? (
                <span>Securing Transaction with Bank...</span>
              ) : (
                <>
                  <span>Pay {formatCurrency(feeItem.totalAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
