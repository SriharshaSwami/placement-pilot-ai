import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, HelpCircle, Info, X } from 'lucide-react';

const ModalContext = createContext(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null); // { id, type, title, description, defaultValue, resolve, isDestructive, confirmLabel, cancelLabel }
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalConfig) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalConfig]);

  // Trap focus inside modal
  useEffect(() => {
    if (modalConfig) {
      // Focus the input if it's a prompt, or the cancel/confirm button
      setTimeout(() => {
        if (modalConfig.type === 'prompt' && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        } else if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex="0"]'
          );
          if (focusable.length > 0) {
            focusable[focusable.length - 1].focus(); // default focus on cancel button
          }
        }
      }, 50);
    }
  }, [modalConfig]);

  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      setModalConfig({
        id: Date.now(),
        type: 'confirm',
        title: options.title || 'Confirm Action',
        description: options.description || 'Are you sure you want to proceed?',
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        isDestructive: options.isDestructive || false,
        resolve,
      });
    });
  };

  const prompt = (options = {}) => {
    return new Promise((resolve) => {
      setModalConfig({
        id: Date.now(),
        type: 'prompt',
        title: options.title || 'Enter Value',
        description: options.description || 'Please fill in the input below:',
        confirmLabel: options.confirmLabel || 'Submit',
        cancelLabel: options.cancelLabel || 'Cancel',
        defaultValue: options.defaultValue || '',
        resolve,
      });
    });
  };

  const handleConfirm = (value) => {
    if (!modalConfig) return;
    modalConfig.resolve(modalConfig.type === 'prompt' ? value : true);
    setModalConfig(null);
  };

  const handleCancel = () => {
    if (!modalConfig) return;
    modalConfig.resolve(modalConfig.type === 'prompt' ? null : false);
    setModalConfig(null);
  };

  return (
    <ModalContext.Provider value={{ confirm, prompt }}>
      {children}
      <AnimatePresence>
        {modalConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-surface-light p-6 shadow-2xl dark:bg-surface-dark border border-slate-200 dark:border-slate-800"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-start gap-4">
                {/* Icon mapping */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  modalConfig.isDestructive
                    ? 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'
                    : modalConfig.type === 'prompt'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400'
                    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                }`}>
                  {modalConfig.isDestructive ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : modalConfig.type === 'prompt' ? (
                    <HelpCircle className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1">
                  <h3
                    id="modal-title"
                    className="text-lg font-semibold leading-6 text-slate-900 dark:text-white"
                  >
                    {modalConfig.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {modalConfig.description}
                  </p>

                  {/* Input element for prompts */}
                  {modalConfig.type === 'prompt' && (
                    <div className="mt-4">
                      <input
                        ref={inputRef}
                        type="text"
                        defaultValue={modalConfig.defaultValue}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleConfirm(e.target.value);
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 shadow-inner outline-none transition-all focus:border-primary-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-primary-500"
                        placeholder="Enter value..."
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-surface-light px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-surface-dark dark:text-slate-300 dark:hover:bg-slate-800/80 transition-colors shadow-sm"
                    >
                      {modalConfig.cancelLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val = inputRef.current ? inputRef.current.value : undefined;
                        handleConfirm(val);
                      }}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                        modalConfig.isDestructive
                          ? 'bg-red-600 hover:bg-red-500'
                          : 'bg-primary-600 hover:bg-primary-500'
                      }`}
                    >
                      {modalConfig.confirmLabel}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};
