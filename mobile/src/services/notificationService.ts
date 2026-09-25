import { Platform } from 'react-native';

export interface NotificationSettings {
  notices: boolean;
  events: boolean;
  holidays: boolean;
  admissions: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  notices: true,
  events: true,
  holidays: true,
  admissions: true
};

export const notificationService = {
  settings: { ...DEFAULT_SETTINGS },

  async getSettings(): Promise<NotificationSettings> {
    return this.settings;
  },

  async updateSetting(key: keyof NotificationSettings, value: boolean): Promise<NotificationSettings> {
    this.settings[key] = value;
    return this.settings;
  },

  async registerForPushNotificationsAsync(): Promise<string | null> {
    // Architecture hook for push notification device token registration
    // In production with an Expo push service, this returns the ExpoPushToken
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return 'DEMO_DEVICE_TOKEN_PARADISE_PPS';
    }
    return null;
  }
};
