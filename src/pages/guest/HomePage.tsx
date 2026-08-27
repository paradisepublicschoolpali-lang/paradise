import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Award,
  BookOpen,
  Trophy,
  ShieldCheck,
  Cpu,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Quote,
  ChevronRight
} from 'lucide-react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { formatDate } from '../../utils/helpers';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { events, notices, schoolConfig } = useSchoolData();

  const stats = [
    { label: 'Years of Excellence', value: '32+', icon: <Award className="w-5 h-5 text-blue-600" /> },
    { label: 'Board Distinction Rate', value: '100%', icon: <Trophy className="w-5 h-5 text-blue-600" /> },
    { label: 'Ivy & Tier-1 Placements', value: '98.4%', icon: <GraduationCap className="w-5 h-5 text-blue-600" /> },
    { label: 'Sports & STEM Clubs', value: '45+', icon: <Cpu className="w-5 h-5 text-blue-600" /> },
  ];

  const pillars = [
    {
      title: 'Academic Eminence',
      desc: 'Dual-path curriculum offering both CBSE National Board and Cambridge/IB International diplomas.',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      badge: 'Curriculum'
    },
    {
      title: 'AI & Quantum Labs',
      desc: 'State-of-the-art supercomputing stations, robotics arenas, and nanoscale physics experimentation.',
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      badge: 'Innovation'
    },
    {
      title: 'Olympic Sports Complex',
      desc: '10-lane Olympic heated pool, FIFA-grade turf, equestrian track, and professional sports coaching.',
      icon: <Trophy className="w-6 h-6 text-blue-600" />,
      badge: 'Athletics'
    },
    {
      title: 'Character Architecture',
      desc: 'Fostering ethical integrity, global diplomacy, leadership summits, and empathetic citizenship.',
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      badge: 'Values'
    }
  ];

  const testimonials = [
    {
      quote: "Paradise Public School provided the intellectual rigor and robotics lab mentorship that helped me earn a full scholarship to MIT.",
      author: "Aditya Roy",
      role: "Class of 2023 • MIT Aerospace Engineering"
    },
    {
      quote: "The personalized attention and values-driven faculty at Paradise shaped my daughter into a confident national debater and scholar.",
      author: "Dr. Meenakshi Sundaram",
      role: "Parent of Rhea (Grade 11)"
    },
    {
      quote: "A world-class environment with unmatched sports infrastructure, elite faculties, and a culture of relentless excellence.",
      author: "Col. Jason Vance",
      role: "Parent of Marcus (Grade 10)"
    }
  ];

  return (
    <div className="space-y-20 pb-20 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 bg-gradient-to-b from-blue-50/50 via-white to-white overflow-hidden">
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=2000"
            alt="Campus Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-7">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Admissions Open for Academic Session 2026-27</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-cinzel text-slate-900 tracking-tight leading-tight">
              {schoolConfig.heroHeadline}
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {schoolConfig.heroSubtitle}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('admissions')}
              className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('academics')}
              className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 hover:border-slate-400 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Academics</span>
            </button>
          </div>

          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1 text-center"
              >
                <div className="flex items-center justify-center mb-1">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-cinzel">{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Pillars of Excellence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Our Foundation</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">Pillars of Educational Distinction</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Designed to cultivate intellect, resilience, creativity, and moral integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  {p.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {p.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-cinzel">{p.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>

              <button
                onClick={() => setActiveTab('academics')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-2"
              >
                <span>Read More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Principal's Address Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <img
              src={schoolConfig.principalPhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'}
              alt={schoolConfig.principalName}
              className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-md border border-slate-200"
            />
            <div className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-white border border-slate-200 shadow-md">
              <div className="text-sm font-bold text-slate-900">{schoolConfig.principalName}</div>
              <div className="text-[11px] text-blue-600 font-medium">Principal & Executive Director</div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Leadership Message</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-slate-900">
              "{schoolConfig.principalMessage}"
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At Paradise Public School, we believe that education is an art of igniting curiosity and nurturing human potential. With over 32 years of academic leadership, our campus provides an empowering sanctuary where every student discovers their voice, masters cutting-edge technologies, and upholds timeless values of empathy and honor.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% University Placement</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dual Board Accreditation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Global Student Exchange</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Olympic Standard Sports</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('about')}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Read Full Biography & Vision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events & Circulars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Upcoming Campus Events</span>
              </h3>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">{event.category}</span>
                    <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                    <span className="text-xs text-slate-500">{formatDate(event.date)} • {event.time}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                    {event.rsvpCount} RSVPs
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Notices */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold font-cinzel text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Official Notice Board</span>
              </h3>
              <button
                onClick={() => setActiveTab('notices')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View Circulars
              </button>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map(notice => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{formatDate(notice.date)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Voices of Paradise</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">Alumni & Parent Endorsements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Quote className="w-7 h-7 text-blue-600 opacity-60" />
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="text-sm font-bold text-slate-900">{t.author}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Admission CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-blue-600 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-bold font-cinzel">Begin Your Child's Journey at Paradise</h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto">
            Limited seats available for Pre-Primary through Grade 11. Schedule a campus tour or submit an online application today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('admissions')}
              className="px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm uppercase tracking-wider hover:bg-blue-50 transition-colors shadow-md cursor-pointer"
            >
              Apply Online Now
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className="px-8 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm border border-blue-400 transition-colors cursor-pointer"
            >
              Contact Admissions Bureau
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
