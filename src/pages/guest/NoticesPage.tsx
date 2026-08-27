import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Bell, Search, Pin, Calendar, User, Download, Sparkles } from 'lucide-react';
import { Notice } from '../../types';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const NoticesPage: React.FC = () => {
  const { notices } = useSchoolData();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeModal, setActiveNoticeModal] = useState<Notice | null>(null);

  const categories = ['All', 'Urgent', 'Academic', 'Examination', 'Sports', 'Holiday', 'General'];

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'All' || n.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownloadPdf = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    toast('Circular Downloaded', `Official directive for "${title}" saved as PDF`, 'info');
  };

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Official Directives</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">Institutional Notice Board</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Authentic policy directives, board examination notices, athletic updates, and term dates.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search circulars, directives..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              onClick={() => setActiveNoticeModal(notice)}
              className={`p-6 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md space-y-3 ${
                notice.isPinned ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      notice.category === 'Urgent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {notice.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Audience: {notice.targetAudience}</span>
                </div>

                <span className="text-xs text-slate-500 font-mono">{formatDate(notice.date)}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-cinzel">{notice.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">{notice.content}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Authorized by: <strong className="text-slate-800">{notice.author}</strong></span>
                <button
                  onClick={(e) => handleDownloadPdf(e, notice.title)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Circular PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={activeNoticeModal !== null}
        onClose={() => setActiveNoticeModal(null)}
        title={activeNoticeModal?.title || 'Circular Details'}
        subtitle={activeNoticeModal ? `Dispatched by ${activeNoticeModal.author} on ${formatDate(activeNoticeModal.date)}` : ''}
        maxWidth="2xl"
      >
        {activeNoticeModal && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Category: <strong className="text-blue-600">{activeNoticeModal.category}</strong></span>
                <span>Target Group: <strong className="text-slate-900">{activeNoticeModal.targetAudience}</strong></span>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line pt-2">
                {activeNoticeModal.content}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={(e) => handleDownloadPdf(e, activeNoticeModal.title)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save Official Circular</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
