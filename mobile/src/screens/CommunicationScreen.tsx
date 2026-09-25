import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSchoolData } from '../context/SchoolDataContext';
import { Notice } from '../types';

interface CommunicationScreenProps {
  onSelectNotice: (notice: Notice) => void;
}

export const CommunicationScreen: React.FC<CommunicationScreenProps> = ({ onSelectNotice }) => {
  const { colors } = useTheme();
  const { notices, messages, sendMessage, activeStudent } = useSchoolData();

  const [activeTab, setActiveTab] = useState<'notices' | 'chat'>('notices');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newText, setNewText] = useState('');

  const categories = ['All', 'Examination', 'Sports', 'Academic', 'Urgent'];

  const filteredNotices = notices.filter(n => {
    const matchCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSend = () => {
    if (!newText.trim()) return;
    sendMessage(newText.trim());
    setNewText('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Communication</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
          Notices, Circulars & Faculty Messaging
        </Text>
      </View>

      {/* Sub Tabs */}
      <View style={[styles.segmentContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'notices' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('notices')}
        >
          <Ionicons
            name="megaphone"
            size={16}
            color={activeTab === 'notices' ? '#FFFFFF' : colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'notices' ? '#FFFFFF' : colors.text }
            ]}
          >
            Official Circulars ({notices.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentBtn,
            activeTab === 'chat' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Ionicons
            name="chatbubbles"
            size={16}
            color={activeTab === 'chat' ? '#FFFFFF' : colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              { color: activeTab === 'chat' ? '#FFFFFF' : colors.text }
            ]}
          >
            Teacher Desk ({messages.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* NOTICES TAB */}
      {activeTab === 'notices' && (
        <View style={{ flex: 1 }}>
          {/* Search bar */}
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search circulars, notifications, dates..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selectedCategory === cat ? colors.primary : colors.surface,
                    borderColor: selectedCategory === cat ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: selectedCategory === cat ? '#FFFFFF' : colors.text }
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Notices List */}
          <ScrollView
            contentContainerStyle={styles.noticesScroll}
            showsVerticalScrollIndicator={false}
          >
            {filteredNotices.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                <Ionicons name="document-text-outline" size={42} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No circulars found</Text>
              </View>
            ) : (
              filteredNotices.map(notice => (
                <TouchableOpacity
                  key={notice.id}
                  style={[styles.noticeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => onSelectNotice(notice)}
                  activeOpacity={0.8}
                >
                  <View style={styles.noticeHeader}>
                    <View style={[styles.badgeCat, { backgroundColor: colors.primary + '14' }]}>
                      <Text style={[styles.badgeCatText, { color: colors.primary }]}>
                        {notice.category}
                      </Text>
                    </View>
                    <Text style={[styles.noticeDate, { color: colors.textMuted }]}>{notice.date}</Text>
                  </View>

                  <Text style={[styles.noticeTitle, { color: colors.text }]}>{notice.title}</Text>
                  <Text style={[styles.noticeExcerpt, { color: colors.textMuted }]} numberOfLines={2}>
                    {notice.content}
                  </Text>

                  <View style={styles.noticeFooter}>
                    <View style={styles.authorRow}>
                      <Ionicons name="shield-checkmark-outline" size={13} color={colors.primary} />
                      <Text style={[styles.authorText, { color: colors.textMuted }]}>{notice.author}</Text>
                    </View>
                    {notice.pdfUrl && (
                      <View style={styles.pdfPill}>
                        <Ionicons name="document-attach" size={13} color="#EF4444" />
                        <Text style={styles.pdfPillText}>PDF Attachment</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* TEACHER CHAT TAB */}
      {activeTab === 'chat' && (
        <View style={{ flex: 1 }}>
          {/* Active Teacher Banner */}
          <View style={[styles.teacherBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.teacherAvatar, { backgroundColor: colors.primary }]}>
              <Ionicons name="school" size={18} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.teacherName, { color: colors.text }]}>
                {activeStudent.grade === 'Class 8' ? 'Mrs. Sunita Verma' : 'Ms. Pooja Trivedi'}
              </Text>
              <Text style={[styles.teacherRole, { color: colors.textMuted }]}>
                Class Teacher ({activeStudent.grade}-{activeStudent.section}) • Online
              </Text>
            </View>
            <View style={styles.onlineDot} />
          </View>

          {/* Messages Stream */}
          <ScrollView
            contentContainerStyle={styles.messagesScroll}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.msgWrapper,
                  msg.isFromMe ? styles.msgWrapperRight : styles.msgWrapperLeft
                ]}
              >
                {!msg.isFromMe && (
                  <Text style={[styles.senderLabel, { color: colors.textMuted }]}>
                    {msg.senderName}
                  </Text>
                )}
                <View
                  style={[
                    styles.msgBubble,
                    msg.isFromMe
                      ? [styles.bubbleMe, { backgroundColor: colors.primary }]
                      : [styles.bubbleThem, { backgroundColor: colors.surface, borderColor: colors.border }]
                  ]}
                >
                  <Text
                    style={[
                      styles.msgContent,
                      { color: msg.isFromMe ? '#FFFFFF' : colors.text }
                    ]}
                  >
                    {msg.content}
                  </Text>
                  <Text
                    style={[
                      styles.msgTime,
                      { color: msg.isFromMe ? 'rgba(255,255,255,0.75)' : colors.textMuted }
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Box */}
          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <TextInput
              style={[
                styles.chatInput,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }
              ]}
              placeholder={`Message ${activeStudent.grade === 'Class 8' ? 'Mrs. Sunita Verma' : 'Ms. Pooja Trivedi'}...`}
              placeholderTextColor={colors.textMuted}
              value={newText}
              onChangeText={setNewText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { backgroundColor: newText.trim() ? colors.primary : colors.border }
              ]}
              onPress={handleSend}
              disabled={!newText.trim()}
            >
              <Ionicons name="send" size={17} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noticesScroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  emptyCard: {
    padding: 30,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  noticeCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeCat: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeCatText: {
    fontSize: 11,
    fontWeight: '700',
  },
  noticeDate: {
    fontSize: 11,
  },
  noticeTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  noticeExcerpt: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 8,
  },
  noticeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150,150,150,0.2)',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorText: {
    fontSize: 11,
  },
  pdfPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pdfPillText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  teacherBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  teacherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '700',
  },
  teacherRole: {
    fontSize: 11,
    marginTop: 1,
  },
  onlineDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
  },
  messagesScroll: {
    padding: 16,
    paddingBottom: 20,
    gap: 12,
  },
  msgWrapper: {
    maxWidth: '82%',
    marginBottom: 6,
  },
  msgWrapperLeft: {
    alignSelf: 'flex-start',
  },
  msgWrapperRight: {
    alignSelf: 'flex-end',
  },
  senderLabel: {
    fontSize: 10.5,
    marginBottom: 3,
    marginLeft: 4,
  },
  msgBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleMe: {
    borderBottomRightRadius: 2,
  },
  bubbleThem: {
    borderBottomLeftRadius: 2,
    borderWidth: 1,
  },
  msgContent: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  msgTime: {
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 90,
    fontSize: 13.5,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
