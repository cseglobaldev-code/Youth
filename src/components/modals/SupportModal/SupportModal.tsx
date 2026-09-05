import { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, ConfigProvider, Radio, Alert } from 'antd';
import { PillButton } from '@/components/ui/PillButton';
import { maxWordsRule } from '@/lib/utils';
import { submitSupportSubmission } from '@/api/applications';
import { fetchGlobalSettings, DEFAULT_GLOBAL_SETTINGS } from '@/api/global';
import { fetchProjects } from '@/api/projects';
import type { GlobalSetting } from '@/types';
import financialGiftQrCodeUrl from './financial-gift-qrcode.png';

export interface SupportFormValues {
  fullName: string;
  email: string;
  projects: string[];
  letter: string;
  financialGiftDetails?: string;
  donationFrequency?: 'monthly' | 'quarterly' | 'other' | 'once';
}

export interface SupportModalProps {
  open: boolean;
  onClose: () => void;
  projects?: { value: string; label: string }[];
  onSubmit?: (values: SupportFormValues) => void | Promise<void>;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };

const requiredMark = (text: string) => (
  <span style={FONT}>
    {text} <span className="text-[#EE334E]">*</span>
  </span>
);

export function SupportModal({
  open,
  onClose,
  projects: customProjects,
  onSubmit,
}: SupportModalProps) {
  const [form] = Form.useForm<SupportFormValues>();
  const [step, setStep] = useState<'letter' | 'financial'>('letter');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<GlobalSetting>(DEFAULT_GLOBAL_SETTINGS);
  const [projectOptions, setProjectOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (open) {
      fetchGlobalSettings()
        .then(setSettings)
        .catch(() => setSettings(DEFAULT_GLOBAL_SETTINGS));

      if (customProjects && customProjects.length > 0) {
        setProjectOptions(customProjects);
      } else {
        fetchProjects()
          .then((projects) => {
            if (projects.length > 0) {
              setProjectOptions(projects.map((p) => ({ value: p.id, label: p.name })));
            }
          })
          .catch(() => {
            setProjectOptions([
              { value: 'education-initiative', label: 'Education for All Initiative' },
              { value: 'green-belt', label: 'Green Belt Movement' },
            ]);
          });
      }
    }
  }, [open, customProjects]);

  const reset = () => {
    form.resetFields();
    setStep('letter');
    setSubmitted(false);
    setErrorMessage(null);
  };

  const close = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const goToFinancialGift = async () => {
    try {
      await form.validateFields(['fullName', 'email', 'projects', 'letter']);
      setStep('financial');
    } catch {
      /* validation errors are shown inline by antd */
    }
  };

  const handleSendLetterOnly = async () => {
    try {
      const values = await form.validateFields(['fullName', 'email', 'projects', 'letter']);
      setSubmitting(true);
      setErrorMessage(null);
      await submitSupportSubmission({
        ...values,
        financialGiftDetails: undefined,
        donationFrequency: 'once',
      });
      await onSubmit?.(values);
      setSubmitted(true);
    } catch (error: any) {
      if (error?.errorFields) return; // Antd validation error
      console.error('Failed to submit support letter:', error);
      setErrorMessage(error?.message || 'Failed to submit your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async (values: SupportFormValues) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await submitSupportSubmission(values);
      await onSubmit?.(values);
      setSubmitted(true);
    } catch (error: any) {
      console.error('Failed to submit support gift to Strapi:', error);
      setErrorMessage(error?.message || 'Failed to submit your contribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const finishAndClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      centered
      width="min(720px, calc(100vw - 32px))"
      classNames={{ container: '!rounded-[16px] sm:!rounded-[24px] !p-5 sm:!p-[40px]' }}
      styles={{
        body: { maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
      destroyOnHidden
    >
      {errorMessage && (
        <Alert
          type="error"
          showIcon
          message="Submission Error"
          description={errorMessage}
          closable
          onClose={() => setErrorMessage(null)}
          className="mb-4"
        />
      )}

      {submitted ? (
        <div className="py-4 sm:py-6">
          <h2 className="font-bold text-[26px] sm:text-[34px] text-[#111111] mb-4" style={FONT}>
            Thank you for your support!
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#111111] leading-relaxed mb-8" style={FONT}>
            Your letter and well-wishes have been delivered to the project teams. Every message —
            and every contribution — helps sustain the work on the ground.
          </p>
          <PillButton variant="solid" size="lg" fullWidth onClick={finishAndClose}>
            Done
          </PillButton>
        </div>
      ) : (
        <>
          <h2 className="font-bold text-[26px] sm:text-[34px] text-[#111111] mb-1" style={FONT}>
            The Warmest Postbox
          </h2>
          <p className="text-[14px] sm:text-[16px] text-neutral-600 mb-6" style={FONT}>
            Send a letter of well-wishes — and fuel a project with your support.
          </p>

          <ConfigProvider theme={{ token: { controlHeight: 46, borderRadius: 8 } }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              requiredMark={false}
              scrollToFirstError
            >
              {step === 'letter' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                    <Form.Item
                      label={requiredMark('Full Name')}
                      name="fullName"
                      rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                      <Input placeholder="Enter your full name" style={FONT} />
                    </Form.Item>
                    <Form.Item
                      label={requiredMark('Email')}
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' },
                      ]}
                    >
                      <Input placeholder="Enter your email address" style={FONT} />
                    </Form.Item>
                  </div>

                  <Form.Item
                    label={requiredMark('Which projects would you like to support?')}
                    name="projects"
                    rules={[
                      { required: true, message: 'Please select at least one project' },
                      {
                        validator: (_, value: string[]) =>
                          value && value.length > 0
                            ? Promise.resolve()
                            : Promise.reject(new Error('Please select at least one project')),
                      },
                    ]}
                    extra={
                      <span className="italic text-[13px]" style={FONT}>
                        You can select multiple options.
                      </span>
                    }
                  >
                    <Checkbox.Group className="w-full">
                      <div className="flex flex-col gap-2">
                        {projectOptions.map((project) => (
                          <Checkbox key={project.value} value={project.value} style={FONT}>
                            {project.label}
                          </Checkbox>
                        ))}
                      </div>
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label={requiredMark('Letter/Message of Well-Wishes and Support')}
                    name="letter"
                    rules={[
                      { required: true, message: 'Please write your letter of support' },
                      maxWordsRule(400, 'Please keep your letter within 400 words'),
                    ]}
                    extra={
                      <span className="italic text-[13px]" style={FONT}>
                        Maximum 400 words
                      </span>
                    }
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Share your well-wishes and words of encouragement…"
                      style={FONT}
                    />
                  </Form.Item>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <PillButton
                      as="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                      disabled={submitting}
                      onClick={handleSendLetterOnly}
                    >
                      Send Letter of Support Only
                    </PillButton>
                    <PillButton
                      as="button"
                      variant="solid"
                      size="lg"
                      fullWidth
                      disabled={submitting}
                      onClick={goToFinancialGift}
                    >
                      Fuel with Financial Gift
                    </PillButton>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mb-6 text-[24px] font-bold text-[#111111] sm:text-[26px]" style={FONT}>
                    A Financial Gift
                  </h3>

                  <Form.Item
                    label={requiredMark('Financial Gift Details')}
                    name="financialGiftDetails"
                    rules={[{ required: true, message: 'Please enter financial gift details or amount' }]}
                  >
                    <Input placeholder="e.g. 50 USD / Bank transfer pledge" style={FONT} />
                  </Form.Item>

                  <div className="mb-6 text-[16px] leading-relaxed text-[#111111]" style={FONT}>
                    <p className="mb-2 text-[18px] font-bold">QR Code</p>
                    <p className="mb-2 font-bold italic text-neutral-600">
                      Note: Press and hold the QR code to save it to your phone
                    </p>
                    <p className="font-bold">Bank Account Information</p>
                    <p className="italic">- Account Number: {settings.accountNumber}</p>
                    <p className="italic">- Account Holder: {settings.accountHolder}</p>
                    <p className="italic">- Bank: {settings.bankName}</p>
                    <p className="italic">- Transfer Description: {settings.transferSyntaxNote}</p>
                  </div>

                  <div className="mb-8 flex justify-center">
                    <img
                      src={settings.qrCodeImageUrl || financialGiftQrCodeUrl}
                      alt="Payment QR code"
                      className="h-auto w-[250px] sm:w-[310px] object-contain rounded-2xl shadow-sm"
                    />
                  </div>

                  <Form.Item
                    label={requiredMark('How often would you like to repeat your donation?')}
                    name="donationFrequency"
                    initialValue="monthly"
                    rules={[{ required: true, message: 'Please select donation frequency' }]}
                  >
                    <Radio.Group className="w-full">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <Radio value="monthly" style={FONT}>Monthly</Radio>
                        <Radio value="quarterly" style={FONT}>Quarterly</Radio>
                        <Radio value="other" style={FONT}>Other frequencies</Radio>
                        <Radio value="once" style={FONT}>Just one</Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>

                  <div className="flex gap-3 mt-4">
                    <PillButton
                      as="button"
                      variant="outline"
                      size="lg"
                      fullWidth
                      disabled={submitting}
                      onClick={() => setStep('letter')}
                    >
                      Back
                    </PillButton>
                    <PillButton
                      as="button"
                      variant="solid"
                      size="lg"
                      fullWidth
                      disabled={submitting}
                      onClick={() => form.submit()}
                    >
                      {submitting ? 'Sending…' : 'Send'}
                    </PillButton>
                  </div>
                </>
              )}
            </Form>
          </ConfigProvider>
        </>
      )}
    </Modal>
  );
}