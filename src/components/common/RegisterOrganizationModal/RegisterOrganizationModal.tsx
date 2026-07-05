import { useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Radio, Upload, ConfigProvider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PillButton } from '@/components/ui/PillButton';

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
  website: string;
  focusArea: string;
  focusSDGs: string[];
  socialProfile: string;
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
  projectFocusSDGs: string[];
  projectStatus: string;
  projectImages?: unknown[];
  projectSocialProfile: string;
  // Step 3 — Leadership Roles
  continent: string;
}

export interface RegisterOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: RegisterOrganizationFormValues) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };

const PHONE_CODES = ['+84', '+1', '+44', '+61', '+65', '+81', '+82', '+86'];

const COUNTRIES = ['VietNam', 'United States', 'United Kingdom', 'Singapore', 'Japan', 'Korea', 'Australia'];

const YEARS = Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i);

const SDG_GOALS = [
  'Goal 1. No poverty',
  'Goal 2. Zero Hunger',
  'Goal 3. Good health and well-being',
  'Goal 4. Quality education',
  'Goal 5. Gender Equality',
  'Goal 6. Clean water and sanitation',
  'Goal 7. Affordable and clean energy',
  'Goal 8. Decent work and economic growth',
  'Goal 9. Industry, innovation and infrastructure',
  'Goal 10. Reduced inequalities',
  'Goal 11. Sustainable cities and communities',
  'Goal 12. Responsible consumption and production',
  'Goal 13. Climate action',
  'Goal 14. Life Below Water',
  'Goal 15. Life on land',
  'Goal 16. Peace, justice and strong institutions',
  'Goal 17. Partnerships for the goals',
];

const CONTINENTS = ['Africa', 'Asia', 'Europe', 'Americas', 'Middle East', 'Oceania'];

const PROJECT_STATUSES = ['In Planning', 'Active', 'Ended', 'Inactive'];

