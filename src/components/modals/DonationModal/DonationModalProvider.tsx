import { createContext, useContext, useMemo, useState } from 'react';
import { DonationModal } from './DonationModal';

interface DonationModalContextValue {
  openDonation: () => void;
  closeDonation: () => void;
}

const DonationModalContext = createContext<DonationModalContextValue | null>(null);

export function DonationModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(
    () => ({
      openDonation: () => setOpen(true),
      closeDonation: () => setOpen(false),
    }),
    []
  );

  return (
    <DonationModalContext.Provider value={value}>
      {children}
      <DonationModal open={open} onClose={() => setOpen(false)} />
    </DonationModalContext.Provider>
  );
}

// Provider and hook intentionally live together to keep the modal API cohesive.
// eslint-disable-next-line react-refresh/only-export-components
export function useDonationModal() {
  const context = useContext(DonationModalContext);
  if (!context) throw new Error('useDonationModal must be used within DonationModalProvider');
  return context;
}
