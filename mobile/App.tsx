import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler, Modal } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SchoolDataProvider } from './src/context/SchoolDataContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import { BottomNav } from './src/components/BottomNav';
import { NoticeDetailModal } from './src/components/NoticeDetailModal';
import { AdmissionFormModal } from './src/components/AdmissionFormModal';

import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { TeacherDashboardScreen } from './src/screens/TeacherDashboardScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { AcademicsScreen } from './src/screens/AcademicsScreen';
import { AttendanceScreen } from './src/screens/AttendanceScreen';
import { CommunicationScreen } from './src/screens/CommunicationScreen';
import { MoreScreen } from './src/screens/MoreScreen';

import { FeesScreen } from './src/screens/FeesScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { AdmissionsScreen } from './src/screens/AdmissionsScreen';
import { FacilitiesScreen } from './src/screens/FacilitiesScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

import { RootTab, MoreSubScreen, Notice, SchoolEvent } from './src/types';

const MainNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { role, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<RootTab>('home');
  const [moreSubScreen, setMoreSubScreen] = useState<MoreSubScreen>('menu');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Modals
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);

  // Hardware back button handler
  useEffect(() => {
    const onBackPress = () => {
      if (showLoginModal) {
        setShowLoginModal(false);
        return true;
      }
      if (selectedNotice) {
        setSelectedNotice(null);
        return true;
      }
      if (showAdmissionForm) {
        setShowAdmissionForm(false);
        return true;
      }
      if (activeTab === 'more' && moreSubScreen !== 'menu') {
        setMoreSubScreen('menu');
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [showLoginModal, selectedNotice, showAdmissionForm, activeTab, moreSubScreen]);

  const handleTabChange = useCallback((tab: RootTab) => {
    setActiveTab(tab);
    if (tab === 'more') {
      setMoreSubScreen('menu');
    }
  }, []);

  const handleNavigateMore = useCallback((sub: MoreSubScreen) => {
    setActiveTab('more');
    setMoreSubScreen(sub);
  }, []);

  const renderCurrentScreen = () => {
    // If not authenticated, present the Login Portal directly
    if (!isAuthenticated) {
      return (
        <LoginScreen
          onSuccess={() => setShowLoginModal(false)}
        />
      );
    }

    if (activeTab === 'home') {
      if (role === 'admin') {
        return <AdminDashboardScreen />;
      }
      if (role === 'teacher') {
        return <TeacherDashboardScreen />;
      }
      return (
        <HomeScreen
          onNavigateTab={handleTabChange}
          onNavigateMore={handleNavigateMore}
          onSelectNotice={setSelectedNotice}
          onSelectEvent={() => handleTabChange('communication')}
          onOpenAdmissionForm={() => setShowAdmissionForm(true)}
        />
      );
    }

    if (activeTab === 'academics') {
      return <AcademicsScreen />;
    }

    if (activeTab === 'attendance') {
      return <AttendanceScreen />;
    }

    if (activeTab === 'communication') {
      return (
        <CommunicationScreen
          onSelectNotice={setSelectedNotice}
        />
      );
    }

    if (activeTab === 'more') {
      switch (moreSubScreen) {
        case 'fees':
          return <FeesScreen onBack={() => setMoreSubScreen('menu')} />;
        case 'about':
          return <AboutScreen onBack={() => setMoreSubScreen('menu')} />;
        case 'admissions':
          return (
            <AdmissionsScreen
              onBack={() => setMoreSubScreen('menu')}
              onOpenApplyForm={() => setShowAdmissionForm(true)}
            />
          );
        case 'facilities':
          return <FacilitiesScreen onBack={() => setMoreSubScreen('menu')} />;
        case 'contact':
          return <ContactScreen onBack={() => setMoreSubScreen('menu')} />;
        case 'settings':
          return <SettingsScreen onBack={() => setMoreSubScreen('menu')} />;
        case 'menu':
        default:
          return (
            <MoreScreen
              onNavigateSub={setMoreSubScreen}
              onOpenAdmissionForm={() => setShowAdmissionForm(true)}
              onOpenLogin={() => setShowLoginModal(true)}
            />
          );
      }
    }

    return null;
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Main Screen Container */}
      <View style={styles.screenContainer}>{renderCurrentScreen()}</View>

      {/* Persistent Bottom Tab Bar (shown when authenticated) */}
      {isAuthenticated && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          noticeCount={2}
        />
      )}

      {/* Login / Role Switcher Modal */}
      <Modal
        visible={showLoginModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <LoginScreen
          onSuccess={() => setShowLoginModal(false)}
          onCancel={() => setShowLoginModal(false)}
        />
      </Modal>

      {/* Global Modals */}
      <NoticeDetailModal
        notice={selectedNotice}
        visible={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      <AdmissionFormModal
        visible={showAdmissionForm}
        onClose={() => setShowAdmissionForm(false)}
      />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <SchoolDataProvider>
            <MainNavigator />
          </SchoolDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  }
});
