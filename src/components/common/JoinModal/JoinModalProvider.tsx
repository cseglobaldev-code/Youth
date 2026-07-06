import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { RegisterOrganizationModal } from '@/components/common/RegisterOrganizationModal';
import { ApplyRoleModal } from '@/components/common/ApplyRoleModal';
import { JoinChoiceModal } from './JoinChoiceModal';

type JoinStep = 'closed' | 'choice' | 'organization' | 'individual';

interface JoinModalContextValue {
  /** Open the "choose how to join" popup (used by the header CTA). */
  openJoin: () => void;
  /** Open the organization registration form directly. */
  openOrganization: () => void;
  /** Open the individual leadership-role form directly. */
  openIndividual: () => void;
}

const JoinModalContext = createContext<JoinModalContextValue | null>(null);

export function JoinModalProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<JoinStep>('closed');

  const close = useCallback(() => setStep('closed'), []);

  const value = useMemo<JoinModalContextValue>(
    () => ({
      openJoin: () => setStep('choice'),
      openOrganization: () => setStep('organization'),
      openIndividual: () => setStep('individual'),
    }),
    []
  );

  return (
    <JoinModalContext.Provider value={value}>
      {children}

      <JoinChoiceModal
        open={step === 'choice'}
        onClose={close}
        onNext={(choice) => setStep(choice)}
      />
      <RegisterOrganizationModal open={step === 'organization'} onClose={close} />
      <ApplyRoleModal open={step === 'individual'} onClose={close} />
    </JoinModalContext.Provider>
  );
}

export function useJoinModal() {
  const ctx = useContext(JoinModalContext);
  if (!ctx) {
    throw new Error('useJoinModal must be used within a JoinModalProvider');
  }
  return ctx;
}
