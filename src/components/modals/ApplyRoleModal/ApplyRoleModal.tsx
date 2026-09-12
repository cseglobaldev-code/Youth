import { useState } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Upload, ConfigProvider, Alert, Select, Checkbox } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { UploadFile } from 'antd';
import { Icon } from '@/components/ui/Icon';
import { PillButton } from '@/components/ui/PillButton';
import { urlRule, phoneRule, maxWordsRule, countryFlagEmoji } from '@/lib/utils';
import { submitLeadershipApplication } from '@/api/applications';
import { CONTINENT_REGIONS } from '@/api/leadership';
import { DIAL_CODES } from '@/data/dialCodes';
import type { Continent } from '@/types';

export interface ApplyRoleFormValues {
  position?: string;
  fullName: string;
  sex: 'male' | 'female' | 'prefer_not' | 'other';
  sexOther?: string;
  dateOfBirth: Dayjs;
  nationality: string;
  countryOfResidence: string;
  cityTown: string;
  email: string;
  whatsappCode: string;
  whatsappNumber: string;
  profilePhoto: UploadFile[];
  activityPhotos?: UploadFile[];
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  portfolio?: string;
  continent: Continent;
  region: string;
  // Supporting Documents
  resumeCv: UploadFile[];
  orgProfileDoc?: UploadFile[];
  leadershipProofDoc?: UploadFile[];
  additionalDocs?: UploadFile[];
  // Assessment answers
  assessment: Record<string, any>;
}

const CONTINENTS: { value: Continent; label: string }[] = [
  { value: 'Africa', label: 'Africa' },
  { value: 'America', label: 'America' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Europe', label: 'Europe' },
];

const RECRUITING_POSITIONS = [
  { label: 'Continental Director', value: 'Continental Director' },
  { label: 'Sub-Representative', value: 'Sub-Representative' },
  { label: 'General Member', value: 'General Member' },
  { label: 'Marketing & Communication Member', value: 'Marketing & Communication Member' },
  { label: 'Secretary & Assistant', value: 'Secretary & Assistant' },
  { label: 'Undefined', value: 'Undefined' },
];

export interface ApplyRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: ApplyRoleFormValues) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };
const UPLOAD_HINT = 'Upload supported files (PDF, DOCX, JPG, PNG, up to 100 MB).';

function FieldLabel({ text, required, hint }: { text: string; required?: boolean; hint?: string }) {
  return (
    <span className="flex flex-col gap-0.5" style={FONT}>
      <span className="text-[15px] sm:text-[16px] text-[#111111] font-medium">
        {text}
        {required && <span className="text-[#EE334E]"> *</span>}
      </span>
      {hint && <span className="text-[13px] italic font-normal text-neutral-500">{hint}</span>}
    </span>
  );
}

