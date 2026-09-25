import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notice } from '../types';
import { useTheme } from '../context/ThemeContext';
import { linkingService } from '../services/linkingService';

interface NoticeDetailModalProps {
  notice: Notice | null;
  visible: boolean;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  visible,
  onClose
}) => {
  const { colors, isDark } = useTheme();

  if (!notice) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Modal Top Bar */}
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.surface }]}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Close notice"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Official Notice</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primaryTint }]}>
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {notice.category}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>{notice.date}</Text>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{notice.title}</Text>

          <View style={[styles.authorBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <View style={styles.authorCol}>
              <Text style={[styles.authorLabel, { color: colors.textSecondary }]}>Issued By</Text>
              <Text style={[styles.authorName, { color: colors.text }]}>{notice.author}</Text>
            </View>
          </View>

          <View style={styles.contentBox}>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {notice.content}
            </Text>
          </View>

          {notice.pdfUrl ? (
            <View style={[styles.docSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.docInfo}>
                <Ionicons name="document-attach" size={24} color={colors.primary} />
                <View style={styles.docCol}>
                  <Text style={[styles.docTitle, { color: colors.text }]}>Official Document (PDF)</Text>
                  <Text style={[styles.docSub, { color: colors.textSecondary }]}>
                    Schedule & Circular Verification Copy
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
                onPress={() => linkingService.openDocument(notice.pdfUrl!)}
                accessibilityRole="button"
                accessibilityLabel="Open document"
              >
                <Ionicons name="arrow-down-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>Open Document</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 16,
  },
  authorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  authorCol: {
    flex: 1,
  },
  authorLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  contentBox: {
    marginBottom: 24,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  docSection: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  docCol: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  docSub: {
    fontSize: 12,
    marginTop: 2,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  }
});
