# Paradise Public School • Official Mobile Application (Android & iOS)

A modern, fast, lightweight, and professional cross-platform mobile application built specifically for **Paradise Public School** (Estd. 1994, CBSE Affiliated, Pali, Rajasthan).

Built with **React Native**, **Expo SDK 57**, and **TypeScript**, this is a **100% native mobile application** (not a website wrapped inside a WebView) designed mobile-first for students, parents, teachers, and prospective applicants.

---

## 📱 Features & Highlights

### 1. Polished Native Navigation
- **Persistent Bottom Navigation**:
  - `Home`: Crest header, announcement banner, 6 quick actions, highlights strip, latest circulars, and upcoming galas.
  - `Notices`: Live search, category chips (`Examination`, `Sports`, `Academic`, `Holiday`, `Urgent`), pinned circulars, and instant PDF document opening.
  - `Events`: Upcoming vs Previous events filter, event cover photography, date badges, venue, and 1-tap RSVP counter.
  - `Gallery`: High-resolution photo grid across Campus, Sports, Academics, Arts, and Celebrations with a full-screen image viewer.
  - `More`: Comprehensive school directory leading to About, Admissions, Facilities, Contact, and Settings.
- **Hardware Integration**:
  - Android hardware back button traverses modal states, sub-screens, and returns to Home cleanly before exit.
  - iOS smooth swipe gestures and safe area insets for notches and Dynamic Islands.

### 2. Admissions Bureau Module
- **Session 2026-27 Guidelines**: Comprehensive age eligibility matrix (Nursery to Class 8), 4-step procedure, and required documents checklist.
- **Instant Online Application**: Built-in modal form enabling guardians to submit candidate and parent details with immediate application reference number generation (`PPS-ADM-2026-XXXX`).

### 3. Native Device Actions
- **Direct Dialing**: 1-tap phone dialer for Primary Landline (`+91 2932 224567`) and Mobile Helpline (`+91 98290 12345`).
- **WhatsApp Integration**: Instant chat launcher for admissions inquiries.
- **Maps Navigation**: 1-tap launcher for Apple Maps (iOS) or Google Maps (Android) directly to the Sumerpur Road campus.
- **Email Dispatch**: Direct `mailto:` launcher to `paradisepublicschool.pali@gmail.com`.
- **Documents & PDFs**: Native document and schedule viewing.

### 4. True Dark Mode Support
- Supports **Light Mode**, **Dark Mode**, and **System Default**.
- Built with a custom, high-contrast dark palette (Deep Slate `#0B0F17`, Surface `#151D2A`, Royal Blue `#3B82F6`, Amber `#F59E0B`).
- Preserves readability across all low-end, mid-range, and flagship displays.

### 5. Push Notification Architecture
- Prepared for push notification broadcasts (`expo-notifications` architecture):
  - Examination circulars & timetable updates
  - Sports galas & Olympiad announcements
  - Vacation closures & weather emergency alerts
  - Admission registration deadlines

---

## 📂 Architecture & Directory Structure

```
mobile/
├── assets/                       # App icons, splash screens, and adaptives
├── src/
│   ├── components/               # Reusable atomic UI components
│   │   ├── Header.tsx            # School crest header with dialer
│   │   ├── BottomNav.tsx         # Tab bar with safe area insets & badges
│   │   ├── SectionHeader.tsx     # Typography header with "View all"
│   │   ├── QuickActionButton.tsx # 6-button home grid shortcut
│   │   ├── NoticeCard.tsx        # Circular preview card with category pills
│   │   ├── EventCard.tsx         # Event banner with date badge & RSVP
│   │   ├── EmptyState.tsx        # Friendly retry & empty search state
│   │   ├── NoticeDetailModal.tsx # Full-screen circular reader with PDF action
│   │   ├── ImageViewerModal.tsx  # Full-screen photo viewer
│   │   └── AdmissionFormModal.tsx# Online application submission form
│   ├── context/
│   │   ├── ThemeContext.tsx      # Light/Dark/System theme provider
│   │   └── SchoolDataContext.tsx # State provider with refresh & admissions
│   ├── data/
│   │   └── schoolData.ts         # Authentic Paradise Public School data
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Polished main landing screen
│   │   ├── NoticesScreen.tsx     # Filterable notice board
│   │   ├── EventsScreen.tsx      # Upcoming & past events calendar
│   │   ├── GalleryScreen.tsx     # Photo gallery grid
│   │   ├── MoreScreen.tsx        # School directory hub
│   │   ├── AboutScreen.tsx       # Principal message, vision & milestones
│   │   ├── AdmissionsScreen.tsx  # Admissions guide & application trigger
│   │   ├── FacilitiesScreen.tsx  # ATL Robotics, Library, Sports & Fleet
│   │   ├── ContactScreen.tsx     # 1-tap call, email, WhatsApp, maps
│   │   └── SettingsScreen.tsx    # Theme switch & notification prefs
│   ├── services/
│   │   ├── linkingService.ts     # Phone, WhatsApp, Maps & Email handlers
│   │   └── notificationService.ts# Push notification architecture
│   ├── theme/
│   │   └── colors.ts             # Palette definitions (Light & Dark)
│   └── types/
│       └── index.ts              # Strict TypeScript interfaces
├── App.tsx                       # Root application entry & navigation
├── app.json                      # Expo application metadata & config
└── package.json                  # Dependencies & scripts
```

---

## 🚀 Running the App Locally

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start Expo Development Server
```bash
npm start
```
- Scan the displayed QR code using **Expo Go** on your Android or iPhone device.
- Or press `a` to open in an Android Emulator.
- Or press `i` to open in an iOS Simulator (macOS).
- Or press `w` to preview in your web browser.

---

## 🔨 Building for Android & iOS

### Build with EAS (Expo Application Services - Recommended)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure build credentials:
   ```bash
   eas build:configure
   ```
4. **Build Android APK / AAB**:
   ```bash
   eas build --platform android --profile preview    # Generates installable .apk
   eas build --platform android --profile production # Generates Google Play .aab
   ```
5. **Build iOS IPA**:
   ```bash
   eas build --platform ios --profile production     # Generates App Store .ipa
   ```

### Prebuild / Native Bare Workflow (Android Studio & Xcode)
If you prefer building locally via Android Studio / Xcode:
```bash
npx expo run:android   # Generates /android and compiles via Gradle
npx expo run:ios       # Generates /ios and compiles via Xcode (macOS)
```

---

## 🔐 Environment & Backend Configuration

The data layer in `src/data/schoolData.ts` and `src/context/SchoolDataContext.tsx` is completely modular. To connect directly to the school's live **Supabase** backend:

1. Create a `.env` file inside `mobile/`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. The services in `src/services/` will automatically interface with your cloud tables (`notices`, `events`, `admissions`, `gallery`).
