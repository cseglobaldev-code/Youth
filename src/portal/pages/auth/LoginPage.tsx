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
    <div className="relative flex min-h-screen items-center justify-center bg-white px-4 overflow-hidden">
      {/* Signature Y.O.U Ambient Glowing Background Circles (from RootLayout.tsx) */}
      <div
        className="absolute top-0 left-0 w-[480px] h-[360px] rounded-full pointer-events-none"
        style={{ background: '#2980B9', filter: 'blur(160px)', opacity: 0.35 }}
      />
      <div
        className="absolute top-0 right-0 w-[560px] h-[260px] rounded-full pointer-events-none"
        style={{ background: '#EE334E', filter: 'blur(160px)', opacity: 0.35 }}
      />

      <Card className="relative z-10 w-full max-w-[440px] rounded-3xl border border-neutral-200/80 shadow-[0_20px_50px_rgba(11,26,43,0.08)] backdrop-blur-md bg-white/95 p-4 sm:p-7">
        {/* Top Rainbow Bar */}
        <div
          className="h-1.5 w-20 mx-auto rounded-full mb-6"
          style={{
            background: 'linear-gradient(90deg, #EE334E 0%, #FCB131 33%, #00A651 67%, #0081C8 100%)',
          }}
        />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <img
            src="/images/common/brand/logo.svg"
            alt="Youth Organization Union"
            className="h-11 w-auto mx-auto object-contain mb-3"
          />
          <h1
            className="text-2xl font-bold text-neutral-900 m-0"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Management Portal
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 m-0">
            Sign in with your authorized administrator or staff account
          </p>
        </div>

        {errorMsg && (
          <Alert
            type="error"
            showIcon
            title={errorMsg}
            className="mb-6 rounded-2xl"
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
            <Input
              prefix={<UserOutlined className="text-neutral-400" />}
              placeholder="Staff Email"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-neutral-400" />}
              placeholder="Password"
              className="rounded-xl"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="mt-2 h-12 rounded-full !bg-[#005D9A] hover:!bg-[#125A94] text-base font-semibold shadow-md transition-all active:scale-[0.98]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Sign In to Workspace
          </Button>
        </Form>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Youth Organization Union · Where Unity Drives Change
        </div>
      </Card>
    </div>
  );
}