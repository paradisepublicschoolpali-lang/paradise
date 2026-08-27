import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { SchoolEvent } from '../../types';
import { Calendar, Plus, MapPin, Clock, Users, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminEvents: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useSchoolData();
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);

  // New Event State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SchoolEvent['category']>('Cultural');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('10:00 AM - 04:00 PM');
  const [venue, setVenue] = useState('Main Campus Auditorium');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=800');
  const [description, setDescription] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast('Please fill all event details', '', 'error');
      return;
    }

    addEvent({
      title,
      category,
      date,
      time,
      venue,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
      description
    });

    toast('Event Scheduled!', `"${title}" added to school calendar`, 'success');
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    updateEvent(editingEvent.id, editingEvent);
    toast('Event Updated', `Saved changes for "${editingEvent.title}"`, 'success');
    setEditingEvent(null);
  };

  const handleDelete = (id: string, eventTitle: string) => {
    if (window.confirm(`Delete event "${eventTitle}"?`)) {
      deleteEvent(id);
      toast('Event Deleted', '', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Campus Events & Symposia Manager</h3>
          <p className="text-xs text-slate-500">Schedule, edit, and manage fixtures, sports galas, and Olympiads</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div
            key={event.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-bold text-blue-800 text-[10px] uppercase shadow-xs">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-bold font-cinzel text-slate-900">{event.title}</h4>
                
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingEvent({ ...event })}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 transition-colors border border-slate-200"
                    title="Edit Event"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{event.time}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{event.rsvpCount} Registered Attendees</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Live on Website</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Campus Event"
        subtitle="Publish a ceremonial or competitive fixture"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. National Robotics Expo 2026"
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
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Academic">Academic</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Timings</label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 09:00 AM - 04:30 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Venue</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Olympic Aquatic Pavilion"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <ImageUploadInput
            label="Event Banner / Cover Image"
            value={coverImage}
            onChange={(val) => setCoverImage(val)}
            placeholder="Upload local image or paste URL..."
            shape="wide"
            helperText="Upload JPG/PNG event banner from your device or paste image URL."
          />

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Detailed Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="State agenda, guest dignitaries, dress code..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider"
            >
              Confirm Event
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={editingEvent !== null}
        onClose={() => setEditingEvent(null)}
        title="Edit Scheduled Event"
        subtitle={editingEvent ? `Editing: ${editingEvent.title}` : ''}
        maxWidth="lg"
      >
        {editingEvent && (
          <form onSubmit={handleUpdateEvent} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Event Title</label>
              <input
                type="text"
                required
                value={editingEvent.title}
                onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={editingEvent.category}
                  onChange={e => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                >
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Academic">Academic</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={editingEvent.date}
                  onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Timings</label>
                <input
                  type="text"
                  value={editingEvent.time}
                  onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Venue</label>
                <input
                  type="text"
                  value={editingEvent.venue}
                  onChange={e => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <ImageUploadInput
              label="Event Banner / Cover Image"
              value={editingEvent.coverImage}
              onChange={(val) => setEditingEvent({ ...editingEvent, coverImage: val })}
              placeholder="Upload local image or paste URL..."
              shape="wide"
              helperText="Upload JPG/PNG event banner from your device or paste image URL."
            />

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={editingEvent.description}
                onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
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
