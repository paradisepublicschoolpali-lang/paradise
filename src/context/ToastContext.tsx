import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'gold';

interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((title: string, message?: string, type: ToastType = 'gold') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl flex items-start gap-3 backdrop-blur-xl border ${
                t.type === 'success'
                  ? 'bg-[#0f1d14]/95 border-emerald-500/40 text-emerald-100'
                  : t.type === 'error'
                  ? 'bg-[#230f0f]/95 border-rose-500/40 text-rose-100'
                  : t.type === 'info'
                  ? 'bg-[#0e1726]/95 border-sky-500/40 text-sky-100'
                  : 'bg-[#18150a]/95 border-[#D4AF37]/50 text-amber-50 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
                {t.type === 'gold' && <div className="w-5 h-5 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#F5D77F]">★</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight text-white">{t.title}</div>
                {t.message && <div className="text-xs text-slate-300 mt-1 leading-relaxed">{t.message}</div>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
