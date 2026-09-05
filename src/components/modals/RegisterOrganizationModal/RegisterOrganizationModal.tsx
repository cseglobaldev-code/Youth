import { useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Radio, Upload, ConfigProvider, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PillButton } from '@/components/ui/PillButton';
import { urlRule, phoneRule, maxWordsRule, countryFlagEmoji } from '@/lib/utils';
import { submitOrganizationApplication } from '@/api/applications';
import { DIAL_CODES } from '@/data/dialCodes';
import { SDGS_DATA } from '@/data/sdgs';

export interface RegisterOrganizationFormValues {
  // Step 1 — Organization
  organizationName: string;
  organizationDescription: string;
  representativeFullName: string;
  representativePhone: string;
  representativePhoneCode: string;
  yearOfEstablishment: number;
  country: string;
  address: string;
  email: string;
  website?: string;
  focusArea: string;
  focusSDGs: number[];
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  organizationImage?: unknown[];
  organizationLogo?: unknown[];
  // Step 2 — Project Information
  projectName: string;
  projectOrganizationName: string;
  projectDescription: string;
  projectLedBy: string;
  socialImpactMetrics: string;
  region: string;
  countriesCovered: string;
  projectFocusSDGs: number[];
  projectStatus: 'ongoing' | 'completed' | 'planned';
  projectImages?: unknown[];
  projectSocialProfile: string;
}

export interface RegisterOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: RegisterOrganizationFormValues) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };

const YEARS = Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i);

const PROJECT_STATUS_OPTIONS: { value: 'ongoing' | 'completed' | 'planned'; label: string }[] = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'planned', label: 'Planning' },
  { value: 'completed', label: 'Completed' },
];

const GLOBAL_REGIONS = [
  'Southeast Asia',
  'East Asia',
  'South Asia',
  'Central Asia',
  'West Asia',
  'North Asia',
  'North Africa',
  'West Africa',
  'Central Africa',
  'East Africa',
  'Southern Africa',
  'North America',
  'Central America',
  'Caribbean',
  'South America',
  'Australia',
  'New Zealand',
  'Melanesia',
  'Micronesia',
  'Polynesia',
  'Northern Europe',
  'Western Europe',
  'Eastern Europe',
  'Southern Europe',
  'Global',
];

const STEP_FIELDS: Record<1 | 2, (keyof RegisterOrganizationFormValues)[]> = {
  1: [
    'organizationName',
    'organizationDescription',
    'representativeFullName',
    'representativePhone',
    'yearOfEstablishment',
    'country',
    'address',
    'email',
    'website',
    'facebookUrl',
    'instagramUrl',
    'linkedinUrl',
    'focusArea',
    'focusSDGs',
    'organizationImage',
    'organizationLogo',
  ],
  2: [
    'projectName',
    'projectOrganizationName',
    'projectDescription',
    'projectLedBy',
    'socialImpactMetrics',
    'region',
    'countriesCovered',
    'projectFocusSDGs',
    'projectStatus',
    'projectImages',
    'projectSocialProfile',
  ],
};

const labelText = (text: string) => <span style={FONT}>{text}</span>;

const normFile = (e: unknown) => {
  if (Array.isArray(e)) return e;
  return (e as { fileList?: unknown[] })?.fileList;
};

