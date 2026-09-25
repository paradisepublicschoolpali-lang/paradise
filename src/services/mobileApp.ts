import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

/**
 * Initializes native mobile app features when running in Capacitor (Android & iOS).
 */
export async function initializeMobileApp(onBackButton?: () => boolean | void) {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Configure Status Bar for native Android / iOS
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#1E3A8A' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (err) {
    console.warn('StatusBar initialization skipped or failed:', err);
  }

  try {
    // Automatically hide splash screen when React app is ready
    await SplashScreen.hide();
  } catch (err) {
    console.warn('SplashScreen hide skipped:', err);
  }

  try {
    // Android hardware back button handler
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (onBackButton) {
        const handled = onBackButton();
        if (handled) return;
      }

      if (canGoBack) {
        window.history.back();
      } else {
        // At root page, confirm exit or minimize
        CapApp.minimizeApp();
      }
    });
  } catch (err) {
    console.warn('BackButton listener skipped:', err);
  }
}
