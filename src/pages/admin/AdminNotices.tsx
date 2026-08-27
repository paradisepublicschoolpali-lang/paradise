import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Notice } from '../../types';
import { Bell, Plus, Trash2, Pin, Send, Edit3 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const AdminNotices: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useSchoolData();
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  // New Notice Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('General');
  const [targetAudience, setTargetAudience] = useState<Notice['targetAudience']>('All');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast('Please enter title and content', '', 'error');
      return;
    }

    addNotice({
      title,
      category,
      targetAudience,
      content,
      author: 'Office of the Principal & Directorate',
      isPinned
    });

    toast('Official Circular Published!', `Dispatched to ${targetAudience}`, 'success');
    setIsAddModalOpen(false);
    setTitle('');
    setContent('');
    setIsPinned(false);
  };

  const handleUpdateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    updateNotice(editingNotice.id, editingNotice);
    toast('Notice Updated', `Saved changes for "${editingNotice.title}"`, 'success');
    setEditingNotice(null);
  };

  const handleDelete = (id: string, noticeTitle: string) => {
    if (window.confirm(`Delete circular "${noticeTitle}"?`)) {
      deleteNotice(id);
      toast('Notice Deleted', '', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Official Circulars & Notice Board Manager</h3>
          <p className="text-xs text-slate-500">Publish, broadcast, edit, and archive institutional announcements</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Circular</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map(notice => (
          <div
            key={notice.id}
            className={`p-6 rounded-2xl bg-white border transition-all shadow-xs space-y-3 ${
              notice.isPinned ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
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
                <span className="text-[10px] font-mono text-slate-500">
                  Target: <strong className="text-slate-700">{notice.targetAudience}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">{formatDate(notice.date)}</span>
                
                <button
                  onClick={() => setEditingNotice({ ...notice })}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200"
                  title="Edit Circular"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(notice.id, notice.title)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200"
                  title="Delete Circular"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h4 className="text-base font-bold font-cinzel text-slate-900">{notice.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              Authorized by: <strong className="text-slate-800">{notice.author}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Publish Official Circular"
        subtitle="Issue an authoritative communiqué across school portals"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Notice Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Schedule of Annual Board Examinations 2026-27"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Urgent">Urgent Circular</option>
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Sports">Sports</option>
                <option value="Holiday">Holiday Notice</option>
                <option value="General">General Communiqué</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All (Entire School & Public)</option>
                <option value="Parents">Parents Only</option>
                <option value="Teachers">Teachers & Faculty Only</option>
                <option value="Students">Scholars & Students</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinCheck"
              checked={isPinned}
              onChange={e => setIsPinned(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded"
            />
            <label htmlFor="pinCheck" className="text-slate-700 cursor-pointer">
              Pin notice to top of public and student notice boards
            </label>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Full Circular Content *</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Provide exact directives, protocols, timetables, and contact details..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Circular</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Notice Modal */}
      <Modal
        isOpen={editingNotice !== null}
        onClose={() => setEditingNotice(null)}
        title="Edit School Circular"
        subtitle={editingNotice ? `Editing: ${editingNotice.title}` : ''}
        maxWidth="lg"
      >
        {editingNotice && (
          <form onSubmit={handleUpdateNotice} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Title</label>
              <input
                type="text"
                required
                value={editingNotice.title}
                onChange={e => setEditingNotice({ ...editingNotice, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={editingNotice.category}
                  onChange={e => setEditingNotice({ ...editingNotice, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Sports">Sports</option>
                  <option value="Holiday">Holiday</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                <select
                  value={editingNotice.targetAudience}
                  onChange={e => setEditingNotice({ ...editingNotice, targetAudience: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="All">All</option>
                  <option value="Parents">Parents</option>
                  <option value="Teachers">Teachers</option>
                  <option value="Students">Students</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editPinCheck"
                checked={editingNotice.isPinned}
                onChange={e => setEditingNotice({ ...editingNotice, isPinned: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded"
              />
              <label htmlFor="editPinCheck" className="text-slate-700 cursor-pointer">
                Pin to top of boards
              </label>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Content</label>
              <textarea
                rows={4}
                required
                value={editingNotice.content}
                onChange={e => setEditingNotice({ ...editingNotice, content: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingNotice(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
