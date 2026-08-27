import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Sparkles, Check } from 'lucide-react';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  presets?: string[];
  shape?: 'square' | 'circle' | 'wide';
  helperText?: string;
  required?: boolean;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Upload image file or paste URL...',
  presets = [],
  shape = 'square',
  helperText,
  required = false
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert file to Base64 Data URL
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP, SVG, GIF)');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Canvas compression to keep local storage compact & fast
        const maxDimension = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
          onChange(compressedDataUrl);
        } else {
          onChange(e.target?.result as string);
        }
        setIsLoading(false);
      };

      img.onerror = () => {
        onChange(e.target?.result as string);
        setIsLoading(false);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      alert('Failed to read file.');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const previewClasses = {
    square: 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl',
    circle: 'w-20 h-20 sm:w-24 sm:h-24 rounded-full',
    wide: 'w-28 h-20 sm:w-36 sm:h-24 rounded-2xl'
  };

  return (
    <div className="space-y-2 text-xs">
      {label && (
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'upload' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Upload Local</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('url')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeMode === 'url' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>Web URL</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-200">
        {/* Visual Preview */}
        <div className="relative shrink-0 flex items-center justify-center">
          {value ? (
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className={`${previewClasses[shape]} object-cover border-2 border-blue-500 shadow-sm bg-white`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300';
                }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Clear image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              className={`${previewClasses[shape]} border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400`}
            >
              <ImageIcon className="w-6 h-6 stroke-1" />
              <span className="text-[9px] uppercase tracking-wider font-semibold mt-1">No Photo</span>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex-1 w-full space-y-2">
          {activeMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-3.5 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-xs">
                    {isLoading ? 'Processing Image...' : 'Click to Browse / Choose File'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  or drag & drop JPG, PNG, WebP, SVG from your device
                </span>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Quick Presets if supplied */}
          {presets.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-slate-400 font-medium">Presets:</span>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChange(preset)}
                  className={`w-6 h-6 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                    value === preset ? 'border-blue-600 ring-2 ring-blue-400 scale-105' : 'border-slate-300 hover:border-blue-400'
                  }`}
                  title="Use preset image"
                >
                  <img src={preset} alt={`preset-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
        </div>
      </div>
    </div>
  );
};
