import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Bell, Send, Plus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const TeacherNotices: React.FC = () => {
  const { notices, addNotice } = useSchoolData();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Parents' | 'Students'>('Students');
  const [content, setContent] = useState('');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast('Please enter title and content', '', 'error');
      return;
    }

    addNotice({
      title,
      category: 'Academic',
      targetAudience: targetAudience as any,
      content,
      author: 'Dr. Sarah Jenkins (Head of Physics)',
      isPinned: false
    });

    toast('Class Notice Broadcasted!', `Sent to ${targetAudience}`, 'success');
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Broadcast Notice Board</h3>
          <p className="text-xs text-slate-500">Transmit announcements directly to scholars and guardians</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Class Broadcast</span>
        </button>
      </div>

      {/* Broadcasts List */}
      <div className="space-y-4">
        {notices.map(notice => (
          <div
            key={notice.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                  {notice.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Target: {notice.targetAudience}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{formatDate(notice.date)}</span>
            </div>

            <h4 className="text-base font-bold font-cinzel text-slate-900">{notice.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Dispatched by: <strong className="text-slate-800">{notice.author}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Broadcast Class Announcement"
        subtitle="Publish to student and parent dashboards"
        maxWidth="lg"
      >
        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Broadcast Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Physics Lab Practical Exam Instructions"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
            <select
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Students">Scholars & Students</option>
              <option value="Parents">Parents Only</option>
              <option value="All">All (Scholars & Guardians)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notice Content *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Detail experiment guidelines, laboratory safety rules, and apparatus checklist..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