export function RegisterOrganizationModal({
  open,
  onClose,
  onSubmit,
}: RegisterOrganizationModalProps) {
  const [form] = Form.useForm<RegisterOrganizationFormValues>();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const close = () => {
    if (submitting) return;
    setErrorMessage(null);
    onClose();
  };

  const finishAndClose = () => {
    form.resetFields();
    setStep(1);
    setSubmitted(false);
    setErrorMessage(null);
    onClose();
  };

  const handleNext = async () => {
    try {
      await form.validateFields(STEP_FIELDS[step]);
      setStep((s) => (s < 2 ? ((s + 1) as 1 | 2) : s));
    } catch {
      /* validation errors are shown inline by antd */
    }
  };

  const handleFinish = async (values: RegisterOrganizationFormValues) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      await submitOrganizationApplication(values);
      onSubmit?.(values);
      setSubmitted(true);
    } catch (error: any) {
      console.error('Failed to submit organization application:', error);
      setErrorMessage(error?.message || 'Failed to submit application. Please check your network connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      centered
      width="min(760px, calc(100vw - 32px))"
      classNames={{ container: '!rounded-[16px] sm:!rounded-[24px] !p-5 sm:!p-[40px]' }}
      styles={{
        body: { maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
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
            Thank you for submitting your application!
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#111111] leading-relaxed mb-8" style={FONT}>
            We appreciate your time and interest in joining us. Your application has been
            successfully received. Keep an eye on your inbox, as we will update you on the next
            steps soon!
          </p>
          <PillButton variant="solid" size="lg" fullWidth onClick={finishAndClose}>
            Done
          </PillButton>
        </div>
      ) : (
      <>
      <h2 className="font-bold text-[26px] sm:text-[34px] text-[#111111] mb-1" style={FONT}>
        Membership Registration
      </h2>
      <p className="font-semibold text-[16px] sm:text-[18px] text-[#111111] mb-5" style={FONT}>
        {step === 1 ? 'For Organizations' : 'Project Information'}
      </p>

      <ConfigProvider theme={{ token: { controlHeight: 46, borderRadius: 8 } }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark scrollToFirstError>
          {/* STEP 1 */}
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <Form.Item
              label={labelText('Organization Name')}
              name="organizationName"
              rules={[{ required: true, message: 'Please enter organization name' }]}
            >
              <Input placeholder="Enter your organization name" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Organization Description')}
              name="organizationDescription"
              rules={[
                { required: true, message: 'Please enter organization description' },
                { max: 500, message: 'Description must be at most 500 characters' },
              ]}
            >
              <Input.TextArea
                rows={3}
                maxLength={500}
                showCount
                placeholder="Describe your organization"
                style={FONT}
              />
            </Form.Item>

            <Form.Item
              label={labelText("Representative's Full Name")}
              name="representativeFullName"
              rules={[{ required: true, message: 'Please enter full name' }]}
            >
              <Input placeholder="Enter full name" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText("Representative's Phone Number")}
              name="representativePhone"
              rules={[
                { required: true, message: 'Please enter phone number' },
                phoneRule(),
              ]}
            >
              <Input
                placeholder="Enter phone number"
                addonBefore={
                  <Form.Item name="representativePhoneCode" noStyle initialValue="+84">
                    <Select
                      showSearch
                      style={{ width: 120 }}
                      optionFilterProp="title"
                      options={DIAL_CODES.map((d) => ({
                        value: d.code,
                        label: `${countryFlagEmoji(d.country)} ${d.code}`,
                        title: `${d.country} ${d.code}`,
                      }))}
                    />
                  </Form.Item>
                }
                style={FONT}
              />
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Form.Item
                label={labelText('Year of Establishment')}
                name="yearOfEstablishment"
                rules={[{ required: true, message: 'Please select year' }]}
              >
                <Select
                  placeholder="Select year"
                  options={YEARS.map((y) => ({ value: y, label: String(y) }))}
                  showSearch
                />
              </Form.Item>
              <Form.Item
                label={labelText('Country')}
                name="country"
                rules={[{ required: true, message: 'Please select country' }]}
              >
                <Select
                  placeholder="Select country"
                  options={DIAL_CODES.map((d) => ({
                    value: d.country,
                    label: `${countryFlagEmoji(d.country)} ${d.country}`,
                  }))}
                  showSearch
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Form.Item
                label={labelText('Address')}
                name="address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Enter address" style={FONT} />
              </Form.Item>
              <Form.Item
                label={labelText('Email Address')}
                name="email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input placeholder="Enter email address" style={FONT} />
              </Form.Item>
            </div>

            <Form.Item
              label={labelText('Website')}
              name="website"
              rules={[urlRule()]}
            >
              <Input placeholder="Enter website URL" style={FONT} />
            </Form.Item>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5">
              <Form.Item
                label={labelText('Facebook')}
                name="facebookUrl"
                rules={[urlRule()]}
              >
                <Input placeholder="Enter Facebook profile URL" style={FONT} />
              </Form.Item>
              <Form.Item
                label={labelText('Instagram')}
                name="instagramUrl"
                rules={[urlRule()]}
              >
                <Input placeholder="Enter Instagram profile URL" style={FONT} />
              </Form.Item>
              <Form.Item
                label={labelText('LinkedIn')}
                name="linkedinUrl"
                rules={[urlRule()]}
              >
                <Input placeholder="Enter LinkedIn profile URL" style={FONT} />
              </Form.Item>
            </div>

            <Form.Item
              label={labelText('Focus Area')}
              name="focusArea"
              rules={[{ required: true, message: 'Please enter focus area' }]}
              extra={<span className="italic" style={FONT}>(e.g. Climate Policy, Social Innovation, ... — separate multiple entries with a comma)</span>}
            >
              <Input placeholder="Enter focus area" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Focus SDGs')}
              name="focusSDGs"
              rules={[
                { required: true, message: 'Please select at least one SDG' },
                {
                  validator: (_, value: number[]) =>
                    value && value.length > 3
                      ? Promise.reject(new Error('Please select at most 3 options'))
                      : Promise.resolve(),
                },
              ]}
              extra={<span className="italic" style={FONT}>Maximum 3 SDGs that best align with your organization.</span>}
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SDGS_DATA.map((sdg) => (
                    <Checkbox key={sdg.id} value={sdg.id} style={FONT}>
                      SDG {sdg.id} – {sdg.title}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label={labelText('Organization Image')}
              name="organizationImage"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload an image' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Upload up to 10 supported files. Each file can be up to 100 MB.
                </span>
              }
            >
              <Upload beforeUpload={() => false} maxCount={10} multiple listType="text">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#EE334E] px-5 py-2 text-[#EE334E] text-[15px] font-semibold"
                  style={FONT}
                >
                  <UploadOutlined /> Upload file
                </button>
              </Upload>
            </Form.Item>

            <Form.Item
              label={labelText('Organization Logo')}
              name="organizationLogo"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload a logo' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Upload up to 10 supported files. Each file can be up to 100 MB.
                </span>
              }
            >
              <Upload beforeUpload={() => false} maxCount={10} multiple listType="text">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#EE334E] px-5 py-2 text-[#EE334E] text-[15px] font-semibold"
                  style={FONT}
                >
                  <UploadOutlined /> Upload file
                </button>
              </Upload>
            </Form.Item>

            <PillButton variant="solid" size="lg" fullWidth onClick={handleNext} className="mt-2">
              Next
            </PillButton>
          </div>

          {/* STEP 2 — Project Information */}
          <div style={{ display: step === 2 ? 'block' : 'none' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Form.Item
                label={labelText('Project Name')}
                name="projectName"
                rules={[{ required: true, message: 'Please enter project name' }]}
              >
                <Input placeholder="Enter project name" style={FONT} />
              </Form.Item>
              <Form.Item
                label={labelText('Organization Name')}
                name="projectOrganizationName"
                rules={[{ required: true, message: 'Please enter organization name' }]}
              >
                <Input placeholder="Enter organization name" style={FONT} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Form.Item
                label={labelText('Project Description')}
                name="projectDescription"
                rules={[
                  { required: true, message: 'Please enter project description' },
                  maxWordsRule(40, 'Please keep the description within 40 words'),
                ]}
                extra={<span className="italic text-[13px]" style={FONT}>No more than 40 words</span>}
              >
                <Input.TextArea rows={2} placeholder="Describe your project" style={FONT} />
              </Form.Item>
              <Form.Item
                label={labelText('Led by')}
                name="projectLedBy"
                rules={[{ required: true, message: "Please enter leader's full name" }]}
                extra={<span className="italic text-[13px]" style={FONT}>Leader's full name</span>}
              >
                <Input placeholder="Enter leader's full name" style={FONT} />
              </Form.Item>
            </div>

            <Form.Item
              label={labelText('Social Impact Metrics')}
              name="socialImpactMetrics"
              rules={[{ required: true, message: 'Please enter social impact metrics' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Please list key quantitative data reflecting your project's impact (e.g. 1,500 Beneficiaries, 500 hours training).
                </span>
              }
            >
              <Input.TextArea rows={3} placeholder="Enter social impact metrics" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Region')}
              name="region"
              rules={[{ required: true, message: 'Please select region' }]}
            >
              <Select
                placeholder="Select region"
                options={GLOBAL_REGIONS.map((r) => ({ value: r, label: r }))}
                showSearch
              />
            </Form.Item>

            <Form.Item
              label={labelText('Countries covered')}
              name="countriesCovered"
              rules={[{ required: true, message: 'Please enter countries covered' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  List countries separated by commas (e.g., Vietnam, Singapore, South Korea).
                </span>
              }
            >
              <Input placeholder="Enter countries covered" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Focus SDGs')}
              name="projectFocusSDGs"
              rules={[
                { required: true, message: 'Please select at least one SDG' },
                {
                  validator: (_, value: number[]) =>
                    value && value.length > 3
                      ? Promise.reject(new Error('Please select at most 3 options'))
                      : Promise.resolve(),
                },
              ]}
              extra={<span className="italic" style={FONT}>Maximum 3 SDGs that best align with your project.</span>}
            >
              <Checkbox.Group className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SDGS_DATA.map((sdg) => (
                    <Checkbox key={sdg.id} value={sdg.id} style={FONT}>
                      SDG {sdg.id} – {sdg.title}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label={labelText('Project Status')}
              name="projectStatus"
              rules={[{ required: true, message: 'Please select project status' }]}
            >
              <Radio.Group>
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  {PROJECT_STATUS_OPTIONS.map((s) => (
                    <Radio key={s.value} value={s.value} style={FONT}>
                      {s.label}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={labelText('Images of Outstanding Project Activities')}
              name="projectImages"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload at least one image' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Upload up to 10 supported files. Each file can be up to 100 MB.
                </span>
              }
            >
              <Upload beforeUpload={() => false} maxCount={10} multiple listType="text">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#EE334E] px-5 py-2 text-[#EE334E] text-[15px] font-semibold"
                  style={FONT}
                >
                  <UploadOutlined /> Upload file
                </button>
              </Upload>
            </Form.Item>

            <Form.Item
              label={labelText('Website or Social Media Profile')}
              name="projectSocialProfile"
              rules={[
                { required: true, message: 'Please enter a website or social media profile' },
                urlRule(),
              ]}
            >
              <Input placeholder="Enter link" style={FONT} />
            </Form.Item>

            <div className="flex gap-3 mt-2">
              <PillButton variant="outline" size="lg" fullWidth onClick={() => setStep(1)} disabled={submitting}>
                Back
              </PillButton>
              <PillButton
                variant="solid"
                size="lg"
                fullWidth
                disabled={submitting}
                onClick={() => form.submit()}
              >
                {submitting ? 'Submitting…' : 'Submit'}
              </PillButton>
            </div>
          </div>
        </Form>
      </ConfigProvider>
      </>
      )}
    </Modal>
  );
}