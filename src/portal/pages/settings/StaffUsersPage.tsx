import { useEffect, useState, useCallback } from 'react';
import { Tag, Button, Modal, Form, Input, message, Table, Card } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { fetchStaffUsers, createStaffUser } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

export function StaffUsersPage() {
  const { token } = usePortalAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchStaffUsers(token);
      setUsers(data);
    } catch {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (values: any) => {
    try {
      setSubmitting(true);
      await createStaffUser({ ...values, confirmed: true }, token);
      message.success('Staff user created successfully');
      setIsModalOpen(false);
      form.resetFields();
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (u: string) => (
        <span className="font-semibold text-neutral-900 flex items-center gap-2">
          <UserOutlined className="text-blue-500" /> {u}
        </span>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      key: 'role',
      render: (_: any, r: any) => (
        <Tag color={r.role?.type === 'admin' ? 'purple' : 'blue'}>
          {r.role?.name || 'Authenticated Staff'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => (d ? new Date(d).toLocaleDateString() : '—'),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="rounded-3xl border border-neutral-200 shadow-sm p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 m-0">Staff &amp; Admin Users</h2>
            <p className="text-xs text-neutral-400 mt-1 m-0">Authorized portal accounts and roles.</p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl !bg-[#005D9A] font-semibold"
          >
            Add Staff Account
          </Button>
        </div>

        <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
      </Card>

      <Modal
        title="Create Staff Account"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item label="Username" name="username" rules={[{ required: true }]}>
            <Input placeholder="e.g. john_doe" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="john@youthorgunion.org" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="Secure password (min 6 characters)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}