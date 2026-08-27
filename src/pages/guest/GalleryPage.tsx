import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Image as ImageIcon, ZoomIn, X, Calendar, Tag } from 'lucide-react';
import { GalleryItem } from '../../types';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';

export const GalleryPage: React.FC = () => {
  const { gallery } = useSchoolData();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Campus', 'Sports', 'Academics', 'Arts & Culture', 'Celebrations'];

  const filteredPhotos = gallery.filter(item => {
    return selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-16 pb-20 bg-white">
      {/* Banner */}
      <section className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Visual Chronicle</span>
          <h1 className="text-3xl sm:text-5xl font-bold font-cinzel text-slate-900">Campus Photography & Archives</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Glimpses of life at Paradise — scientific discovery, athletic triumphs, and artistic expression.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
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
      </section>

      {/* Photo Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map(item => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="h-64 relative overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/90 text-slate-900 shadow-md">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 font-bold text-[10px] text-blue-800 uppercase shadow-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h4 className="text-sm font-bold text-slate-900 font-cinzel line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                <div className="pt-2 text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Zoom Modal */}
      <Modal
        isOpen={activePhoto !== null}
        onClose={() => setActivePhoto(null)}
        maxWidth="4xl"
      >
        {activePhoto && (
          <div className="space-y-4">
            <div className="max-h-[70vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase">{activePhoto.category}</span>
                <span className="text-xs text-slate-400 font-mono">{formatDate(activePhoto.date)}</span>
              </div>
              <h3 className="text-xl font-bold font-cinzel text-slate-900">{activePhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activePhoto.description}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
