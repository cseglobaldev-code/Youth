import { useEffect, useMemo, useState } from 'react';
import { Alert, Checkbox, Form, Input, Modal, Select, Space } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { DIAL_CODES } from '@/data/dialCodes';
import { useLanguage } from '@/context/LanguageContext';
import {
  createDonationSession,
  fetchDonationConfig,
  type DonationConfig,
  type DonationPaymentMethod,
} from '@/api/donations';
import { cn } from '@/lib/utils';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
}

interface DonationFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode?: string;
  phoneNumber?: string;
  amount: number;
  currency: string;
  coverFees?: boolean;
}

type Step = 'details' | 'amount' | 'payment';

const DEFAULT_CONFIG: DonationConfig = {
  country: 'unknown',
  currency: 'USD',
  currencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'JPY', 'VND'],
  feePercent: 0,
  methods: [
    { id: 'card', available: false },
    { id: 'bank_transfer', available: false },
    { id: 'paypal', available: false },
  ],
};

const AMOUNT_PRESETS: Record<string, number[]> = {
  VND: [250000, 500000, 1000000, 2500000],
  JPY: [1000, 2500, 5000, 10000],
  USD: [25, 50, 100, 250],
};

function presetsFor(currency: string) {
  return AMOUNT_PRESETS[currency] || AMOUNT_PRESETS.USD;
}

function formatMoney(value: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'VND' || currency === 'JPY' ? 0 : 2,
    }).format(value || 0);
  } catch {
    return `${value} ${currency}`;
  }
}

