import React from 'react';
import { Award, Compass, HeartHandshake, ShieldCheck, Trophy, Users, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab }) => {
  const milestones = [
    { year: '1994', title: 'Foundation of Paradise', desc: 'Inaugurated with 120 scholars and a vision for holistic academic and moral leadership.' },
    { year: '2004', title: 'National Board Accreditation', desc: 'Achieved top 5 CBSE ranking nationwide with 100% first-division distinctions.' },
    { year: '2012', title: 'International IB & Cambridge Wing', desc: 'Established global dual-diploma accreditation for high school scholars.' },
    { year: '2020', title: 'AI & Quantum STEM Centers', desc: 'Launched multimillion-dollar supercomputing, robotics, and clean energy laboratories.' },
    { year: '2026', title: 'Global Distinction & 32 Years', desc: 'Recognized as an exemplary global institution with over 2,450 active scholars.' },
  ];

  const values = [
    { title: 'Academic Rigor', desc: 'Relentless pursuit of intellectual mastery, critical thinking, and empirical scholarship.', icon: <Award className="w-6 h-6 text-blue-600" /> },
    { title: 'Moral Integrity', desc: 'Cultivating honesty, stewardship, empathy, and ethical responsibility in every sphere.', icon: <ShieldCheck className="w-6 h-6 text-blue-600" /> },
    { title: 'Innovation Mindset', desc: 'Empowering future scientists, founders, and creators through hands-on STEM experimentation.', icon: <Compass className="w-6 h-6 text-blue-600" /> },
    { title: 'Inclusive Community', desc: 'Fostering cultural empathy, mutual respect, and global citizenship across diverse backgrounds.', icon: <HeartHandshake className="w-6 h-6 text-blue-600" /> },
  ];

  const leadership = [
    {
      name: 'Dr. Robert Vance',
      role: 'Principal & Executive Director',
      credentials: 'Ph.D. Educational Leadership (Harvard), M.Sc. Physics (Oxford)',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Dr. Eleanor Sterling-Roy',
      role: 'Dean of International Academics',
      credentials: 'Ph.D. Comparative Education (Cambridge), IBDP Lead Assessor',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Prof. Alistair Montgomery',
      role: 'Dean of Sciences & Technology',
      credentials: 'M.Sc. Pure Mathematics (Cambridge), National Science Fellow',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Heritage & Vision</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">About Paradise Public School</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Thirty-two years of nurturing extraordinary intellects, courageous innovators, and compassionate leaders.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Our Vision</span>
            <h2 className="text-2xl font-bold font-cinzel text-slate-900">To Shape Ethical Pioneers of the 21st Century</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We envision a world where every scholar emerges as an intellectually sovereign, empathetic, and innovative leader capable of addressing complex global challenges with conviction and integrity.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Our Mission</span>
            <h2 className="text-2xl font-bold font-cinzel text-slate-900">Empowering Potential Through Rigor & Care</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To deliver world-class multidisciplinary education that combines rigorous academics, Olympic-level athletics, state-of-the-art STEM laboratories, and profound character formation.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Guiding Principles</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">The Core Values of Paradise</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs">
                {v.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 font-cinzel">{v.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Historical Milestones</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">Our 32-Year Journey (1994 – 2026)</h2>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs"
            >
              <div className="text-2xl font-black font-cinzel text-blue-600 shrink-0 w-24">
                {m.year}
              </div>
              <div className="border-l-2 border-blue-200 pl-4 space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                <p className="text-xs text-slate-600">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Board of Directorate</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">Eminent Academic Leadership</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadership.map((l, idx) => (
            <div key={idx} className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs space-y-4 p-5">
              <img src={l.image} alt={l.name} className="w-full h-56 object-cover rounded-xl border border-slate-200" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 font-cinzel">{l.name}</h4>
                <div className="text-xs font-semibold text-blue-600">{l.role}</div>
                <p className="text-xs text-slate-500 pt-1">{l.credentials}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
