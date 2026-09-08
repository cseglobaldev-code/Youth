import { useEffect, useState, useCallback } from 'react';
import { Tag, Button, Modal, Form, Input, Select, Popconfirm, message, Space, Avatar, Radio } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { MediaPicker } from '../../components/shared/MediaPicker';
import { SdgMultiSelect } from '../../components/shared/SdgMultiSelect';
import { fetchCollection, createEntry, updateEntry, deleteEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { CONTINENT_REGIONS } from '@/api/leadership';
import type { Continent } from '@/types';
import { useRolePermissions } from '../../hooks/useRolePermissions';

const CONTINENTS: Continent[] = ['Asia', 'Africa', 'America', 'Australia', 'Europe'];

export function LeadershipManagerPage() {
  const { token } = usePortalAuth();
  const { canManageContent, isReadOnly } = useRolePermissions();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<Continent>('Asia');
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection(
        'team-members',
        {
          pageSize: 100,
          sort: 'displayOrder:asc',
          populate: ['avatar', 'activityImages'],
        },
        token
      );
      setMembers(res.data || []);
    } catch (err: any) {
      message.error(err.message || 'Failed to load team roster');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setSelectedContinent('Asia');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setSelectedContinent(item.continent || 'Asia');
    form.setFieldsValue({
      name: item.name,
      role: item.role,
      leadershipType: item.leadershipType,
      continent: item.continent,
      regionGroup: item.regionGroup,
      year: item.year || '2026 - 2027',
      bio: item.bio,
      focusSdgs: Array.isArray(item.focusSdgs) ? item.focusSdgs.map(Number) : [],
      avatar: item.avatar?.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      const id = item.documentId || item.id;
      await deleteEntry('team-members', id, token);
      message.success('Leader profile deleted');
      loadData();
    } catch (err: any) {
      message.error('Delete failed');
    }
  };

  const handleFormFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const payload = {
        ...values,
        focusSdgs: values.focusSdgs ? values.focusSdgs.map(String) : [],
      };

      if (editingItem) {
        const id = editingItem.documentId || editingItem.id;
        await updateEntry('team-members', id, payload, token);
        message.success('Leader profile updated');
      } else {
        await createEntry('team-members', payload, token);
        message.success('Leader profile created');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error('Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    if (filterType === 'all') return true;
    return m.leadershipType === filterType;
  });

  const columns: TableColumnsType<any> = [
    {
      title: 'Leader',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, r: any) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleOpenEdit(r)}>
          <Avatar src={r.avatar?.url} style={{ backgroundColor: '#005D9A' }}>
            {name?.[0]}
          </Avatar>
          <div>
            <span className="font-semibold text-neutral-900 block">{name}</span>
            <span className="text-xs text-neutral-500">{r.role}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'leadershipType',
      key: 'type',
      render: (t: string) => (
        <Tag color={t === 'executive' ? 'purple' : 'blue'}>
          {t === 'executive' ? 'Executive Chair' : 'Continental Director'}
        </Tag>
      ),
    },
    {
      title: 'Region',
      key: 'region',
      render: (_: any, r: any) => (
        <span>
          {r.continent} {r.regionGroup ? `· ${r.regionGroup}` : ''}
        </span>
      ),
    },
    {
      title: 'Term',
      dataIndex: 'year',
      key: 'year',
      render: (_: any, record: any) => (
      <Space>
        <Button
          type="text"
          icon={isReadOnly ? <EyeOutlined /> : <EditOutlined />}
          onClick={() => handleOpenEdit(record)}
          title={isReadOnly ? 'Inspect Profile' : 'Edit Profile'}
        />
        {!isReadOnly && canManageContent && (
          <Popconfirm title="Delete profile?" onConfirm={() => handleDelete(record)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </Space>
    ),
  },
  ];

  return (
    <div>
      <PortalDataTable
        title="Leadership Team Roster"
        columns={columns}
        dataSource={filteredMembers}
        loading={loading}
        total={filteredMembers.length}
        onAddNew={canManageContent ? handleOpenCreate : undefined}
        onRefresh={loadData}
        extraActions={
          <Radio.Group value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="executive">Executives</Radio.Button>
            <Radio.Button value="continental-director">Directors</Radio.Button>
          </Radio.Group>
        }
      />

      <Modal
        title={editingItem ? 'Edit Leadership Profile' : 'Add Leadership Profile'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={680}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="e.g. Safin Hussein Mohammed" />
            </Form.Item>
            <Form.Item label="Role Title" name="role" rules={[{ required: true }]}>
              <Input placeholder="e.g. President & Chair / Regional Director" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Form.Item label="Leadership Type" name="leadershipType" initialValue="executive">
              <Select
                options={[
                  { value: 'executive', label: 'Executive Board' },
                  { value: 'continental-director', label: 'Continental Director' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Continent" name="continent" initialValue="Asia">
              <Select
                options={CONTINENTS.map((c) => ({ value: c, label: c }))}
                onChange={(c) => setSelectedContinent(c as Continent)}
              />
            </Form.Item>

            <Form.Item label="Sub-Region" name="regionGroup">
              <Select
                allowClear
                placeholder="Select sub-region"
                options={(CONTINENT_REGIONS[selectedContinent] || []).map((r) => ({
                  value: r,
                  label: r,
                }))}
              />
            </Form.Item>
          </div>

          <Form.Item label="Term Year" name="year" initialValue="2026 - 2027">
            <Input placeholder="e.g. 2026 - 2027" />
          </Form.Item>

          <Form.Item label="Biography Statement" name="bio">
            <Input.TextArea rows={4} placeholder="Leadership bio..." />
          </Form.Item>

          <Form.Item label="Focus SDGs" name="focusSdgs">
            <SdgMultiSelect max={3} />
          </Form.Item>

          <Form.Item label="Avatar Photo" name="avatar">
            <MediaPicker previewUrl={editingItem?.avatar?.url} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}