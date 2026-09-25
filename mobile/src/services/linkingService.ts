import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

export const linkingService = {
  async openPhone(phone: string) {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    const url = `tel:${cleaned}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url); // Many Android/iOS emulators can't handle canOpenURL for tel:, but openURL works or prompts
      }
    } catch {
      Alert.alert('Unable to dial', `Please dial ${phone} directly.`);
    }
  },

  async openEmail(email: string, subject = 'Inquiry - Paradise Public School') {
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open mail', `Please send your email to ${email}.`);
    }
  },

  async openWhatsApp(phone: string, message = 'Hello Paradise Public School, I would like to inquire about admissions.') {
    const cleaned = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open WhatsApp', 'Please ensure WhatsApp is installed on your device.');
    }
  },

  async openMap(query = 'Paradise Public School Sumerpur Road Pali Rajasthan') {
    const encoded = encodeURIComponent(query);
    const url = Platform.select({
      ios: `maps:0,0?q=${encoded}`,
      android: `geo:0,0?q=${encoded}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
    });

    try {
      await Linking.openURL(url || `https://www.google.com/maps/search/?api=1&query=${encoded}`);
    } catch {
      await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
    }
  },

  async openWebsite(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open link', `Could not open ${url}`);
    }
  },

  async openDocument(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Document Notice', 'Document link is currently being updated by the school administration.');
    }
  }
};
