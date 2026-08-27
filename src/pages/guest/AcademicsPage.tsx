import React, { useState } from 'react';
import { BookOpen, Cpu, Globe, Award, CheckCircle2, Download, ArrowRight, Sparkles, HeartHandshake, Compass } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AcademicsPageProps {
  setActiveTab: (tab: string) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const [activeDivision, setActiveDivision] = useState<'early' | 'primary' | 'middle'>('middle');

  const divisions = [
    {
      id: 'early',
      title: 'Early Years & Kindergarten',
      subtitle: 'Nursery, LKG & UKG',
      desc: 'Play-based foundational learning developing phonetic awareness, sensory coordination, numeracy through discovery, and joyous social development.'
    },
    {
      id: 'primary',
      title: 'Primary School Wing',
      subtitle: 'Classes 1 to 5',
      desc: 'Holistic curriculum fostering mathematical fluency, English reading & rhetoric, second languages, Environmental Studies (EVS), and arts.'
    },
    {
      id: 'middle',
      title: 'Middle School (Senior Wing)',
      subtitle: 'Classes 6 to 8 (Final Class)',
      desc: 'Rigorous preparatory curriculum with dedicated physics, chemistry & biology lab modules, advanced mathematics, social sciences, and Python coding.'
    }
  ];

  const handleDownloadCurriculum = () => {
    toast('Curriculum Prospectus Downloaded', 'The Nursery - Class 8 Academic Guide (2026-27) has been downloaded.', 'info');
  };

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Nursery to Class 8 Curriculum</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">Academic Framework & Divisions</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Nurturing young minds from early childhood foundation up to Class 8 graduating leadership.
          </p>
        </div>
      </section>

      {/* Division Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {divisions.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDivision(d.id as any)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                activeDivision === d.id
                  ? 'bg-blue-50 border-blue-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">{d.subtitle}</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-cinzel mt-1">{d.title}</h3>
            </button>
          ))}
        </div>

        {/* Division Detail Card */}
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">Division Details</span>
              <h2 className="text-2xl font-bold font-cinzel text-slate-900 mt-1">
                {divisions.find(d => d.id === activeDivision)?.title}
              </h2>
            </div>
            <button
              onClick={handleDownloadCurriculum}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download Class 1-8 Syllabus PDF</span>
            </button>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {divisions.find(d => d.id === activeDivision)?.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Pedagogical Approach</h4>
              <p className="text-sm font-bold text-slate-900">Experiential & Activity-Based</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Student-Teacher Ratio</h4>
              <p className="text-sm font-bold text-slate-900">14:1 Caring Mentorship</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Assessment System</h4>
              <p className="text-sm font-bold text-slate-900">CCE + Term Assessments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Holistic Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Nursery to Class 8 Pillars</span>
          <h2 className="text-3xl font-bold font-cinzel text-slate-900">Core Educational Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">STEM & Junior Robotics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hands-on science experiments, mathematics manipulatives, Scratch & Python coding, and robotics rover kits starting from primary classes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">Language & Creative Expression</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Phonics in early years, reading clubs, elocution, creative writing, public debate, and second languages fostering articulate communicators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-cinzel">Values, Sports & Physical Health</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daily sports training, swimming, yoga, gymnastics, and ethical values building well-rounded young individuals with high integrity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