const STEP_FIELDS: Record<1 | 2 | 3, (keyof RegisterOrganizationFormValues)[]> = {
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
    'focusArea',
    'focusSDGs',
    'socialProfile',
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
  3: ['continent'],
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);

  const closeAndReset = () => {
    form.resetFields();
    setStep(1);
    setSubmitted(false);
    onClose();
  };

  const handleNext = async () => {
    try {
      await form.validateFields(STEP_FIELDS[step]);
      setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
    } catch {
      /* validation errors are shown inline by antd */
    }
  };

  const handleFinish = (values: RegisterOrganizationFormValues) => {
    onSubmit?.(values);
    setSubmitted(true);
  };

  return (
    <Modal
      open={open}
      onCancel={closeAndReset}
      footer={null}
      centered
      width="min(760px, calc(100vw - 32px))"
      destroyOnHidden
      classNames={{ container: '!rounded-[16px] sm:!rounded-[24px] !p-5 sm:!p-[40px]' }}
      styles={{
        body: { maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
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
          <PillButton variant="solid" size="lg" fullWidth onClick={closeAndReset}>
            Register Now
          </PillButton>
        </div>
      ) : (
      <>
      <h2 className="font-bold text-[26px] sm:text-[34px] text-[#111111] mb-1" style={FONT}>
        {step === 3 ? 'Leadership Roles' : 'Membership Registration'}
      </h2>
      <p className="font-semibold text-[16px] sm:text-[18px] text-[#111111] mb-5" style={FONT}>
        {step === 1 ? 'For Organizations' : step === 2 ? 'Project Information' : 'Continents'}
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
              rules={[{ required: true, message: 'Please enter organization description' }]}
            >
              <Input.TextArea rows={3} placeholder="Describe your organization" style={FONT} />
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
              rules={[{ required: true, message: 'Please enter phone number' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Include country code (e.g., +84 for Vietnam)
                </span>
              }
            >
              <Input
                placeholder="Enter phone number"
                addonBefore={
                  <Form.Item name="representativePhoneCode" noStyle initialValue="+84">
                    <Select
                      style={{ width: 90 }}
                      options={PHONE_CODES.map((c) => ({ value: c, label: c }))}
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
                  options={COUNTRIES.map((c) => ({ value: c, label: c }))}
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
              rules={[{ required: true, message: 'Please enter website' }]}
            >
              <Input placeholder="Enter website URL" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Focus Area')}
              name="focusArea"
              rules={[{ required: true, message: 'Please enter focus area' }]}
              extra={<span className="italic" style={FONT}>(eg. Climate Policy, Social Innovation,...)</span>}
            >
              <Input placeholder="Enter focus area" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Focus SDGs')}
              name="focusSDGs"
              rules={[
                { required: true, message: 'Please select at least one SDG' },
                {
                  validator: (_, value: string[]) =>
                    value && value.length > 3
                      ? Promise.reject(new Error('Phải chọn nhiều nhất 3 tùy chọn'))
                      : Promise.resolve(),
                },
              ]}
              extra={<span className="italic" style={FONT}>Maximum 03 SDGs that best align with your organization.</span>}
            >
              <Checkbox.Group>
                <div className="flex flex-col gap-2">
                  {SDG_GOALS.map((goal) => (
                    <Checkbox key={goal} value={goal} style={FONT}>
                      {goal}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item
              label={labelText('Website or Social Media Profile')}
              name="socialProfile"
              rules={[{ required: true, message: 'Please enter a website or social media profile' }]}
            >
              <Input placeholder="Enter link" style={FONT} />
            </Form.Item>

            <Form.Item
              label={labelText('Organization Image')}
              name="organizationImage"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload an image' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Tải tối đa 10 tệp được hỗ trợ lên. Mỗi tệp có kích thước tối đa 100 MB.
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
                  Tải tối đa 10 tệp được hỗ trợ lên. Mỗi tệp có kích thước tối đa 100 MB.
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
                rules={[{ required: true, message: 'Please enter project description' }]}
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
                  Please list key quantitative data reflecting your project's impact. (e.g., specific SDGs
                  targeted, number of beneficiaries reached, hours of training provided, or community tracking metrics).
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
                options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                showSearch
              />
            </Form.Item>

            <Form.Item
              label={labelText('Countries covered')}
              name="countriesCovered"
              rules={[{ required: true, message: 'Please enter countries covered' }]}
              extra={
                <span className="italic text-[13px]" style={FONT}>
                  Please list the countries where your project operates or has an active presence (e.g.,
                  Vietnam, Singapore, South Korea).
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
                  validator: (_, value: string[]) =>
                    value && value.length > 3
                      ? Promise.reject(new Error('Phải chọn nhiều nhất 3 tùy chọn'))
                      : Promise.resolve(),
                },
              ]}
              extra={<span className="italic" style={FONT}>Maximum 3 SDGs that best align with your project.</span>}
            >
              <Checkbox.Group>
                <div className="flex flex-col gap-2">
                  {SDG_GOALS.map((goal) => (
                    <Checkbox key={goal} value={goal} style={FONT}>
                      {goal}
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
                  {PROJECT_STATUSES.map((s) => (
                    <Radio key={s} value={s} style={FONT}>
                      {s}
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
                  Tải tối đa 10 tệp được hỗ trợ lên. Mỗi tệp có kích thước tối đa 100 MB.
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
              rules={[{ required: true, message: 'Please enter a website or social media profile' }]}
            >
              <Input placeholder="Enter link" style={FONT} />
            </Form.Item>

            <div className="flex gap-3 mt-2">
              <PillButton variant="outline" size="lg" fullWidth onClick={() => setStep(1)}>
                Back
              </PillButton>
              <PillButton variant="solid" size="lg" fullWidth onClick={handleNext}>
                Next
              </PillButton>
            </div>
          </div>

          {/* STEP 3 — Leadership Roles / Continents */}
          <div style={{ display: step === 3 ? 'block' : 'none' }}>
            <h3 className="font-bold text-[20px] sm:text-[22px] text-[#111111] mb-4" style={FONT}>
              Continents
            </h3>
            <Form.Item
              label={labelText('Continent')}
              name="continent"
              rules={[{ required: true, message: 'Please select a continent' }]}
            >
              <Radio.Group>
                <div className="flex flex-col gap-2">
                  {CONTINENTS.map((c) => (
                    <Radio key={c} value={c} style={FONT}>
                      {c}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>

            <div className="flex gap-3 mt-2">
              <PillButton variant="outline" size="lg" fullWidth onClick={() => setStep(2)}>
                Back
              </PillButton>
              <PillButton variant="solid" size="lg" fullWidth onClick={() => form.submit()}>
                Register Now
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
