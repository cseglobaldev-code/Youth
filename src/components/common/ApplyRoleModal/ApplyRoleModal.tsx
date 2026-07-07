// src/components/common/ApplyRoleModal/ApplyRoleModal.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Upload, ConfigProvider, message } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { UploadFile } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { PillButton } from '@/components/ui/PillButton';
import { urlRule, phoneRule, maxWordsRule } from '@/lib/utils';
import { StrapiService } from '@/lib/strapi';

export type Continent = 'africa' | 'asia' | 'europe' | 'americas' | 'middle_east' | 'oceania';

export interface ApplyRoleFormValues {
  fullName: string;
  sex: 'male' | 'female' | 'prefer_not' | 'other';
  sexOther?: string;
  dateOfBirth: Dayjs;
  nationality: string;
  countryOfResidence: string;
  cityTown: string;
  email: string;
  whatsappNumber: string;
  profileImage: UploadFile[];
  linkedinProfile: string;
  websiteOrSocial?: string;
  resumeCv: UploadFile[];
  continent: Continent;
  region: string;
  assessment: Record<string, string>;
}

interface AssessmentQuestion {
  key: string;
  label: ReactNode;
  maxWords: number;
}

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    key: 'q1',
    label: (
      <>
        Question 1. Relevant to <strong>Behavioral Questions</strong> of Personality &amp; Working Style
      </>
    ),
    maxWords: 300,
  },
  {
    key: 'q2',
    label: (
      <>
        Question 2. Relevant to <strong>Motivational, Strategic Vision and Commitments</strong> regarding
        Y.O.U under their terms
      </>
    ),
    maxWords: 500,
  },
  {
    key: 'q3',
    label: (
      <>
        Question 3. Relevant to <strong>Cognitive Ability Question</strong> about their Leadership skills
        (Membership &amp; Operations)
      </>
    ),
    maxWords: 250,
  },
  {
    key: 'q4',
    label: (
      <>
        Question 4. Relevant to <strong>Scenario-Based Questions</strong> about their Leadership skills
        (Membership &amp; Operations)
      </>
    ),
    maxWords: 250,
  },
  {
    key: 'q5',
    label: (
      <>
        Question 5. Relevant to <strong>Cognitive Ability Question</strong> about their{' '}
        <strong>Ethical &amp; Moral Dilemma Scenarios</strong>
      </>
    ),
    maxWords: 250,
  },
  {
    key: 'q6',
    label: (
      <>
        Question 6. Relevant to <strong>Scenario-Based Questions</strong> about their{' '}
        <strong>Ethical &amp; Moral Dilemma Scenarios</strong>
      </>
    ),
    maxWords: 250,
  },
  {
    key: 'q7',
    label: (
      <>
        Question 7. Relevant to <strong>Knowledge-Based Questions</strong> about their Political Awareness
        (Their Country and International Affairs)
      </>
    ),
    maxWords: 550,
  },
  {
    key: 'q8',
    label: (
      <>
        Question 8. Relevant to <strong>Scenario-Based Questions</strong> regarding dealing with Y.O.U
        crisis within Political Landscape
      </>
    ),
    maxWords: 350,
  },
  {
    key: 'q9',
    label: (
      <>
        Question 9. Relevant to <strong>Visionary Questions</strong> regarding forecasting your country's
        following 1-2 years (how we gonna do so the Y.O.U could adapt quickly based on their country's
        circumstances)
      </>
    ),
    maxWords: 500,
  },
];

const CONTINENTS: { value: Continent; label: string }[] = [
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'middle_east', label: 'Middle East' },
  { value: 'oceania', label: 'Oceania' },
];

const REGIONS: Record<Continent, string[]> = {
  africa: ['Northern Africa', 'Western Africa', 'Central Africa', 'Eastern Africa', 'Southern Africa'],
  asia: ['South Asia', 'East Asia', 'West Asia', 'North Asia', 'Southeast Asia'],
  europe: ['Northern Europe', 'Western Europe', 'Eastern Europe', 'Southern Europe'],
  americas: ['North America', 'Central America', 'South America', 'Caribbean'],
  middle_east: ['Gulf', 'Levant', 'Arabian Peninsula', 'North Africa & Egypt'],
  oceania: ['Australia & New Zealand', 'Melanesia', 'Micronesia', 'Polynesia'],
};