export function DonationModal({ open, onClose }: DonationModalProps) {
  const [form] = Form.useForm<DonationFormValues>();
  const { language, t } = useLanguage();
  const copy = t.modals.donate;
  const [step, setStep] = useState<Step>('details');
  const [config, setConfig] = useState<DonationConfig>(DEFAULT_CONFIG);
  const [processing, setProcessing] = useState<DonationPaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currency = Form.useWatch('currency', { form, preserve: true }) || config.currency;
  const amount = Number(Form.useWatch('amount', { form, preserve: true }) || 0);
  const coverFees = Boolean(Form.useWatch('coverFees', { form, preserve: true }));
  const fee = coverFees ? amount * (config.feePercent / 100) : 0;
  const total = amount + fee;

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetchDonationConfig(controller.signal)
      .then((nextConfig) => {
        setConfig(nextConfig);
        form.setFieldsValue({
          currency: nextConfig.currency,
          phoneCode: nextConfig.country === 'VN' ? '+84' : '+1',
          amount: presetsFor(nextConfig.currency)[1],
          coverFees: false,
        });
      });
    return () => controller.abort();
  }, [open, form]);

  const methodAvailability = useMemo(
    () => Object.fromEntries(config.methods.map((method) => [method.id, method.available])),
    [config.methods]
  ) as Record<DonationPaymentMethod, boolean>;

  const resetAndClose = () => {
    if (processing) return;
    form.resetFields();
    setStep('details');
    setError(null);
    onClose();
  };

  const continueFromDetails = async () => {
    try {
      await form.validateFields(['firstName', 'lastName', 'email', 'phoneNumber']);
      setError(null);
      setStep('amount');
    } catch {
      // Ant Design renders field validation messages.
    }
  };

  const continueFromAmount = async () => {
    try {
      await form.validateFields(['amount', 'currency']);
      if (amount <= 0) {
        setError(copy.invalidAmount);
        return;
      }
      setError(null);
      setStep('payment');
    } catch {
      // Ant Design renders field validation messages.
    }
  };

  const startPayment = async (paymentMethod: DonationPaymentMethod) => {
    if (!methodAvailability[paymentMethod]) {
      setError(copy.configurationNote);
      return;
    }

    try {
      setProcessing(paymentMethod);
      setError(null);
      const values = await form.validateFields();
      const phoneNumber = values.phoneNumber?.trim()
        ? `${values.phoneCode || ''}${values.phoneNumber.replace(/^0+/, '').replace(/\s+/g, '')}`
        : undefined;
      const session = await createDonationSession({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phoneNumber,
        amount: total,
        currency: values.currency,
        coverFees: Boolean(values.coverFees),
        paymentMethod,
      });
      window.location.assign(session.redirectUrl);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : copy.paymentError);
      setProcessing(null);
    }
  };

  const paymentButtons: Array<{
    id: DonationPaymentMethod;
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      id: 'card',
      label: copy.card,
      description: copy.cardDescription,
      icon: 'lucide:credit-card',
    },
    {
      id: 'bank_transfer',
      label: copy.bankTransfer,
      description: copy.bankDescription,
      icon: 'lucide:landmark',
    },
    {
      id: 'paypal',
      label: copy.paypal,
      description: copy.paypalDescription,
      icon: 'simple-icons:paypal',
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={resetAndClose}
      footer={null}
      centered
      width="min(620px, calc(100vw - 24px))"
      destroyOnHidden
      className="donation-modal"
      classNames={{ container: '!rounded-[22px] !p-0 overflow-hidden' }}
      styles={{
        body: { maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' },
        mask: { backgroundColor: 'rgba(5, 19, 31, 0.72)', backdropFilter: 'blur(5px)' },
      }}
    >
      <div className="bg-gradient-to-br from-[#005D9A] via-[#1771B9] to-[#2494D1] px-6 pb-8 pt-7 text-white sm:px-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
            <Icon name="lucide:heart-handshake" size={23} />
          </span>
          <div>
            <h2 className="m-0 text-[24px] font-bold leading-tight sm:text-[30px]">{copy.title}</h2>
            <p className="m-0 mt-1 max-w-[440px] text-sm leading-relaxed text-white/85">{copy.subtitle}</p>
          </div>
        </div>

        <div className="flex gap-2" aria-label="Donation progress">
          {(['details', 'amount', 'payment'] as Step[]).map((item, index) => {
            const activeIndex = ['details', 'amount', 'payment'].indexOf(step);
            return (
              <span
                key={item}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  index <= activeIndex ? 'bg-white' : 'bg-white/30'
                )}
              />
            );
          })}
        </div>
      </div>

      <Form form={form} layout="vertical" requiredMark={false} className="px-6 py-7 sm:px-10">
          {error && (
            <Alert
              type="warning"
              showIcon
              closable
              message={error}
              onClose={() => setError(null)}
              className="mb-5 rounded-xl"
            />
          )}

          {step === 'details' && (
            <div>
              <h3 className="mb-5 text-xl font-bold text-[#0F2233]">{copy.donorDetails}</h3>
              <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
                <Form.Item
                  name="firstName"
                  label={<span className="font-semibold">{copy.firstName} <span className="text-[#EE334E]">*</span></span>}
                  rules={[{ required: true, whitespace: true, message: `${copy.firstName} is required` }]}
                >
                  <Input size="large" autoComplete="given-name" className="rounded-xl" />
                </Form.Item>
                <Form.Item
                  name="lastName"
                  label={<span className="font-semibold">{copy.lastName} <span className="text-[#EE334E]">*</span></span>}
                  rules={[{ required: true, whitespace: true, message: `${copy.lastName} is required` }]}
                >
                  <Input size="large" autoComplete="family-name" className="rounded-xl" />
                </Form.Item>
              </div>
              <Form.Item
                name="email"
                label={<span className="font-semibold">{copy.email} <span className="text-[#EE334E]">*</span></span>}
                rules={[
                  { required: true, message: `${copy.email} is required` },
                  { type: 'email', message: 'Enter a valid email address' },
                ]}
              >
                <Input size="large" type="email" autoComplete="email" className="rounded-xl" />
              </Form.Item>
              <Form.Item
                label={<span className="font-semibold">{copy.phoneNumber} <span className="font-normal text-neutral-400">({copy.phoneOptional})</span></span>}
              >
                <Space.Compact block>
                  <Form.Item name="phoneCode" noStyle>
                    <Select
                      showSearch
                      optionFilterProp="label"
                      popupMatchSelectWidth={260}
                      size="large"
                      style={{ width: 150 }}
                      options={DIAL_CODES.map((item) => ({
                        value: item.code,
                        label: `${item.code} ${item.country}`,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    noStyle
                    rules={[{ pattern: /^[0-9 ()-]{6,20}$/, message: 'Enter a valid phone number' }]}
                  >
                    <Input
                      size="large"
                      inputMode="tel"
                      autoComplete="tel-national"
                      style={{ width: 'calc(100% - 150px)' }}
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
              <button
                type="button"
                onClick={continueFromDetails}
                className="mt-2 w-full rounded-full bg-[#1771B9] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#125A94] active:scale-[0.99]"
              >
                {copy.continue}
              </button>
            </div>
          )}

          {step === 'amount' && (
            <div>
              <h3 className="mb-5 text-xl font-bold text-[#0F2233]">{copy.amountTitle}</h3>
              <Form.Item name="currency" label={<span className="font-semibold">{copy.currency}</span>}>
                <Select
                  size="large"
                  className="w-full"
                  options={config.currencies.map((item) => ({ value: item, label: item }))}
                  onChange={(nextCurrency) => form.setFieldValue('amount', presetsFor(nextCurrency)[1])}
                />
              </Form.Item>
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {presetsFor(currency).map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => form.setFieldValue('amount', preset)}
                    className={cn(
                      'rounded-xl border px-2 py-3 text-sm font-bold transition',
                      amount === preset
                        ? 'border-[#1771B9] bg-[#EAF3FA] text-[#125A94] ring-1 ring-[#1771B9]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-[#1771B9]'
                    )}
                  >
                    {formatMoney(preset, currency, language)}
                  </button>
                ))}
              </div>
              <Form.Item
                name="amount"
                label={<span className="font-semibold">{copy.customAmount}</span>}
                rules={[{ required: true, type: 'number', min: 1, message: copy.invalidAmount }]}
                getValueFromEvent={(event) => Number(event.target.value)}
              >
                <Input size="large" type="number" min={1} inputMode="decimal" suffix={currency} className="rounded-xl" />
              </Form.Item>
              {config.feePercent > 0 && (
                <Form.Item name="coverFees" valuePropName="checked" className="mb-4">
                  <Checkbox>{copy.coverFees}</Checkbox>
                </Form.Item>
              )}
              <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#F3F8FC] px-5 py-4">
                <span className="font-semibold text-neutral-600">{copy.total}</span>
                <strong className="text-xl text-[#005D9A]">{formatMoney(total, currency, language)}</strong>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('details')} className="rounded-full border border-neutral-300 px-6 py-3.5 font-bold text-neutral-700 hover:bg-neutral-50">
                  {copy.editDetails}
                </button>
                <button type="button" onClick={continueFromAmount} className="flex-1 rounded-full bg-[#1771B9] px-6 py-3.5 font-bold text-white hover:bg-[#125A94]">
                  {copy.continue}
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <div className="mb-5 text-center">
                <p className="m-0 text-sm font-semibold text-neutral-500">{copy.oneTimeDonation}</p>
                <p className="m-0 mt-1 text-[32px] font-extrabold tracking-tight text-[#0F2233]">
                  {formatMoney(total, currency, language)}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-neutral-500">
                  <Icon name="lucide:shield-check" size={17} className="text-emerald-600" />
                  {copy.secureNote}
                </div>
              </div>

              <h3 className="mb-3 text-center text-base font-bold text-[#0F2233]">{copy.choosePayment}</h3>
              <div className="space-y-3">
                {paymentButtons.map((method) => {
                  const available = methodAvailability[method.id];
                  const busy = processing === method.id;
                  return (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => startPayment(method.id)}
                      disabled={Boolean(processing)}
                      className={cn(
                        'group w-full rounded-xl border px-4 py-3.5 text-left transition active:scale-[0.995]',
                        available
                          ? 'border-[#151515] bg-[#151515] text-white hover:bg-black'
                          : 'border-neutral-200 bg-neutral-100 text-neutral-500 hover:border-neutral-300'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={cn('flex h-9 w-9 items-center justify-center rounded-lg', available ? 'bg-white/10' : 'bg-white')}>
                          <Icon name={busy ? 'lucide:loader-circle' : method.icon} size={20} className={busy ? 'animate-spin' : ''} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2 font-bold">
                            {busy ? copy.processing : method.label}
                            {method.id === 'card' && (
                              <span className="flex gap-1">
                                {['VISA', 'MC', 'AMEX'].map((brand) => (
                                  <span key={brand} className="rounded bg-white px-1.5 py-0.5 text-[9px] font-extrabold text-[#0F4B8E]">{brand}</span>
                                ))}
                              </span>
                            )}
                          </span>
                          <span className={cn('mt-0.5 block text-xs', available ? 'text-white/65' : 'text-neutral-400')}>
                            {available ? method.description : copy.unavailable}
                          </span>
                        </span>
                        <Icon name="lucide:chevron-right" size={18} />
                      </span>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => setStep('amount')} className="mt-5 w-full py-2 text-sm font-semibold text-[#005D9A] hover:underline">
                {copy.editDetails}
              </button>
            </div>
          )}
      </Form>
    </Modal>
  );
}
