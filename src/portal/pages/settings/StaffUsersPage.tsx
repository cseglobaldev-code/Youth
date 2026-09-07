import { useEffect, useState, useCallback } from 'react';
import {
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Table,
  Card,
  Space,
  Popconfirm,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import {
  fetchStaffUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  fetchRoles,
} from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

const ROLE_PERMISSIONS: Record<string, { label: string; color: string; modules: string[] }> = {
  admin: {
    label: 'Super Admin',
    color: 'purple',
    modules: ['Content Studio', 'Page Builder', 'Candidate ATS', 'Media Studio', 'Global Settings', 'Staff Accounts'],
  },
  'super admin': {
    label: 'Super Admin',
    color: 'purple',
    modules: ['Content Studio', 'Page Builder', 'Candidate ATS', 'Media Studio', 'Global Settings', 'Staff Accounts'],
  },
  editor: {
    label: 'Content Editor',
    color: 'blue',
    modules: ['Projects', 'Member Orgs', 'News & Stories', 'FAQs', 'Leadership', 'Documents', 'Page Builder', 'Media Studio'],
  },
  'content editor': {
    label: 'Content Editor',
    color: 'blue',
    modules: ['Projects', 'Member Orgs', 'News & Stories', 'FAQs', 'Leadership', 'Documents', 'Page Builder', 'Media Studio'],
  },
  reviewer: {
    label: 'HR / Reviewer',
    color: 'orange',
    modules: ['Leadership Candidates ATS', 'Organization Applications', 'Inquiries Inbox', 'Support Postbox'],
  },
  'hr / reviewer': {
    label: 'HR / Reviewer',
    color: 'orange',
    modules: ['Leadership Candidates ATS', 'Organization Applications', 'Inquiries Inbox', 'Support Postbox'],
  },
  viewer: {
    label: 'Viewer / Auditor',
    color: 'default',
    modules: ['Read-only view of Metrics, Content, and Applications'],
  },
  'viewer / auditor': {
    label: 'Viewer / Auditor',
    color: 'default',
    modules: ['Read-only view of Metrics, Content, and Applications'],
  },
  authenticated: {
    label: 'Staff Member',
    color: 'cyan',
    modules: ['Content Studio', 'Candidate ATS', 'Documents'],
  },
  public: {
    label: 'Public (Guest)',
    color: 'default',
    modules: ['Public Website Read-Only'],
  },
};

function getRoleConfig(role: any) {
  if (!role) return { label: 'Staff Member', color: 'blue', modules: ['Standard Access'] };
  const typeKey = (role.type || '').toLowerCase();
  const nameKey = (role.name || '').toLowerCase();
  return ROLE_PERMISSIONS[typeKey] || ROLE_PERMISSIONS[nameKey] || {
    label: role.name || 'Staff Member',
    color: 'blue',
    modules: ['Content Studio', 'Candidate ATS'],
  };
}

export function StaffUsersPage() {
  const { token, user: currentUser } = usePortalAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRoleType, setSelectedRoleType] = useState<string>('editor');
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        fetchStaffUsers(token),
        fetchRoles(token),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      message.error('Failed to load staff accounts');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setSelectedRoleType('editor');
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    const roleType = user.role?.type || (user.role?.name?.toLowerCase().includes('admin') ? 'admin' : 'editor');
    setSelectedRoleType(roleType);

    form.setFieldsValue({
      username: user.username,
      email: user.email,
      role: user.role?.id || roles[0]?.id,
      blocked: Boolean(user.blocked),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user: any) => {
    if (user.id === currentUser?.id) {
      message.error('You cannot delete your own active account');
      return;
    }
    try {
      await deleteStaffUser(user.id, token);
      message.success('Staff account removed');
      loadData();
    } catch {
      message.error('Failed to delete staff user');
    }
  };

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true);
      if (editingUser) {
        await updateStaffUser(
          editingUser.id,
          {
            role: values.role,
            blocked: values.blocked,
          },
          token
        );
        message.success('Staff role and status updated');
      } else {
        await createStaffUser(
          {
            username: values.username,
            email: values.email,
            password: values.password,
            role: values.role,
            confirmed: true,
            blocked: false,
          },
          token
        );
        message.success('New staff user created');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Staff Member',
      dataIndex: 'username',
      key: 'username',
      render: (u: string, r: any) => (
        <div>
          <span className="font-semibold text-neutral-900 flex items-center gap-2">
            <UserOutlined className="text-blue-500" /> {u}
            {r.id === currentUser?.id && <Tag color="cyan">You</Tag>}
          </span>
          <span className="text-xs text-neutral-400">{r.email}</span>
        </div>
      ),
    },
    {
      title: 'Role / Permissions',
      key: 'role',
      render: (_: any, r: any) => {
        const type = r.role?.type || (r.role?.name?.toLowerCase().includes('admin') ? 'admin' : 'editor');
        const roleConf = ROLE_PERMISSIONS[type] || { label: r.role?.name || 'Staff', color: 'blue' };

        return <Tag color={roleConf.color}>{roleConf.label}</Tag>;
      },
    },
    {
      title: 'Account Status',
      dataIndex: 'blocked',
      key: 'status',
      render: (blocked: boolean) =>
        blocked ? (
          <Badge status="error" text="Blocked / Suspended" />
        ) : (
          <Badge status="success" text="Active" />
        ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'date',
      render: (d: string) => (d ? new Date(d).toLocaleDateString() : '—'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
            title="Edit Role & Permissions"
          />
          {record.id !== currentUser?.id && (
            <Popconfirm title="Delete staff account?" onConfirm={() => handleDelete(record)}>
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="rounded-3xl border border-neutral-200 shadow-sm p-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 m-0">Staff Accounts &amp; Permissions</h2>
            <p className="text-xs text-neutral-400 mt-1 m-0">
              Manage team access, assign specific roles, and oversee staff privileges.
            </p>
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreate}
            className="rounded-xl !bg-[#005D9A] font-semibold"
          >
            Add Staff Account
          </Button>
        </div>

        <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
      </Card>

      {/* Modal with preserve={false} to cleanly bind Form lifecycle */}
      <Modal
        title={
          <span className="font-bold text-neutral-900">
            {editingUser ? `Edit Permissions: ${editingUser.username}` : 'Create Staff Account'}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          preserve={false} // 👈 Prevents disconnected useForm lifecycle warnings
          className="mt-4"
        >
          {!editingUser && (
            <>
              <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                <Input placeholder="e.g. john_doe" />
              </Form.Item>
              <Form.Item label="Staff Email" name="email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="john@youthorgunion.org" />
              </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
                <Input.Password placeholder="Initial secure password" />
              </Form.Item>
            </>
          )}

          {/* Role Selector */}
          <Form.Item
            label="Assigned Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role' }]}
            initialValue={roles[0]?.id}
          >
            <Select
              onChange={(roleId) => {
                const found = roles.find((r) => r.id === roleId);
                const t = found?.type || found?.name || 'editor';
                setSelectedRoleType(t.toLowerCase());
              }}
              options={roles.map((r) => {
                const conf = getRoleConfig(r);

                return {
                  value: r.id,
                  label: (
                    <div className="flex items-center justify-between py-1">
                      <span className="font-semibold">{r.name}</span>
                      <Tag color={conf.color}>{conf.label}</Tag>
                    </div>
                  ),
                };
              })}
            />
          </Form.Item>

          {/* Visual Role Permissions Matrix Box */}
          <div className="mb-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <SafetyCertificateOutlined className="text-blue-500" /> Accessible Portal Modules for this Role:
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {(ROLE_PERMISSIONS[selectedRoleType]?.modules || ['Standard Dashboard Access']).map((mod) => (
                <span key={mod} className="inline-flex items-center gap-1 text-xs bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-700">
                  <CheckCircleOutlined className="text-emerald-500 text-[10px]" /> {mod}
                </span>
              ))}
            </div>
          </div>

          {editingUser && (
            <Form.Item label="Account Access Status" name="blocked" valuePropName="checked">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <span className="font-semibold block text-sm">Suspend / Block Access</span>
                  <span className="text-xs text-neutral-400">Blocked users cannot sign into the management portal.</span>
                </div>
                <Switch />
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}