function UploadButton({ label = 'Upload file' }: { label?: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-[#EE334E] px-5 py-2 text-[14px] sm:text-[15px] font-semibold text-[#EE334E] transition-colors hover:bg-[#EE334E]/5"
      style={FONT}
    >
      <Icon name="lucide:upload" size={18} />
      {label}
    </button>
  );
}

const normFile = (e: unknown): UploadFile[] => {
  if (Array.isArray(e)) return e;
  return (e as { fileList?: UploadFile[] })?.fileList ?? [];
};

function ScaleRating({ value, onChange }: { value?: number; onChange?: (val: number) => void }) {
  return (
    <div className="flex flex-col gap-1.5 pt-1 pb-1">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange?.(num)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm transition-all border ${
              value === num
                ? 'bg-[#005D9A] text-white border-[#005D9A] shadow-md scale-105'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#005D9A] hover:text-[#005D9A]'
            }`}
            style={FONT}
          >
            {num}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-[12px] text-neutral-500 max-w-[440px] px-1" style={FONT}>
        <span>1 (Poor)</span>
        <span>5 (Average)</span>
        <span>10 (Excellent)</span>
      </div>
    </div>
  );
}

const ASSESSMENT_SECTIONS = [
  { id: 1, title: 'Organizational Leadership', short: 'Org Leadership' },
  { id: 2, title: 'Impact & Experience', short: 'Impact & Exp' },
  { id: 3, title: 'Leadership & Skills', short: 'Skills & Ratings' },
  { id: 4, title: "Alignment with Y.O.U's Vision", short: "Y.O.U's Vision" },
  { id: 5, title: 'Commitment', short: 'Commitment' },
  { id: 6, title: 'Supporting Documents', short: 'Documents' },
  { id: 7, title: 'Declaration', short: 'Declaration' },
];

export function ApplyRoleModal({ open, onClose, onSubmit }: ApplyRoleModalProps) {
  const [form] = Form.useForm<ApplyRoleFormValues>();
  const sex = Form.useWatch('sex', form);
  const continent = Form.useWatch('continent', form);
  const partnered = Form.useWatch(['assessment', 'partneredWithOrgs'], form);
  
  const [step, setStep] = useState(1);
  const [assessmentSection, setAssessmentSection] = useState(1);
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
    setAssessmentSection(1);
    setErrorMessage(null);
    onClose();
  };

  const regions = continent && CONTINENT_REGIONS[continent] ? CONTINENT_REGIONS[continent] : [];
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
      'profilePhoto',
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
    setAssessmentSection(1);
  };

  const handleNextAssessmentSection = async () => {
    try {
      if (assessmentSection === 1) {
        await form.validateFields([
          ['assessment', 'orgName'],
          ['assessment', 'positionHeld'],
          ['assessment', 'isLegallyRegistered'],
          ['assessment', 'yearsLed'],
          ['assessment', 'orgWebsiteSocial'],
          ['assessment', 'activeMembers'],
          ['assessment', 'missionActivities'],
        ]);
      } else if (assessmentSection === 2) {
        await form.validateFields([
          ['assessment', 'majorAchievements'],
          ['assessment', 'positiveImpact'],
          ['assessment', 'projectScales'],
          ['assessment', 'projectExamples'],
          ['assessment', 'partneredWithOrgs'],
        ]);
      } else if (assessmentSection === 3) {
        await form.validateFields([
          ['assessment', 'motivation'],
          ['assessment', 'leadershipQualities'],
          ['assessment', 'teamSituation'],
          ['assessment', 'recruitmentPlan'],
          ['assessment', 'conflictResolution'],
          ['assessment', 'rateCommunication'],
          ['assessment', 'rateTeamManagement'],
          ['assessment', 'rateInternationalCoordination'],
        ]);
      } else if (assessmentSection === 4) {
        await form.validateFields([
          ['assessment', 'youthEmpowerment'],
          ['assessment', 'inclusionDiversity'],
          ['assessment', 'regionalYouthVision'],
          ['assessment', 'contributionToYou'],
        ]);
      } else if (assessmentSection === 5) {
        await form.validateFields([
          ['assessment', 'commitHours'],
          ['assessment', 'commitVirtualMeetings'],
          ['assessment', 'commitRecruitMentor'],
          ['assessment', 'commitUpholdValues'],
        ]);
      } else if (assessmentSection === 6) {
        await form.validateFields(['resumeCv']);
      }
      setAssessmentSection((prev) => Math.min(prev + 1, 7));
    } catch {
      /* validation errors shown inline */
    }
  };

  const handleFinish = async (values: ApplyRoleFormValues) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);
      const fullWhatsAppNumber = values.whatsappCode
        ? `${values.whatsappCode} ${values.whatsappNumber}`
        : values.whatsappNumber;

      await submitLeadershipApplication({
        ...values,
        whatsappNumber: fullWhatsAppNumber,
      });

      onSubmit?.(values);
      setStep(5);
    } catch (error: any) {
      console.error('Failed to submit leadership application:', error);
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
      width="min(880px, calc(100vw - 32px))"
      forceRender
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

      {step !== 5 && (
        <h2 className="font-bold text-[26px] sm:text-[32px] text-[#111111] mb-3 sm:mb-4" style={FONT}>
          Join as Individual Members
        </h2>
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
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h3 className="font-bold text-[22px] sm:text-[26px] text-[#111111]" style={FONT}>
              Assessment Center
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-[#005D9A] bg-[#EBF4FA] px-3 py-1 rounded-full w-fit" style={FONT}>
              Section {assessmentSection} of 7: {ASSESSMENT_SECTIONS[assessmentSection - 1].short}
            </span>
          </div>

          {/* Section Progress Bar & Steps Tabs */}
          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-[#005D9A] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(assessmentSection / 7) * 100}%` }}
            />
          </div>

          {/* Tab Navigation Pill Dots */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pb-2">
            {ASSESSMENT_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setAssessmentSection(sec.id)}
                className={`text-[12px] sm:text-[13px] font-medium px-2.5 sm:px-3 py-1 rounded-lg transition-all ${
                  assessmentSection === sec.id
                    ? 'bg-[#005D9A] text-white shadow-sm font-semibold'
                    : assessmentSection > sec.id
                    ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    : 'bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                }`}
                style={FONT}
              >
                {sec.id}. {sec.short}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 5 ? (
        <div className="py-4 sm:py-6">
          <h2 className="font-bold text-[26px] sm:text-[34px] text-[#111111] mb-4" style={FONT}>
            Thank you for submitting your application!
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#111111] leading-relaxed mb-8" style={FONT}>
            We appreciate your time and interest in joining us. Your application has been
            successfully received. Keep an eye on your inbox, as we will update you on the next
            steps soon!
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
            
            {/* STEP 1: PERSONAL DETAILS */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <Form.Item
                label={<FieldLabel text="Position" required />}
                name="position"
                rules={[{ required: true, message: 'Please select a position' }]}
              >
                <Select
                  placeholder="Select position"
                  options={RECRUITING_POSITIONS}
                  style={FONT}
                />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Full name" required />}
                name="fullName"
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="Enter your full name" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Gender" required />}
                name="sex"
                rules={[{ required: true, message: 'Please select your gender' }]}
              >
                <Radio.Group className="flex flex-col sm:flex-row gap-3">
                  <Radio value="male" style={FONT}>Male</Radio>
                  <Radio value="female" style={FONT}>Female</Radio>
                  <Radio value="prefer_not" style={FONT}>Prefer not to say</Radio>
                  <Radio value="other" style={FONT}>Other</Radio>
                </Radio.Group>
              </Form.Item>

              {sex === 'other' && (
                <Form.Item
                  label={<FieldLabel text="Other gender" required />}
                  name="sexOther"
                  rules={[{ required: true, message: 'Please specify your gender' }]}
                >
                  <Input placeholder="Please specify" style={FONT} />
                </Form.Item>
              )}

              <Form.Item
                label={<FieldLabel text="Date of Birth" required />}
                name="dateOfBirth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker
                  className="w-full"
                  format="MM/DD/YYYY"
                  placeholder="Select date of birth (MM/DD/YYYY)"
                  style={FONT}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                <Form.Item
                  label={<FieldLabel text="Nationality" required />}
                  name="nationality"
                  rules={[{ required: true, message: 'Please enter nationality' }]}
                >
                  <Input placeholder="e.g. Vietnamese" style={FONT} />
                </Form.Item>
                <Form.Item
                  label={<FieldLabel text="Country of Residence" required />}
                  name="countryOfResidence"
                  rules={[{ required: true, message: 'Please enter country of residence' }]}
                >
                  <Input placeholder="e.g. Vietnam" style={FONT} />
                </Form.Item>
              </div>

              <Form.Item
                label={<FieldLabel text="City/Town" required />}
                name="cityTown"
                rules={[{ required: true, message: 'Please enter city or town' }]}
              >
                <Input placeholder="Enter your city or town" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Email Address" required />}
                name="email"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input placeholder="example@domain.com" style={FONT} />
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="WhatsApp Number" required hint="Include your country dial code." />}
                required
              >
                <div className="grid grid-cols-[140px_1fr] gap-2">
                  <Form.Item name="whatsappCode" noStyle initialValue="+84">
                    <Select
                      showSearch
                      optionFilterProp="label"
                      style={FONT}
                      options={DIAL_CODES.map((d) => ({
                        value: d.dial_code,
                        label: `${countryFlagEmoji(d.code)} ${d.dial_code}`,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name="whatsappNumber"
                    noStyle
                    rules={[
                      { required: true, message: 'Please enter WhatsApp number' },
                      phoneRule('Please enter a valid phone number (6-15 digits)'),
                    ]}
                  >
                    <Input placeholder="Phone number" style={FONT} />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Profile Photo" required hint="Clear portrait image of applicant." />}
                name="profilePhoto"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: 'Please upload a profile photo' }]}
                extra={<span className="text-[13px] italic text-[#EE334E]">JPG or PNG, up to 100 MB.</span>}
              >
                <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                  <UploadButton label="Upload photo" />
                </Upload>
              </Form.Item>

              <Form.Item
                label={<FieldLabel text="Activity Photos" hint="Upload photos from past events or activities." />}
                name="activityPhotos"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra={<span className="text-[13px] italic text-[#EE334E]">Upload up to 10 photos. Each file can be up to 100 MB.</span>}
              >
                <Upload beforeUpload={() => false} multiple maxCount={10} listType="text">
                  <UploadButton label="Upload photos" />
                </Upload>
              </Form.Item>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5">
                <Form.Item
                  label={<FieldLabel text="Facebook" />}
                  name="facebookUrl"
                  rules={[urlRule('Please enter a valid URL')]}
                >
                  <Input placeholder="Enter Facebook profile URL" style={FONT} />
                </Form.Item>
                <Form.Item
                  label={<FieldLabel text="Instagram" />}
                  name="instagramUrl"
                  rules={[urlRule('Please enter a valid URL')]}
                >
                  <Input placeholder="Enter Instagram profile URL" style={FONT} />
                </Form.Item>
                <Form.Item
                  label={<FieldLabel text="LinkedIn" required />}
                  name="linkedinUrl"
                  rules={[
                    { required: true, message: 'Please enter your LinkedIn profile URL' },
                    urlRule('Please enter a valid URL'),
                  ]}
                >
                  <Input placeholder="Enter LinkedIn profile URL" style={FONT} />
                </Form.Item>
              </div>

              <Form.Item
                label={<FieldLabel text="Website or Social Media Profile" hint="Link to personal portfolio or social account." />}
                name="portfolio"
                rules={[urlRule('Please enter a valid URL')]}
              >
                <Input placeholder="https://..." style={FONT} />
              </Form.Item>

              <button
                type="button"
                onClick={handleNextFromDetails}
                className="w-full mt-2 px-8 py-3.5 sm:py-4 bg-[#005D9A] text-white text-[17px] sm:text-[18px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                style={FONT}
              >
                Next: Continents
              </button>
            </div>

            {/* STEP 2: CONTINENTS */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <Form.Item
                label={<FieldLabel text="Which Continent Are You Applying to Represent?" required />}
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

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 px-6 py-3.5 bg-neutral-100 text-neutral-700 text-[16px] font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                  style={FONT}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromContinent}
                  className="w-2/3 px-8 py-3.5 bg-[#005D9A] text-white text-[17px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                  style={FONT}
                >
                  Next: Region
                </button>
              </div>
            </div>

            {/* STEP 3: REGIONS */}
            <div className={step === 3 ? 'block' : 'hidden'}>
              <Form.Item
                label={
                  <FieldLabel
                    text={`Which regional division of ${continentLabel} are you applying for?`}
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

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 px-6 py-3.5 bg-neutral-100 text-neutral-700 text-[16px] font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                  style={FONT}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromRegion}
                  className="w-2/3 px-8 py-3.5 bg-[#005D9A] text-white text-[17px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                  style={FONT}
                >
                  Next: Assessment Center
                </button>
              </div>
            </div>

            {/* STEP 4: ASSESSMENT CENTER (7 SECTIONS) */}
            <div className={step === 4 ? 'block' : 'hidden'}>
              
              {/* SECTION 1: (2) ORGANIZATIONAL LEADERSHIP */}
              {assessmentSection === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (2) Organizational Leadership
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Demonstrate your leadership roles and active organization experience.
                    </p>
                  </div>

                  <Form.Item
                    label={<FieldLabel text="2.1 Name of Your Youth Organization" required />}
                    name={['assessment', 'orgName']}
                    rules={[{ required: true, message: 'Please enter your organization name' }]}
                  >
                    <Input placeholder="Enter organization name" style={FONT} />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="2.2 Position Held" required />}
                    name={['assessment', 'positionHeld']}
                    rules={[{ required: true, message: 'Please enter your position' }]}
                  >
                    <Input placeholder="e.g. Founder, President, Executive Director" style={FONT} />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="2.3 Is your organization legally registered?" required />}
                    name={['assessment', 'isLegallyRegistered']}
                    rules={[{ required: true, message: 'Please select an option' }]}
                  >
                    <Radio.Group className="flex flex-col sm:flex-row gap-3">
                      <Radio value="Yes" style={FONT}>Yes (Registered)</Radio>
                      <Radio value="No" style={FONT}>No (Unregistered)</Radio>
                      <Radio value="In Process" style={FONT}>In Process</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="2.4 How many years have you led your organization?" required />}
                    name={['assessment', 'yearsLed']}
                    rules={[{ required: true, message: 'Please select years of leadership' }]}
                  >
                    <Radio.Group className="flex flex-col sm:flex-row flex-wrap gap-3">
                      <Radio value="2–3 Years" style={FONT}>2–3 Years</Radio>
                      <Radio value="4–5 Years" style={FONT}>4–5 Years</Radio>
                      <Radio value="6–10 Years" style={FONT}>6–10 Years</Radio>
                      <Radio value="More than 10 Years" style={FONT}>More than 10 Years</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="2.5 Organization Website/Social Media Link" required />}
                    name={['assessment', 'orgWebsiteSocial']}
                    rules={[
                      { required: true, message: 'Please enter website or social media link' },
                      urlRule('Please enter a valid URL'),
                    ]}
                  >
                    <Input placeholder="https://..." style={FONT} />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="2.6 Number of Active Members in Your Organization" required />}
                    name={['assessment', 'activeMembers']}
                    rules={[{ required: true, message: 'Please enter number of active members' }]}
                  >
                    <Input placeholder="e.g. 50" style={FONT} />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="2.7 Describe your organization's mission and primary activities." required />}
                    name={['assessment', 'missionActivities']}
                    rules={[{ required: true, message: 'Please describe mission and activities' }]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Describe the mission, key initiatives, and target beneficiaries..."
                      style={FONT}
                    />
                  </Form.Item>
                </div>
              )}

              {/* SECTION 2: (3) IMPACT & EXPERIENCE */}
              {assessmentSection === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (3) Impact &amp; Experience
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Share your track record and community impact. Respect word limits noted.
                    </p>
                  </div>

                  <Form.Item
                    label={<FieldLabel text="3.1 Describe three major achievements of your organization." required hint="Maximum 300 words" />}
                    name={['assessment', 'majorAchievements']}
                    rules={[
                      { required: true, message: 'Please describe three major achievements' },
                      maxWordsRule(300),
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Detail 3 significant milestones or outcomes achieved..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="3.2 How has your organization positively impacted youth or communities?" required hint="Maximum 300 words" />}
                    name={['assessment', 'positiveImpact']}
                    rules={[
                      { required: true, message: 'Please describe your community impact' },
                      maxWordsRule(300),
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Explain direct impact, beneficiaries reached, or systemic change..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="3.3 Have you led regional, national, or international projects?" required />}
                    name={['assessment', 'projectScales']}
                    rules={[{ required: true, message: 'Please select at least one project scale' }]}
                  >
                    <Checkbox.Group className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <Checkbox value="Local" style={FONT}>Local</Checkbox>
                      <Checkbox value="National" style={FONT}>National</Checkbox>
                      <Checkbox value="Regional" style={FONT}>Regional</Checkbox>
                      <Checkbox value="International" style={FONT}>International</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="3.4 Please provide examples of projects you have led." required hint="Maximum 300 words" />}
                    name={['assessment', 'projectExamples']}
                    rules={[
                      { required: true, message: 'Please provide project examples' },
                      maxWordsRule(300),
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Highlight project scope, objectives, leadership duties, and outcomes..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="3.5 Have you partnered with other organizations?" required />}
                    name={['assessment', 'partneredWithOrgs']}
                    rules={[{ required: true, message: 'Please select Yes or No' }]}
                  >
                    <Radio.Group className="flex gap-4">
                      <Radio value="Yes" style={FONT}>Yes</Radio>
                      <Radio value="No" style={FONT}>No</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {partnered === 'Yes' && (
                    <Form.Item
                      label={<FieldLabel text="3.6 If yes, please explain." hint="Maximum 200 words" />}
                      name={['assessment', 'partneredExplanation']}
                      rules={[maxWordsRule(200)]}
                    >
                      <Input.TextArea
                        rows={3}
                        placeholder="Briefly describe partners, collaboration nature, and joint achievements..."
                        style={FONT}
                      />
                    </Form.Item>
                  )}
                </div>
              )}

              {/* SECTION 3: (4) LEADERSHIP & SKILLS */}
              {assessmentSection === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (4) Leadership &amp; Skills
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Assess your leadership competencies, conflict resolution, and self-ratings.
                    </p>
                  </div>

                  <Form.Item
                    label={<FieldLabel text="4.1 What motivates you to apply for this position?" required hint="Maximum 300 words" />}
                    name={['assessment', 'motivation']}
                    rules={[
                      { required: true, message: 'Please describe your motivation' },
                      maxWordsRule(300),
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Share your driving purpose and desire to serve in this role..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.2 What leadership qualities make you suitable for this role?" required hint="Maximum 150 words" />}
                    name={['assessment', 'leadershipQualities']}
                    rules={[
                      { required: true, message: 'Please highlight your qualities' },
                      maxWordsRule(150),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="State key personal attributes, resilience, empathy, vision..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.3 Describe a situation where you successfully managed a team." required hint="Maximum 150 words" />}
                    name={['assessment', 'teamSituation']}
                    rules={[
                      { required: true, message: 'Please describe a team management situation' },
                      maxWordsRule(150),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Context, actions taken, and the positive result achieved..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.4 How would you recruit and coordinate youth organizations within your region?" required hint="Maximum 150 words" />}
                    name={['assessment', 'recruitmentPlan']}
                    rules={[
                      { required: true, message: 'Please describe your coordination plan' },
                      maxWordsRule(150),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Outreach strategy, engagement methods, and network building..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.5 How would you handle conflicts among members from different cultures or countries?" required hint="Maximum 150 words" />}
                    name={['assessment', 'conflictResolution']}
                    rules={[
                      { required: true, message: 'Please explain conflict resolution strategy' },
                      maxWordsRule(150),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Mediation style, diplomatic approach, cultural sensitivity..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.6 Rate your communication skills." required hint="Linear scale 1 to 10" />}
                    name={['assessment', 'rateCommunication']}
                    rules={[{ required: true, message: 'Please rate your communication skills' }]}
                  >
                    <ScaleRating />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.7 Rate your team management skills." required hint="Linear scale 1 to 10" />}
                    name={['assessment', 'rateTeamManagement']}
                    rules={[{ required: true, message: 'Please rate your team management skills' }]}
                  >
                    <ScaleRating />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="4.8 Rate your ability to coordinate international activities." required hint="Linear scale 1 to 10" />}
                    name={['assessment', 'rateInternationalCoordination']}
                    rules={[{ required: true, message: 'Please rate your international coordination ability' }]}
                  >
                    <ScaleRating />
                  </Form.Item>
                </div>
              )}

              {/* SECTION 4: (5) Y.O.U'S VISION */}
              {assessmentSection === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (5) Alignment with Y.O.U's Vision
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Share your perspectives on empowerment, diversity, and collective growth. Maximum 100 words each.
                    </p>
                  </div>

                  <Form.Item
                    label={<FieldLabel text="5.1 What does youth empowerment mean to you?" required hint="Maximum 100 words" />}
                    name={['assessment', 'youthEmpowerment']}
                    rules={[
                      { required: true, message: 'Please answer this question' },
                      maxWordsRule(100),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Define your understanding of empowering youth..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="5.2 How do you promote inclusion, diversity, and cultural understanding?" required hint="Maximum 100 words" />}
                    name={['assessment', 'inclusionDiversity']}
                    rules={[
                      { required: true, message: 'Please answer this question' },
                      maxWordsRule(100),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Actionable practices and personal philosophy..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="5.3 What vision do you have for youth development in your region?" required hint="Maximum 100 words" />}
                    name={['assessment', 'regionalYouthVision']}
                    rules={[
                      { required: true, message: 'Please answer this question' },
                      maxWordsRule(100),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Future roadmap, pressing needs, and transformative opportunities..."
                      style={FONT}
                    />
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="5.4 What contribution will you bring to the Youth Organization Union?" required hint="Maximum 100 words" />}
                    name={['assessment', 'contributionToYou']}
                    rules={[
                      { required: true, message: 'Please answer this question' },
                      maxWordsRule(100),
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Tangible value, networks, or initiatives you will introduce..."
                      style={FONT}
                    />
                  </Form.Item>
                </div>
              )}

              {/* SECTION 5: (6) COMMITMENT */}
              {assessmentSection === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (6) Commitment
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Confirm your availability, engagement willingness, and adherence to Y.O.U's mission.
                    </p>
                  </div>

                  <Form.Item
                    label={<FieldLabel text="6.1 Can you dedicate at least 5-10 hours per month to this role?" required />}
                    name={['assessment', 'commitHours']}
                    rules={[{ required: true, message: 'Please select an option' }]}
                  >
                    <Radio.Group className="flex gap-4">
                      <Radio value="Yes" style={FONT}>Yes</Radio>
                      <Radio value="No" style={FONT}>No</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="6.2 Are you willing to participate in virtual meetings and continental coordination activities?" required />}
                    name={['assessment', 'commitVirtualMeetings']}
                    rules={[{ required: true, message: 'Please select an option' }]}
                  >
                    <Radio.Group className="flex gap-4">
                      <Radio value="Yes" style={FONT}>Yes</Radio>
                      <Radio value="No" style={FONT}>No</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="6.3 Are you willing to recruit and mentor youth leaders within your region?" required />}
                    name={['assessment', 'commitRecruitMentor']}
                    rules={[{ required: true, message: 'Please select an option' }]}
                  >
                    <Radio.Group className="flex gap-4">
                      <Radio value="Yes" style={FONT}>Yes</Radio>
                      <Radio value="No" style={FONT}>No</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="6.4 Are you willing to uphold the values and mission of the Youth Organization Union?" required />}
                    name={['assessment', 'commitUpholdValues']}
                    rules={[{ required: true, message: 'Please select an option' }]}
                  >
                    <Radio.Group className="flex gap-4">
                      <Radio value="Yes" style={FONT}>Yes</Radio>
                      <Radio value="No" style={FONT}>No</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="6.5 Do you currently reside in the region you wish to represent?" required />}
                    name={['assessment', 'resideInRegion']}
                    rules={[{ required: true, message: 'Please select an option' }]}
                  >
                    <Radio.Group className="flex gap-4">
                      <Radio value="Yes" style={FONT}>Yes</Radio>
                      <Radio value="No" style={FONT}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}

              {/* SECTION 6: (7) SUPPORTING DOCUMENTS */}
              {assessmentSection === 6 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (7) Supporting Documents
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Please attach necessary documentation. CV/Resume is required.
                    </p>
                  </div>

                  <Form.Item
                    label={<FieldLabel text="7.1 Upload CV / Resume" required hint="Your updated Curriculum Vitae." />}
                    name="resumeCv"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload your resume/CV' }]}
                    extra={<span className="text-[13px] italic text-[#EE334E]">{UPLOAD_HINT}</span>}
                  >
                    <Upload beforeUpload={() => false} maxCount={1} listType="text">
                      <UploadButton label="Upload CV/Resume" />
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="7.2 Upload Organization Profile" hint="Capability deck or overview document (if applicable)." />}
                    name="orgProfileDoc"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra={<span className="text-[13px] italic text-[#EE334E]">{UPLOAD_HINT}</span>}
                  >
                    <Upload beforeUpload={() => false} maxCount={1} listType="text">
                      <UploadButton label="Upload Organization Profile" />
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="7.3 Upload Proof of Leadership Experience" hint="Certificates, letters of appointment, or recognition." />}
                    name="leadershipProofDoc"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra={<span className="text-[13px] italic text-[#EE334E]">{UPLOAD_HINT}</span>}
                  >
                    <Upload beforeUpload={() => false} multiple maxCount={5} listType="text">
                      <UploadButton label="Upload Proof of Leadership" />
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="7.4 Upload Any Additional Supporting Documents" hint="Articles, news coverage, portfolio materials." />}
                    name="additionalDocs"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra={<span className="text-[13px] italic text-[#EE334E]">{UPLOAD_HINT}</span>}
                  >
                    <Upload beforeUpload={() => false} multiple maxCount={5} listType="text">
                      <UploadButton label="Upload Additional Documents" />
                    </Upload>
                  </Form.Item>
                </div>
              )}

              {/* SECTION 7: (8) DECLARATION */}
              {assessmentSection === 7 && (
                <div className="space-y-4">
                  <div className="border-b border-neutral-200 pb-3 mb-4">
                    <h4 className="font-bold text-[18px] sm:text-[20px] text-[#111111]" style={FONT}>
                      (8) Declaration
                    </h4>
                    <p className="text-neutral-500 text-[14px]" style={FONT}>
                      Please certify the authenticity of your application before submission.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-200 mb-4">
                    <p className="text-[14px] sm:text-[15px] leading-relaxed text-neutral-800 italic" style={FONT}>
                      &ldquo;I certify that all information provided is true and accurate. I understand that
                      submission of this application does not guarantee appointment and that successful
                      candidates may be invited for an interview.&rdquo;
                    </p>
                    <p className="text-[13px] text-neutral-500 mt-2 italic" style={FONT}>
                      (Tôi cam đoan mọi thông tin khai báo là trung thực và chính xác. Tôi hiểu rằng việc nộp
                      đơn không đảm bảo việc bổ nhiệm và các ứng viên đạt tiêu chuẩn có thể được mời phỏng vấn).
                    </p>
                  </div>

                  <Form.Item
                    name={['assessment', 'declarationAgreed']}
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(new Error('You must accept the declaration statement to submit.')),
                      },
                    ]}
                  >
                    <Checkbox style={FONT} className="text-[14px] sm:text-[15px] text-neutral-900 font-semibold">
                      I agree and confirm all declarations stated above.
                    </Checkbox>
                  </Form.Item>

                  <Form.Item
                    label={<FieldLabel text="Digital Signature (Type your full legal name)" required />}
                    name={['assessment', 'declarationSignature']}
                    rules={[{ required: true, message: 'Please type your full legal name as signature' }]}
                  >
                    <Input placeholder="Type your full legal name" style={FONT} />
                  </Form.Item>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-neutral-200">
                {assessmentSection === 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 px-6 py-3.5 bg-neutral-100 text-neutral-700 text-[16px] font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                    style={FONT}
                  >
                    Back to Region
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAssessmentSection((s) => Math.max(s - 1, 1))}
                    className="w-1/3 px-6 py-3.5 bg-neutral-100 text-neutral-700 text-[16px] font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                    style={FONT}
                  >
                    Previous
                  </button>
                )}

                {assessmentSection < 7 ? (
                  <button
                    type="button"
                    onClick={handleNextAssessmentSection}
                    className="w-2/3 px-8 py-3.5 bg-[#005D9A] text-white text-[17px] font-semibold rounded-full hover:opacity-90 transition-opacity"
                    style={FONT}
                  >
                    Next: {ASSESSMENT_SECTIONS[assessmentSection]?.short}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => form.submit()}
                    className="w-2/3 px-8 py-3.5 bg-[#005D9A] text-white text-[17px] font-semibold rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
                    style={FONT}
                  >
                    {submitting ? 'Submitting Application…' : 'Submit Application'}
                  </button>
                )}
              </div>
            </div>

          </Form>
        </ConfigProvider>
      )}
    </Modal>
  );
}