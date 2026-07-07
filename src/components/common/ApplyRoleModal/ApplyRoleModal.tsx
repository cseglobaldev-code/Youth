import { Modal, Form, Input, ConfigProvider } from 'antd';
import { message } from 'antd';
import { StrapiService } from '@/lib/strapi';
export interface ApplyRoleFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  organizationName?: string;
  address?: string;
  organizationPhone?: string;
}

export interface ApplyRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: ApplyRoleFormValues) => void;
}

const FONT = { fontFamily: 'Open Sans, sans-serif' };

export function ApplyRoleModal({ open, onClose, onSubmit }: ApplyRoleModalProps) {
  const [form] = Form.useForm<ApplyRoleFormValues>();

  const handleFinish = async (values: ApplyRoleFormValues) => {
    try {
      await StrapiService.submitLeadershipApplication(values);
      message.success('Nộp đơn ứng tuyển thành công! Cảm ơn sự quan tâm của bạn.');
      onSubmit?.(values);
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi gửi thông tin ứng tuyển. Vui lòng thử lại.');
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
        Leadership Roles
      </h2>

      <ConfigProvider theme={{ token: { controlHeight: 48, borderRadius: 8 } }}>
        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark>
          {/* Your information */}
          <h3 className="font-semibold text-[22px] text-[#111111] mb-4" style={FONT}>
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

          {/* Your Organization */}
          <h3 className="font-semibold text-[22px] text-[#111111] mb-4 mt-2" style={FONT}>
            Your Organization
          </h3>

          <Form.Item label={<span style={FONT}>Organization name</span>} name="organizationName">
            <Input placeholder="Enter your organization name" style={FONT} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item label={<span style={FONT}>Address</span>} name="address">
              <Input placeholder="Enter address" style={FONT} />
            </Form.Item>
            <Form.Item
              label={<span style={FONT}>Organization's phone number</span>}
              name="organizationPhone"
            >
              <Input placeholder="Enter phone number" style={FONT} />
            </Form.Item>
          </div>

          <button
            type="button"
            onClick={() => form.submit()}
            className="w-full mt-2 px-8 py-4 bg-[#005D9A] text-white text-[20px] font-semibold rounded-full hover:opacity-90 transition-opacity"
            style={FONT}
          >
            Register Now
          </button>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}
