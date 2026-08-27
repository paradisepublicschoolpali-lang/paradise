import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolDataProvider } from './context/SchoolDataContext';
import { ToastProvider } from './context/ToastContext';

// Gateway & Common Components
import { PortalGateway } from './components/common/PortalGateway';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PortalLayout } from './components/portal-layout/PortalLayout';

// Guest Pages
import { HomePage } from './pages/guest/HomePage';
import { AboutPage } from './pages/guest/AboutPage';
import { AcademicsPage } from './pages/guest/AcademicsPage';
import { AdmissionsPage } from './pages/guest/AdmissionsPage';
import { EventsPage } from './pages/guest/EventsPage';
import { GalleryPage } from './pages/guest/GalleryPage';
import { NoticesPage } from './pages/guest/NoticesPage';
import { ContactPage } from './pages/guest/ContactPage';

// Parent / Student Portal Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentProfile } from './pages/parent/ParentProfile';
import { ParentAttendance } from './pages/parent/ParentAttendance';
import { ParentResults } from './pages/parent/ParentResults';
import { ParentNotices } from './pages/parent/ParentNotices';
import { ParentFees } from './pages/parent/ParentFees';

// Teacher Portal Pages (Homework removed)
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClasses } from './pages/teacher/TeacherClasses';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherResults } from './pages/teacher/TeacherResults';
import { TeacherNotices } from './pages/teacher/TeacherNotices';

// Admin Portal Pages (Maximum Power: Results Controller, Attendance Master, Homework Directorate, Directory, Fees, etc.)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminResults } from './pages/admin/AdminResults';
import { AdminAttendance } from './pages/admin/AdminAttendance';
import { AdminHomework } from './pages/admin/AdminHomework';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminTeachers } from './pages/admin/AdminTeachers';
import { AdminFees } from './pages/admin/AdminFees';
import { AdminAdmissions } from './pages/admin/AdminAdmissions';
import { AdminNotices } from './pages/admin/AdminNotices';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminSettings } from './pages/admin/AdminSettings';

const getInitialTab = (sectionPrefix: string, defaultTab: string) => {
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  const parts = rawHash.split('/');
  if (parts[0] === sectionPrefix && parts[1]) {
    return parts[1];
  }
  return defaultTab;
};

const getInitialGuestTab = () => {
  const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (rawHash && !['admin', 'parent', 'teacher', 'gateway', 'select'].includes(rawHash.split('/')[0])) {
    return rawHash.split('/')[0];
  }
  return 'home';
};

