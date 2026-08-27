import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCircle2, UserCheck } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const ParentNotices: React.FC = () => {
  const { notices } = useSchoolData();
  const { toast } = useToast();

  const [ptmBooked, setPtmBooked] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM - 10:45 AM');

  const ptmSlots = [
    '09:00 AM - 09:15 AM',
    '09:30 AM - 09:45 AM',
    '10:30 AM - 10:45 AM',
    '11:15 AM - 11:30 AM',
    '01:30 PM - 01:45 PM',
  ];

  const handleBookPtm = () => {
    setPtmBooked(true);
    toast('PTM Interaction Confirmed!', `Slot booked for ${selectedSlot} with Dr. Sarah Jenkins (Physics Head)`, 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* PTM Booking Box */}
      <div className="p-6 sm:p-7 rounded-2xl bg-blue-50 border border-blue-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase">Term 1 Consultation</span>
            <h3 className="text-xl font-bold font-cinzel text-slate-900">Parent-Teacher Meeting (PTM) Scheduler</h3>
            <p className="text-xs text-slate-600">
              One-on-one academic appraisal review with subject mentors and class teacher.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-blue-800 text-xs font-bold border border-blue-200">
              Saturday, Sep 12, 2026
            </span>
          </div>
        </div>

        {ptmBooked ? (
          <div className="p-4 rounded-xl bg-white border border-emerald-300 text-emerald-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Your slot is confirmed for <strong>{selectedSlot}</strong> in Room 204.</span>
            </div>
            <button
              onClick={() => setPtmBooked(false)}
              className="text-xs font-semibold text-blue-600 underline"
            >
              Change Slot
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700">Select Available 15-Minute Slot:</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ptmSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    selectedSlot === slot
                      ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleBookPtm}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Confirm PTM Slot
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Parent Notices List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold font-cinzel text-slate-900 pb-2 border-b border-slate-200">
          Parent & Guardian Circulars
        </h3>

        {notices.map(notice => (
          <div
            key={notice.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                {notice.category}
              </span>
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
    </div>
  );
};
