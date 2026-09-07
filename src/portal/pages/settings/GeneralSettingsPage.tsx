import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { MediaPicker } from '../../components/shared/MediaPicker';
import { fetchSingleType, updateSingleType } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

export function GeneralSettingsPage() {
  const { token } = usePortalAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrCodeId, setQrCodeId] = useState<number | null>(null);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchSingleType('global-setting', {}, token)
      .then((data) => {
        if (data) {
          form.setFieldsValue(data);
          setQrCodeId(data.qrCodeImage?.id || null);
          setQrPreviewUrl(data.qrCodeImage?.url || null);
        }
      })
      .catch(() => message.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [form, token]);

  const handleFinish = async (values: any) => {
    try {
      setSaving(true);
      await updateSingleType(
        'global-setting',
        {
          ...values,
          qrCodeImage: qrCodeId,
        },
        token
      );
      message.success('Website configuration saved successfully');
    } catch {
      message.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 m-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Website Global Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1 m-0">
            Configure contact info, banking donation details, and legal pages.
          </p>
        </div>

        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={() => form.submit()}
          className="rounded-xl !bg-[#005D9A] font-semibold"
        >
          Save Settings
        </Button>
      </div>

      <Card loading={loading} className="rounded-3xl border border-neutral-200 shadow-sm">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Divider>Contact &amp; Operations</Divider>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Official Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="info@youthorgunion.org" />
            </Form.Item>
            <Form.Item label="Hotline Phone" name="hotline">
              <Input placeholder="(+84) 98.242.1109" />
            </Form.Item>
          </div>

          <Form.Item label="Office Address" name="address" rules={[{ required: true }]}>
            <Input placeholder="e.g. Tầng 5, Tòa nhà Y.O.U Global, Hà Nội, Việt Nam" />
          </Form.Item>

          <Form.Item label="Operating Hours / Response Time" name="operatingTime">
            <Input placeholder="e.g. Phản hồi trong vòng 24–48 giờ" />
          </Form.Item>

          <Divider>Donations &amp; Bank Account</Divider>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Form.Item label="Bank Name" name="bankName">
              <Input placeholder="MB Bank - Ben Thanh Branch" />
            </Form.Item>
            <Form.Item label="Account Number" name="accountNumber">
              <Input placeholder="000999999999" />
            </Form.Item>
            <Form.Item label="Account Holder" name="accountHolder">
              <Input placeholder="Youth Organization Union" />
            </Form.Item>
          </div>

          <Form.Item label="Transfer Syntax Description" name="transferSyntaxNote">
            <Input placeholder="YOUPRJ26 - [Project Names]" />
          </Form.Item>

          <Form.Item label="Payment QR Code Image">
            <MediaPicker
              previewUrl={qrPreviewUrl}
              onChange={(id, url) => {
                setQrCodeId(id);
                setQrPreviewUrl(url || null);
              }}
            />
          </Form.Item>

          <Divider>Legal &amp; Policies</Divider>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Terms of Service URL" name="termsOfServiceUrl">
              <Input placeholder="https://... or /terms" />
            </Form.Item>
            <Form.Item label="Privacy Policy URL" name="privacyPolicyUrl">
              <Input placeholder="https://... or /privacy" />
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
}