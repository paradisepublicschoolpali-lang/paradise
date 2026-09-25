import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GalleryItem } from '../types';

interface ImageViewerModalProps {
  item: GalleryItem | null;
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  item,
  visible,
  onClose
}) => {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Close image viewer"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>

        {/* Image Display */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Details */}
        <View style={styles.footer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.65,
  },
  footer: {
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#94A3B8',
    fontSize: 12,
  }
});
