import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { ChildSwitcher } from '../components/ChildSwitcher';
import { FeeInvoice } from '../types';

interface FeesScreenProps {
  onBack: () => void;
}

export const FeesScreen: React.FC<FeesScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { activeStudent, fees, payFeeInvoice } = useSchoolData();

  const handlePay = (invoice: FeeInvoice) => {
    const outstanding = invoice.amount - invoice.paidAmount;
    if (outstanding <= 0) return;

    payFeeInvoice(invoice.id, outstanding);
    const msg = `Payment of ₹${outstanding.toLocaleString('en-IN')} for ${invoice.term} completed successfully! Digital receipt generated.`;
    if (Platform.OS === 'web') alert(msg);
    else Alert.alert('Payment Successful', msg);
  };

  const handleDownloadReceipt = (receiptNo: string, amount: number) => {
    const msg = `Official School Fee Receipt #${receiptNo} for ₹${amount.toLocaleString('en-IN')} downloaded to device storage.`;
    if (Platform.OS === 'web') alert(msg);
    else Alert.alert('Receipt Downloaded', msg);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Fee Treasury & Receipts</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Academic Fee Management & Invoices
          </Text>
        </View>
      </View>

      {/* Child Switcher */}
      <ChildSwitcher />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {fees.length === 0 ? (
          <View style={[styles.emptyBox, { backgroundColor: colors.surface }]}>
            <Ionicons name="card-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No invoices found</Text>
          </View>
        ) : (
          fees.map(invoice => {
            const isPaid = invoice.status === 'Paid';
            const outstanding = invoice.amount - invoice.paidAmount;

            return (
              <View
                key={invoice.id}
                style={[styles.invoiceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                {/* Card Top */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.invoiceNo, { color: colors.textMuted }]}>
                      {invoice.invoiceNo}
                    </Text>
                    <Text style={[styles.invoiceTerm, { color: colors.text }]}>{invoice.term}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isPaid ? '#10B98118' : '#F59E0B18',
                        borderColor: isPaid ? '#10B981' : '#F59E0B'
                      }
                    ]}
                  >
                    <Text style={[styles.statusText, { color: isPaid ? '#10B981' : '#D97706' }]}>
                      {isPaid ? 'PAID IN FULL' : 'PAYMENT DUE'}
                    </Text>
                  </View>
                </View>

                {/* Amount Row */}
                <View style={styles.amountRow}>
                  <View>
                    <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Total Invoice</Text>
                    <Text style={[styles.amountValue, { color: colors.text }]}>
                      ₹{invoice.amount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Due Date</Text>
                    <Text style={[styles.dueDateValue, { color: colors.text }]}>{invoice.dueDate}</Text>
                  </View>
                </View>

                {/* Fee Breakdown */}
                <View style={[styles.breakdownBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.breakdownTitle, { color: colors.textMuted }]}>FEE BREAKDOWN</Text>
                  <View style={styles.breakdownRow}>
                    <Text style={[styles.breakdownItem, { color: colors.text }]}>Tuition Fee</Text>
                    <Text style={[styles.breakdownPrice, { color: colors.text }]}>
                      ₹{invoice.breakdown.tuition.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  {invoice.breakdown.laboratory && (
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.breakdownItem, { color: colors.text }]}>Science & STEM Lab</Text>
                      <Text style={[styles.breakdownPrice, { color: colors.text }]}>
                        ₹{invoice.breakdown.laboratory.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  )}
                  {invoice.breakdown.sports && (
                    <View style={styles.breakdownRow}>
                      <Text style={[styles.breakdownItem, { color: colors.text }]}>Sports & Swimming Arena</Text>
                      <Text style={[styles.breakdownPrice, { color: colors.text }]}>
                        ₹{invoice.breakdown.sports.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Pay Action or Payment Receipts */}
                {!isPaid ? (
                  <TouchableOpacity
                    style={[styles.payBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handlePay(invoice)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="card" size={18} color="#FFFFFF" />
                    <Text style={styles.payBtnText}>
                      Pay ₹{outstanding.toLocaleString('en-IN')} via UPI / Netbanking
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.receiptsBlock}>
                    <Text style={[styles.receiptsTitle, { color: colors.textMuted }]}>
                      OFFICIAL RECEIPTS ISSUED
                    </Text>
                    {invoice.payments.map(p => (
                      <View
                        key={p.id}
                        style={[styles.receiptRow, { borderColor: colors.border }]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.receiptNo, { color: colors.text }]}>
                            {p.receiptNo}
                          </Text>
                          <Text style={[styles.receiptSub, { color: colors.textMuted }]}>
                            Paid on {p.date} • {p.method}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.receiptDownloadBtn, { borderColor: colors.primary }]}
                          onPress={() => handleDownloadReceipt(p.receiptNo, p.amount)}
                        >
                          <Ionicons name="download-outline" size={14} color={colors.primary} />
                          <Text style={[styles.receiptDownloadText, { color: colors.primary }]}>
                            PDF
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  emptyBox: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },
  invoiceCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceNo: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  invoiceTerm: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  dueDateValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  breakdownBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
    gap: 6,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    fontSize: 12.5,
  },
  breakdownPrice: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  receiptsBlock: {
    paddingTop: 4,
  },
  receiptsTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  receiptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  receiptNo: {
    fontSize: 13,
    fontWeight: '700',
  },
  receiptSub: {
    fontSize: 11,
    marginTop: 1,
  },
  receiptDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  receiptDownloadText: {
    fontSize: 11,
    fontWeight: '700',
  }
});
