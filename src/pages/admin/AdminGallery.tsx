import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useToast } from '../../context/ToastContext';
import { GalleryItem } from '../../types';
import { Image as ImageIcon, Plus, Calendar, Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal } from '../../components/common/Modal';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminGallery: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useSchoolData();
  const { toast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // New Media Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Campus');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=800');
  const [description, setDescription] = useState('');

  const handleCreatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      toast('Please provide a title and image URL', '', 'error');
      return;
    }

    addGalleryItem({
      title,
      category,
      imageUrl,
      description: description || 'Paradise Public School campus photograph.'
    });

    toast('Photo Added to Gallery!', `Published to public gallery under ${category}`, 'success');
    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateGalleryItem(editingItem.id, editingItem);
    toast('Gallery Item Updated', `Saved changes for "${editingItem.title}"`, 'success');
    setEditingItem(null);
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`Delete photo "${itemTitle}" from gallery?`)) {
      deleteGalleryItem(id);
      toast('Photo Removed', '', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-slate-900">Media & Campus Gallery Directorate</h3>
          <p className="text-xs text-slate-500">Curate, edit, and organize high-resolution campus photography and athletic archives</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media File</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map(item => (
          <div
            key={item.id}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/90 font-bold text-blue-800 text-[9px] uppercase shadow-xs">
                    {item.category}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold font-cinzel text-slate-900 line-clamp-1">{item.title}</h4>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingItem({ ...item })}
                      className="p-1 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 transition-colors border border-slate-200"
                      title="Edit Photo Info"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1 rounded-md bg-slate-100 hover:bg-red-100 hover:text-red-700 text-slate-600 transition-colors border border-slate-200"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span>{formatDate(item.date)}</span>
              </div>
              <span className="text-emerald-600 font-semibold">Live on Website</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload Media to Campus Gallery"
        subtitle="Publish a photograph to the public showcase"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePhoto} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Photo / Album Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Nanotechnology Laboratory Session"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Campus">Campus Infrastructure</option>
              <option value="Sports">Olympic Sports & Pavilion</option>
              <option value="Academics">STEM & Research Labs</option>
              <option value="Arts & Culture">Arts, Symphony & Drama</option>
              <option value="Celebrations">Investiture & Annual Ceremonies</option>
            </select>
          </div>

          <ImageUploadInput
            label="Campus Photograph File or URL"
            value={imageUrl}
            onChange={(val) => setImageUrl(val)}
            placeholder="Upload local photo or paste URL..."
            shape="wide"
            helperText="Upload JPG/PNG photo from your computer or paste image URL."
            required
          />

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Caption & Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief contextual details about this photograph..."
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
              Upload & Publish
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Media Modal */}
      <Modal
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        title="Edit Gallery Photograph"
        subtitle={editingItem ? `Editing: ${editingItem.title}` : ''}
        maxWidth="lg"
      >
        {editingItem && (
          <form onSubmit={handleUpdatePhoto} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Photo Title</label>
              <input
                type="text"
                required
                value={editingItem.title}
                onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={editingItem.category}
                onChange={e => setEditingItem({ ...editingItem, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              >
                <option value="Campus">Campus Infrastructure</option>
                <option value="Sports">Olympic Sports & Pavilion</option>
                <option value="Academics">STEM & Research Labs</option>
                <option value="Arts & Culture">Arts, Symphony & Drama</option>
                <option value="Celebrations">Investiture & Annual Ceremonies</option>
              </select>
            </div>

            <ImageUploadInput
              label="Campus Photograph File or URL"
              value={editingItem.imageUrl}
              onChange={(val) => setEditingItem({ ...editingItem, imageUrl: val })}
              placeholder="Upload local photo or paste URL..."
              shape="wide"
              helperText="Upload JPG/PNG photo from your computer or paste image URL."
              required
            />

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Caption</label>
              <textarea
                rows={3}
                value={editingItem.description}
                onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
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
