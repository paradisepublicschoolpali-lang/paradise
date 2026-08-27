import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, MapPin, Clock, Users, Search, Check, Plus } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const EventsPage: React.FC = () => {
  const { events, rsvpEvent } = useSchoolData();
  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpdEvents, setRsvpdEvents] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Sports', 'Cultural', 'Academic', 'Exhibition'];

  const filteredEvents = events.filter(e => {
    const matchesCat = selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRsvp = (eventId: string, title: string) => {
    if (rsvpdEvents[eventId]) {
      toast('Already Reserved', `You are already registered for ${title}`, 'info');
      return;
    }

    rsvpEvent(eventId);
    setRsvpdEvents({ ...rsvpdEvents, [eventId]: true });
    toast('Pass Reserved!', `Confirmation sent for "${title}". See you there!`, 'success');
  };

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Campus Life & Symposia</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">Events & Ceremonial Calendar</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Experience athletic galas, musical concerts, robotics expos, and international summits.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
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
              placeholder="Search events, venues..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredEvents.map(event => {
            const hasRsvpd = rsvpdEvents[event.id];

            return (
              <div
                key={event.id}
                className="rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs font-bold text-[10px] text-blue-800 uppercase shadow-xs">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold font-cinzel text-slate-900">{event.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{event.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span><strong>{event.rsvpCount}</strong> attending</span>
                  </div>

                  <button
                    onClick={() => handleRsvp(event.id, event.title)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      hasRsvpd
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {hasRsvpd ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Pass Reserved</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>RSVP Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
