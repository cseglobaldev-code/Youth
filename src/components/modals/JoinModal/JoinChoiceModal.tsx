import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { useLanguage } from '@/context/LanguageContext';

export type JoinChoice = 'organization' | 'individual';

export interface JoinChoiceModalProps {
  open: boolean;
  onClose: () => void;
  onNext: (choice: JoinChoice) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };

export function JoinChoiceModal({ open, onClose, onNext }: JoinChoiceModalProps) {
  const { t } = useLanguage();
  const [choice, setChoice] = useState<JoinChoice>('organization');

  useEffect(() => {
    if (open) setChoice('organization');
  }, [open]);

  const options = [
    { value: 'organization' as const, label: t.modals.joinChoice.asOrg },
    { value: 'individual' as const, label: t.modals.joinChoice.asIndiv },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={860}
      destroyOnHidden
      classNames={{ container: '!rounded-[24px] !p-[40px]' }}
      styles={{
        body: { maxHeight: 686, overflowY: 'auto' },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      <h2 className="font-bold text-[28px] sm:text-[36px] text-[#111111] mb-4" style={FONT}>
        {t.modals.joinChoice.title}
      </h2>
      <p className="text-neutral-600 text-[16px] sm:text-[18px] mb-6" style={FONT}>
        {t.modals.joinChoice.subtitle}
      </p>

      <div className="flex flex-col gap-4 mb-8">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 cursor-pointer select-none rounded-lg px-2 py-1 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={FONT}
          >
            <input
              type="radio"
              name="join-choice"
              value={opt.value}
              checked={choice === opt.value}
              onChange={() => setChoice(opt.value)}
              className="w-5 h-5 accent-[#005D9A] cursor-pointer"
            />
            <span className="text-[16px] sm:text-[18px] text-[#111111]">{opt.label}</span>
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onNext(choice)}
        className="w-full rounded-full bg-[#EE334E] px-8 py-4 text-white text-[18px] sm:text-[20px] font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={FONT}
      >
        {t.modals.joinChoice.next}
      </button>
    </Modal>
  );
}