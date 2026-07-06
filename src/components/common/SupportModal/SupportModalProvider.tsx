import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SupportModal, type SupportFormValues } from './SupportModal';

interface SupportModalContextValue {
  /** Open the support form modal. */
  openSupport: () => void;
  /** Close the support form modal. */
  closeSupport: () => void;
}

const SupportModalContext = createContext<SupportModalContextValue | null>(null);

export interface SupportModalProviderProps {
  children: React.ReactNode;
  /** Optional submit handler — receives validated form values. */
  onSubmit?: (values: SupportFormValues) => void;
}

export function SupportModalProvider({ children, onSubmit }: SupportModalProviderProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const value = useMemo<SupportModalContextValue>(
    () => ({
      openSupport: () => setOpen(true),
      closeSupport: () => setOpen(false),
    }),
    []
  );

  return (
    <SupportModalContext.Provider value={value}>
      {children}
      <SupportModal open={open} onClose={close} onSubmit={onSubmit} />
    </SupportModalContext.Provider>
  );
}

export function useSupportModal() {
  const ctx = useContext(SupportModalContext);
  if (!ctx) {
    throw new Error('useSupportModal must be used within a SupportModalProvider');
  }
  return ctx;
}