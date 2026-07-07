import { Modal, Form, Input, ConfigProvider } from 'antd';
import { PillButton } from '@/components/ui/PillButton';
import { message } from 'antd';
import { StrapiService } from '@/lib/strapi';
export interface RegisterOrganizationFormValues {
  organizationName: string;
  address: string;
  organizationPhone?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface RegisterOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: RegisterOrganizationFormValues) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };

export function RegisterOrganizationModal({ open, onClose, onSubmit }: RegisterOrganizationModalProps) {
  const [form] = Form.useForm<RegisterOrganizationFormValues>();

  const handleFinish = async (values: RegisterOrganizationFormValues) => {
    try {
      await StrapiService.submitOrgRegistration(values);
      message.success('Đăng ký tổ chức thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.');
      onSubmit?.(values);
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi gửi thông tin đăng ký. Vui lòng thử lại.');
    }
  };

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
      <h2 className="font-bold text-[36px] text-[#111111] mb-6" style={FONT}>
        Register Your Organization
      </h2>

      <ConfigProvider theme={{ token: { controlHeight: 48, borderRadius: 8 } }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark>
          {/* Your Organization */}
          <h3 className="font-semibold text-[22px] text-[#111111] mb-4" style={FONT}>
            Your Organization
          </h3>

          <Form.Item
            label={<span style={FONT}>Organization name</span>}
            name="organizationName"
            rules={[{ required: true, message: 'Please enter organization name' }]}
          >
            <Input placeholder="Enter your organization name" style={FONT} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label={<span style={FONT}>Address</span>}
              name="address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input placeholder="Enter address" style={FONT} />
            </Form.Item>
            <Form.Item
              label={<span style={FONT}>Organization's phone number</span>}
              name="organizationPhone"
            >
              <Input placeholder="Enter phone number" style={FONT} />
            </Form.Item>
          </div>

          {/* Your information */}
          <h3 className="font-semibold text-[22px] text-[#111111] mb-4 mt-2" style={FONT}>
            Your infomation
          </h3>

          <Form.Item
            label={<span style={FONT}>Fullname</span>}
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Enter your full name" style={FONT} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label={<span style={FONT}>Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email' },
              ]}
            >
              <Input placeholder="Enter your email" style={FONT} />
            </Form.Item>
            <Form.Item
              label={<span style={FONT}>Number phone</span>}
              name="phoneNumber"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="Enter your phone number" style={FONT} />
            </Form.Item>
          </div>

          <PillButton variant="solid" size="lg" fullWidth onClick={() => form.submit()} className="mt-2">
            Register Now
          </PillButton>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}
