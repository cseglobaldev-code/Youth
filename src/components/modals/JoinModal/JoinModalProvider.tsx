import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RegisterOrganizationModal } from '@/components/modals/RegisterOrganizationModal';
import { ApplyRoleModal } from '@/components/modals/ApplyRoleModal';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const directForm = searchParams.get('form');

  useEffect(() => {
    if (directForm === 'organization' || directForm === 'individual') {
      setStep(directForm);
      return;
    }

    if (directForm !== null) setStep('closed');
  }, [directForm]);

  const close = useCallback(() => {
    setStep('closed');

    if (!searchParams.has('form')) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('form');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

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