export interface ApplyRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: ApplyRoleFormValues) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };
const UPLOAD_HINT = 'Upload up to 10 supported files. Each file can be up to 100 MB.';

function FieldLabel({ text, required, hint }: { text: string; required?: boolean; hint?: string }) {
  return (
    <span className="flex flex-col gap-0.5" style={FONT}>
      <span className="text-[15px] sm:text-[16px] text-[#111111]">
        {text}
        {required && <span className="text-[#EE334E]"> *</span>}
      </span>
      {hint && <span className="text-[13px] italic font-normal text-neutral-500">{hint}</span>}
    </span>
  );
}

function UploadButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-[#EE334E] px-5 py-2.5 text-[15px] font-semibold text-[#EE334E] transition-colors hover:bg-[#EE334E]/5"
      style={FONT}
    >
      <Icon name="lucide:upload" size={18} />
      Upload file
    </button>
  );
}

const normFile = (e: unknown): UploadFile[] => {
  if (Array.isArray(e)) return e;
  return (e as { fileList?: UploadFile[] })?.fileList ?? [];
};

export function ApplyRoleModal({ open, onClose, onSubmit }: ApplyRoleModalProps) {
  const [form] = Form.useForm<ApplyRoleFormValues>();
  const sex = Form.useWatch('sex', form);
  const continent = Form.useWatch('continent', form);
  const [step, setStep] = useState(1);

  const close = () => {
    onClose();
  };

  const finishAndClose = () => {
    form.resetFields();
    setStep(1);
    onClose();
  };

  const regions = continent ? REGIONS[continent] : [];
  const continentLabel = CONTINENTS.find((c) => c.value === continent)?.label ?? '';

  const handleNextFromDetails = async () => {
    await form.validateFields([
      'fullName',
      'sex',
      ...(form.getFieldValue('sex') === 'other' ? (['sexOther'] as const) : []),
      'dateOfBirth',
      'nationality',
      'countryOfResidence',
      'cityTown',
      'email',
      'whatsappNumber',
      'profileImage',
      'linkedinProfile',
      'resumeCv',
    ]);
    setStep(2);
  };

  const handleNextFromContinent = async () => {
    await form.validateFields(['continent']);
    form.setFieldValue('region', undefined);
    setStep(3);
  };

  const handleNextFromRegion = async () => {
    await form.validateFields(['region']);
    setStep(4);
  };

  const handleFinish = async (values: ApplyRoleFormValues) => {
    try {
      await StrapiService.submitLeadershipApplication(values);
      message.success('Nộp đơn ứng tuyển thành công! Cảm ơn sự quan tâm của bạn.');
      onSubmit?.(values);
      setStep(5); // Transition to the success screen
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi gửi thông tin ứng tuyển. Vui lòng thử lại.');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      centered
      width="min(860px, calc(100vw - 32px))"
      forceRender
      classNames={{ container: '!rounded-[16px] sm:!rounded-[24px] !p-5 sm:!p-[40px]' }}
      styles={{
        body: { maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
      }}
    >
      {step !== 5 && (
        <h2 className="font-bold text-[28px] sm:text-[36px] text-[#111111] mb-3 sm:mb-4" style={FONT}>
          Leadership Roles
        </h2>
      )}

      {step === 1 && (
        <>
          <h3 className="font-bold text-[20px] sm:text-[24px] text-[#111111] mb-2 sm:mb-3" style={FONT}>
            Continental Director
          </h3>
          <p className="text-neutral-600 text-[15px] sm:text-[16px] leading-relaxed mb-4" style={FONT}>
            Thank you for your interest in serving as a Continental Director for the Youth Organization Union (YOU).
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-semibold text-[15px] sm:text-[16px] text-[#111111]" style={FONT}>
              Criteria For Recruiting Continental Directors
            </span>
            <button
              type="button"
              className="rounded-full border border-[#EE334E] px-5 py-1 text-[14px] font-semibold text-[#EE334E] transition-colors hover:bg-[#EE334E]/5"
              style={FONT}
            >
              Link
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <h3 className="font-bold text-[20px] sm:text-[24px] text-[#111111] mb-4 sm:mb-6" style={FONT}>
          Continents
        </h3>
      )}

      {step === 3 && (
        <h3 className="font-bold text-[20px] sm:text-[24px] text-[#111111] uppercase mb-4 sm:mb-6" style={FONT}>
          {continentLabel}
        </h3>
      )}

      {step === 4 && (
        <>
          <h3 className="font-bold text-[20px] sm:text-[24px] text-[#111111] mb-2 sm:mb-3" style={FONT}>
            Assessment Center
          </h3>
          <p className="text-neutral-600 text-[15px] sm:text-[16px] leading-relaxed mb-4 sm:mb-6" style={FONT}>
            Please answer all nine questions below. Respect the word limit noted under each question.
          </p>
        </>
      )}

      {step === 5 ? (
        <div className="py-4 sm:py-6">
          <h2 className="font-bold text-[26px] sm:text-[34px] text-[#111111] mb-4" style={FONT}>
            Thank you for submitting your application!
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#111111] leading-relaxed mb-8" style={FONT}>
            We appreciate your time and interest in joining us. Your application has been successfully received.
          </p>
          <PillButton
            variant="solid"
            size="lg"
            fullWidth
            onClick={finishAndClose}
            className="!bg-[#005D9A] hover:!opacity-90"
          >
            Done
          </PillButton>
        </div>
      ) : (
        <ConfigProvider theme={{ token: { controlHeight: 48, borderRadius: 8, colorPrimary: '#005D9A' } }}>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <div className={step === 1 ? 'block' : 'hidden'}>
              <Form.Item
                label={<FieldLabel text="Full name" required />}
                name="fullName"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="Enter your full name" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Sex" required />}
                name="sex"
                rules={[{ required: true, message: 'Please select an option' }]}
              >
                <Radio.Group className="flex flex-col gap-3">
                  <Radio value="male" style={FONT}>Male</Radio>
                  <Radio value="female" style={FONT}>Female</Radio>
                  <Radio value="prefer_not" style={FONT}>Prefer not to say</Radio>
                  <Radio value="other" style={FONT}>Other:</Radio>
                </Radio.Group>
              </Form.Item>

              {sex === 'other' && (
                <Form.Item
                  name="sexOther"
                  rules={[{ required: true, message: 'Please specify' }]}
                >
                  <Input placeholder="Please specify" style={FONT} />
                </Form.Item>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                <Form.Item
                  label={<FieldLabel text="Date of Birth" required hint="mm/dd/yyyy" />}
                  name="dateOfBirth"
                  rules={[{ required: true, message: 'Please select your date of birth' }]}
                >
                  <DatePicker
                    format="MM/DD/YYYY"
                    placeholder="mm/dd/yyyy"
                    className="w-full"
                    style={FONT}
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    suffixIcon={<Icon name="lucide:chevron-down" size={16} />}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <FieldLabel
                      text="Nationality"
                      required
                      hint="Your citizenship as stated in your passport."
                    />
                  }
                  name="nationality"
                  rules={[{ required: true, message: 'Please enter your nationality' }]}
                >
                  <Input placeholder="Enter your nationality" style={FONT} />
                </Form.Item>
              </div>

              <Form.Item
                label={
                  <FieldLabel
                    text="Country of Residence"
                    required
                    hint="The country where you currently live."
                  />
                }
                name="countryOfResidence"
                rules={[{ required: true, message: 'Please enter your country of residence' }]}
              >
                <Input placeholder="Enter your country of residence" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="City/Town" required />}
                name="cityTown"
                rules={[{ required: true, message: 'Please enter your city/town' }]}
              >
                <Input placeholder="Enter your city/town" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Email Address" required />}
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input placeholder="Enter your email" style={FONT} />
              </Form.Item>

              <Form.Item
                label={
                  <FieldLabel
                    text="WhatsApp Number"
                    required
                    hint="Include country code (e.g., 84 for Vietnam)"
                  />
                }
                name="whatsappNumber"
                rules={[
                  { required: true, message: 'Please enter your WhatsApp number' },
                  phoneRule('Please enter a valid WhatsApp number'),
                ]}
              >
                <Input addonBefore="+84" placeholder="Enter your WhatsApp number" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Profile Image" required />}
                name="profileImage"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Please upload a profile image' }]}
                extra={<span className="text-[13px] italic text-[#EE334E]">{UPLOAD_HINT}</span>}
              >
                <Upload beforeUpload={() => false} multiple maxCount={10} listType="text">
                  <UploadButton />
                </Upload>
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="LinkedIn Profile" required />}
                name="linkedinProfile"
                rules={[
                  { required: true, message: 'Please enter your LinkedIn profile' },
                  urlRule('Please enter a valid LinkedIn URL'),
                ]}
              >
                <Input placeholder="Enter your LinkedIn profile URL" style={FONT} />
              </Form.Item>

              <Form.Item
                label={
                  <FieldLabel
                    text="Website or Social Media Profile"
                    hint="Please provide the links to your professional or personal social media accounts or website."
                  />
                }
                name="websiteOrSocial"
                rules={[urlRule('Please enter a valid URL')]}
              >
                <Input placeholder="Enter your website or social media URL" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Resume/CV" required />}
                name="resumeCv"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Please upload your resume/CV' }]}
                extra={<span className="text-[13px] italic text-[#EE334E]">{UPLOAD_HINT}</span>}
              >
                <Upload beforeUpload={() => false} multiple maxCount={10} listType="text">
                  <UploadButton />
                </Upload>
              </Form.Item>

              <button
                type="button"
                onClick={handleNextFromDetails}
                className="w-full mt-2 px-8 py-3 sm:py-4 bg-[#005D9A] text-white text-[17px] sm:text-[20px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                style={FONT}
              >
                Next
              </button>
            </div>

            <div className={step === 2 ? 'block' : 'hidden'}>
              <Form.Item
                label={<FieldLabel text="Continent" required />}
                name="continent"
                rules={[{ required: true, message: 'Please select a continent' }]}
              >
                <Radio.Group className="flex flex-col gap-3">
                  {CONTINENTS.map((c) => (
                    <Radio key={c.value} value={c.value} style={FONT}>
                      {c.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>

              <button
                type="button"
                onClick={handleNextFromContinent}
                className="w-full mt-2 px-8 py-3 sm:py-4 bg-[#005D9A] text-white text-[17px] sm:text-[20px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                style={FONT}
              >
                Next
              </button>
            </div>

            <div className={step === 3 ? 'block' : 'hidden'}>
              <Form.Item
                label={
                  <FieldLabel
                    text={`Which region of ${continentLabel} are you located in?`}
                    required
                    hint="Please select the specific region where you or your project operates."
                  />
                }
                name="region"
                rules={[{ required: true, message: 'Please select a region' }]}
              >
                <Radio.Group className="flex flex-col gap-3">
                  {regions.map((r) => (
                    <Radio key={r} value={r} style={FONT}>
                      {r}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>

              <button
                type="button"
                onClick={handleNextFromRegion}
                className="w-full mt-2 px-8 py-3 sm:py-4 bg-[#005D9A] text-white text-[17px] sm:text-[20px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                style={FONT}
              >
                Next
              </button>
            </div>

            <div className={step === 4 ? 'block' : 'hidden'}>
              {ASSESSMENT_QUESTIONS.map((q) => (
                <Form.Item
                  key={q.key}
                  label={
                    <span className="flex flex-col gap-0.5" style={FONT}>
                      <span className="text-[15px] sm:text-[16px] text-[#111111]">
                        {q.label}
                        <span className="text-[#EE334E]"> *</span>
                      </span>
                      <span className="text-[13px] italic font-normal text-neutral-500">
                        Maximum {q.maxWords} words.
                      </span>
                    </span>
                  }
                  name={['assessment', q.key]}
                  rules={[
                    { required: true, message: 'Please answer this question' },
                    maxWordsRule(q.maxWords),
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter your answer"
                    style={FONT}
                    className="!resize-none"
                  />
                </Form.Item>
              ))}

              <button
                type="button"
                onClick={() => form.submit()}
                className="w-full mt-2 px-8 py-3 sm:py-4 bg-[#005D9A] text-white text-[17px] sm:text-[20px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                style={FONT}
              >
                Submit
              </button>
            </div>
          </Form>
        </ConfigProvider>
      )}
    </Modal>
  );
}