const SchoolApp: React.FC = () => {
  const { role, showGateway, openGateway } = useAuth();

  // Internal tab states for each portal - restored from URL hash on reload
  const [guestTab, setGuestTabState] = useState(getInitialGuestTab);
  const [parentTab, setParentTabState] = useState(() => getInitialTab('parent', 'dashboard'));
  const [teacherTab, setTeacherTabState] = useState(() => getInitialTab('teacher', 'dashboard'));
  const [adminTab, setAdminTabState] = useState(() => getInitialTab('admin', 'dashboard'));

  // Push history on tab changes
  const setGuestTab = (tab: string) => {
    setGuestTabState(tab);
    if (window.location.hash !== `#/${tab}`) {
      window.history.pushState({ role: 'guest', tab }, '', `#/${tab}`);
    }
  };

  const setParentTab = (tab: string) => {
    setParentTabState(tab);
    if (window.location.hash !== `#/parent/${tab}`) {
      window.history.pushState({ role: 'parent', tab }, '', `#/parent/${tab}`);
    }
  };

  const setTeacherTab = (tab: string) => {
    setTeacherTabState(tab);
    if (window.location.hash !== `#/teacher/${tab}`) {
      window.history.pushState({ role: 'teacher', tab }, '', `#/teacher/${tab}`);
    }
  };

  const setAdminTab = (tab: string) => {
    setAdminTabState(tab);
    if (window.location.hash !== `#/admin/${tab}`) {
      window.history.pushState({ role: 'admin', tab }, '', `#/admin/${tab}`);
    }
  };

  // Sync with browser back/forward buttons (popstate & hashchange)
  React.useEffect(() => {
    const handleUrlNavigation = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      
      if (!rawHash || rawHash === 'gateway' || rawHash === 'select') {
        openGateway();
        return;
      }

      const parts = rawHash.split('/');
      const section = parts[0];
      const subTab = parts[1] || 'dashboard';

      if (section === 'admin') {
        setAdminTabState(subTab);
      } else if (section === 'parent') {
        setParentTabState(subTab);
      } else if (section === 'teacher') {
        setTeacherTabState(subTab);
      } else {
        // Guest pages e.g. /home, /about, /academics, /admissions, /events, /gallery, /notices, /contact
        setGuestTabState(section || 'home');
      }
    };

    window.addEventListener('popstate', handleUrlNavigation);
    window.addEventListener('hashchange', handleUrlNavigation);

    // Initial load from URL hash if present
    handleUrlNavigation();

    return () => {
      window.removeEventListener('popstate', handleUrlNavigation);
      window.removeEventListener('hashchange', handleUrlNavigation);
    };
  }, [openGateway]);

  // If initial entry gateway is open, render PortalGateway (Guest, Parent, Teacher, Admin login)
  if (showGateway) {
    return <PortalGateway />;
  }

  // GUEST PORTAL RENDER
  if (role === 'guest') {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
        <div>
          <Navbar activeTab={guestTab} setActiveTab={setGuestTab} />
          <main className="pt-2">
            {guestTab === 'home' && <HomePage setActiveTab={setGuestTab} />}
            {guestTab === 'about' && <AboutPage setActiveTab={setGuestTab} />}
            {guestTab === 'academics' && <AcademicsPage setActiveTab={setGuestTab} />}
            {guestTab === 'admissions' && <AdmissionsPage />}
            {guestTab === 'events' && <EventsPage />}
            {guestTab === 'gallery' && <GalleryPage />}
            {guestTab === 'notices' && <NoticesPage />}
            {guestTab === 'contact' && <ContactPage />}
          </main>
        </div>
        <Footer setActiveTab={setGuestTab} />
      </div>
    );
  }

  // PARENT / STUDENT PORTAL RENDER
  if (role === 'parent') {
    const tabTitles: Record<string, { title: string; subtitle: string }> = {
      dashboard: { title: 'Scholar Overview', subtitle: 'Academic Milestones & Daily Schedule' },
      profile: { title: 'Student Dossier', subtitle: 'Personal Biodata, Emergency Contacts & Route' },
      attendance: { title: 'Attendance Ledger', subtitle: 'Monthly Presence Log & Leave Filing' },
      results: { title: 'Examinations & Transcripts', subtitle: 'Academic Marks, Honors & Sealed Report Card' },
      notices: { title: 'Parent Circulars', subtitle: 'PTM Bookings & Official Announcements' },
      fees: { title: 'Tuition Ledger & Online Payment', subtitle: 'Quarterly Invoices & Instant Tax Receipts' }
    };

    const activeInfo = tabTitles[parentTab] || { title: 'Parent Portal', subtitle: '' };

    return (
      <PortalLayout
        activeTab={parentTab}
        setActiveTab={setParentTab}
        title={activeInfo.title}
        subtitle={activeInfo.subtitle}
      >
        {parentTab === 'dashboard' && <ParentDashboard setActiveTab={setParentTab} />}
        {parentTab === 'profile' && <ParentProfile />}
        {parentTab === 'attendance' && <ParentAttendance />}
        {parentTab === 'results' && <ParentResults />}
        {parentTab === 'notices' && <ParentNotices />}
        {parentTab === 'fees' && <ParentFees />}
      </PortalLayout>
    );
  }

  // TEACHER PORTAL RENDER (Homework removed)
  if (role === 'teacher') {
    const tabTitles: Record<string, { title: string; subtitle: string }> = {
      dashboard: { title: 'Faculty Workstation', subtitle: 'Today’s Timetable & Allocated Divisions' },
      classes: { title: 'Allocated Divisions', subtitle: 'Class Rosters, Contacts & Syllabus Tracking' },
      attendance: { title: 'Daily Roll Register', subtitle: 'Mark Classroom Attendance & Sync with Board' },
      results: { title: 'Results & Marks Entry', subtitle: 'Unit Tests & Comprehensive Examinations Gradebook' },
      notices: { title: 'Broadcast Circulars', subtitle: 'Transmit Announcements to Scholars & Guardians' }
    };

    const activeInfo = tabTitles[teacherTab] || { title: 'Teacher Portal', subtitle: '' };

    return (
      <PortalLayout
        activeTab={teacherTab}
        setActiveTab={setTeacherTab}
        title={activeInfo.title}
        subtitle={activeInfo.subtitle}
      >
        {teacherTab === 'dashboard' && <TeacherDashboard setActiveTab={setTeacherTab} />}
        {teacherTab === 'classes' && <TeacherClasses />}
        {teacherTab === 'attendance' && <TeacherAttendance />}
        {teacherTab === 'results' && <TeacherResults />}
        {teacherTab === 'notices' && <TeacherNotices />}
      </PortalLayout>
    );
  }

  // ADMIN PORTAL RENDER (Empowered with Gradebook, Attendance Master, Homework Directorate, Directories, etc.)
  if (role === 'admin') {
    const tabTitles: Record<string, { title: string; subtitle: string }> = {
      dashboard: { title: 'Principal Directorate Console', subtitle: 'Key Institutional Performance Indicators & Alerts' },
      results: { title: 'Academic Gradebook & Exams', subtitle: 'Institution-wide Marksheets, GPA Calculator & Sealed Report Cards' },
      attendance: { title: 'Attendance Ledger & Leave Desk', subtitle: 'Daily Presence Matrix, Leave Approvals & Absence Audit' },
      homework: { title: 'Homework & Curriculum Directorate', subtitle: 'Central Task Assignment, Deadlines & Solution Evaluations' },
      students: { title: 'Student Body Directory', subtitle: 'Full Enrolment Registry & Credentials Manager' },
      teachers: { title: 'Faculty Directorate', subtitle: 'Staff Appointments, Credentials & Course Allocation' },
      fees: { title: 'Institutional Treasury', subtitle: 'Fee Collections, Dunning System & Invoicing' },
      admissions: { title: 'Admissions Bureau', subtitle: 'Online Application Review & Candidate Interviews' },
      notices: { title: 'School Circulars Manager', subtitle: 'Publish & Pin Official Institutional Directives' },
      events: { title: 'Campus Events & Calendar', subtitle: 'Schedule Galas, Olympiads & Symposia' },
      gallery: { title: 'Media & Campus Gallery', subtitle: 'High-Resolution Photography Archives' },
      settings: { title: 'System Configuration & Cloud DB', subtitle: 'Institution Profile, Supabase DB & Google Publishing' }
    };

    const activeInfo = tabTitles[adminTab] || { title: 'Admin Portal', subtitle: '' };

    return (
      <PortalLayout
        activeTab={adminTab}
        setActiveTab={setAdminTab}
        title={activeInfo.title}
        subtitle={activeInfo.subtitle}
      >
        {adminTab === 'dashboard' && <AdminDashboard setActiveTab={setAdminTab} />}
        {adminTab === 'results' && <AdminResults />}
        {adminTab === 'attendance' && <AdminAttendance />}
        {adminTab === 'homework' && <AdminHomework />}
        {adminTab === 'students' && <AdminStudents />}
        {adminTab === 'teachers' && <AdminTeachers />}
        {adminTab === 'fees' && <AdminFees />}
        {adminTab === 'admissions' && <AdminAdmissions />}
        {adminTab === 'notices' && <AdminNotices />}
        {adminTab === 'events' && <AdminEvents />}
        {adminTab === 'gallery' && <AdminGallery />}
        {adminTab === 'settings' && <AdminSettings />}
      </PortalLayout>
    );
  }

  return null;
};

export function App() {
  return (
    <AuthProvider>
      <SchoolDataProvider>
        <ToastProvider>
          <SchoolApp />
        </ToastProvider>
      </SchoolDataProvider>
    </AuthProvider>
  );
}

export default App;
