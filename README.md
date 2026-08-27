# Paradise Public School • Institutional Management System

An institutional-grade school management platform and public portal system for **Paradise Public School** (Estd. 1994). Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and powered by **Vercel** & **Supabase Cloud**.

---

## ⚡ Core Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion
- **Hosting & CDN**: **Vercel** (`vercel.json` configured for SPA routing & immutable caching)
- **Backend & Cloud Database**: **Supabase** (PostgreSQL, Row Level Security, Realtime API)
- **Search & Discovery**: **Google Search Indexing Ready** (Schema.org JSON-LD, Robots.txt, Sitemap.xml, SEO Meta)
- **Mobile Distribution**: **PWA & Google Play Store Ready** (`manifest.json`, WebAPK / TWA support)

---

## 🌟 Portals & System Roles

1. **Public Website**: School admissions, about us, academics, events calendar, campus media gallery, and public circulars.
2. **Parent & Student Portal**: Scholar biodata dossier, attendance ledger, examination transcripts with sealed report cards, homework problem sets & submissions, fee ledger & online payments.
3. **Teacher Portal**: Allocated divisions & timetable, daily roll register & board sync, unit test & exam results entry, notice broadcasting.
4. **Supreme Admin Directorate**:
   - **Academic Gradebook & Exams (`AdminResults`)**: Comprehensive transcript management, marksheets, auto-computed GPA & ranks, sealed report cards generator.
   - **Attendance Ledger & Leave Desk (`AdminAttendance`)**: School-wide presence matrix, attendance override, 1-click leave approvals.
   - **Homework & Curriculum Directorate (`AdminHomework`)**: School-wide task creation, due dates, digital solution grading & feedback.
   - **Student & Faculty Directories**: Complete enrolment registry, Parent/Student ID generator, teacher course allocation.
   - **Treasury & Invoicing**: Fee breakdown management, quarterly invoices, tax receipts.
   - **System Directorate**: Supabase cloud database sync, 1-click JSON backup/restore, master credentials, crest logo customizer, and Google SEO & PWA monitor.

---

## 🚀 Deploying to Vercel with Supabase

### 1. Deploy to Vercel (1-Click or CLI)
```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy to Vercel
vercel
```
*Or simply push to your GitHub repository and import the repository into the [Vercel Dashboard](https://vercel.com).*

### 2. Connect Supabase Database
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a project.
2. Open **SQL Editor** in Supabase and paste the contents of [`supabase_schema.sql`](file:///c:/Users/HP/Desktop/paradise/paradise/supabase_schema.sql) to create all tables and RLS policies.
3. In Vercel Project Settings (or in local `.env`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Alternatively, you can connect and sync Supabase live directly within the **Admin Portal → Settings & Cloud DB**.

---

## 🔍 Google Search & Play Store Publishing

### 1. Google Search Indexing & SEO
- **Google Search Console**: Add your site URL (your custom domain or `.vercel.app` domain) to [Google Search Console](https://search.google.com/search-console).
- Add verification token in `index.html` (`<meta name="google-site-verification" content="..." />`).
- Submit `https://your-domain.com/sitemap.xml` in Search Console.
- Built-in Schema.org `EducationalOrganization` structured data enables Google Rich Snippets.

### 2. Google Play Store (PWA / TWA)
- The app includes a production PWA `manifest.json` and high-res vector icons.
- Use [PWABuilder](https://www.pwabuilder.com/) with your Vercel URL to generate a signed `.aab` (Android App Bundle) and publish to the **Google Play Console**.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
