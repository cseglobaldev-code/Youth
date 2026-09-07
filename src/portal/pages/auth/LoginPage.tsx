import { useState } from 'react';
import { Form, Input, Button, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { ROUTES } from '@/routes/paths';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = usePortalAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || ROUTES.PORTAL.DASHBOARD;

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4">
      <Card
        className="w-full max-w-[420px] rounded-3xl border border-neutral-200 shadow-xl overflow-hidden p-4 sm:p-6"
      >
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#005D9A] text-white text-xl font-bold shadow-md">
            Y.O.U
          </div>
          <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Management Portal
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Sign in with your staff or administrator account</p>
        </div>

        {errorMsg && (
          <Alert
            type="error"
            showIcon
            message={errorMsg}
            className="mb-6 rounded-xl"
            closable
            onClose={() => setErrorMsg(null)}
          />
        )}

        <Form layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email address' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<UserOutlined className="text-neutral-400" />} placeholder="Email address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined className="text-neutral-400" />} placeholder="Password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="mt-2 h-12 rounded-xl !bg-[#005D9A] text-base font-semibold shadow-md hover:!opacity-90"
          >
            Sign In to Portal
          </Button>
        </Form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Youth Organization Union · Operating across 6 continents
        </div>
      </Card>
    </div>
  );
}