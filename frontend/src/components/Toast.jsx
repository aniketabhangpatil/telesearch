import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map(toast => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-glass border backdrop-blur-xl ${
                isError
                  ? 'bg-red-950/80 border-red-500/30 text-red-200'
                  : isSuccess
                  ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                  : 'bg-navy-900/90 border-cyan-500/30 text-cyan-200'
              }`}
            >
              <div className="mt-0.5">
                {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {!isError && !isSuccess && <Info className="w-5 h-5 text-cyan-400" />}
              </div>
              <div className="flex-1 text-sm leading-relaxed">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

