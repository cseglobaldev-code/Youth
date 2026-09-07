import { useEffect, useState, useCallback } from 'react';
import {
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { SdgMultiSelect } from '../../components/shared/SdgMultiSelect';
import { MediaPicker } from '../../components/shared/MediaPicker';
import { fetchCollection, createEntry, updateEntry, deleteEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

const STATUS_TAG_COLORS = {
  ongoing: 'processing',
  completed: 'success',
  planned: 'warning',
};

const REGIONS = [
  'Southeast Asia',
  'East Asia',
  'South Asia',
  'Central Asia',
  'North Africa',
  'West Africa',
  'Central Africa',
  'East Africa',
  'Southern Africa',
  'North America',
  'Latin America',
  'Europe',
  'Global',
];

export function ProjectsManagerPage() {
  const { token } = usePortalAuth();
  const [data, setData] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection(
        'projects',
        {
          page,
          pageSize,
          search,
          searchField: 'name',
          populate: ['outstandingImage', 'member'],
        },
        token
      );
      setData(res.data);
      setTotal(res.meta?.pagination?.total || 0);
    } catch (err: any) {
      message.error(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, token]);

  useEffect(() => {
    loadData();
    // Load members for relation dropdown
    fetchCollection('members', { pageSize: 100 }, token)
      .then((res) => setMembers(res.data))
      .catch(() => {});
  }, [loadData, token]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      impactIndication: item.impactIndication,
      region: item.region,
      countriesCovered: item.countriesCovered,
      focusSdgs: Array.isArray(item.focusSdgs)
        ? item.focusSdgs.map(Number)
        : [],
      projectStatus: item.projectStatus || 'ongoing',
      year: item.year,
      member: item.member?.documentId || item.member?.id,
      outstandingImage: item.outstandingImage?.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      const id = item.documentId || item.id;
      await deleteEntry('projects', id, token);
      message.success('Project deleted successfully');
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to delete project');
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
        await updateEntry('projects', id, payload, token);
        message.success('Project updated successfully');
      } else {
        await createEntry('projects', payload, token);
        message.success('Project created successfully');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => handleOpenEdit(record)}>
          {name}
        </span>
      ),
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: (region: string) => region || '—',
    },
    {
      title: 'Status',
      dataIndex: 'projectStatus',
      key: 'projectStatus',
      render: (status: string) => {
        const color = STATUS_TAG_COLORS[status as keyof typeof STATUS_TAG_COLORS] || 'default';
        return <Tag color={color}>{status?.toUpperCase() || 'ONGOING'}</Tag>;
      },
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      render: (year: number) => year || '—',
    },
    {
      title: 'Led By',
      key: 'member',
      render: (_: any, record: any) => record.member?.name || '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Delete project"
            description="Are you sure you want to delete this project?"
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            okType="danger"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PortalDataTable
        title="Projects Studio"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={(p, ps) => {
          setPage(p);
          setPageSize(ps);
        }}
        onSearch={setSearch}
        onAddNew={handleOpenCreate}
        onRefresh={loadData}
        searchPlaceholder="Search projects by name…"
      />

      {/* Create / Edit Modal */}
      <Modal
        title={editingItem ? 'Edit Project' : 'Create New Project'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={720}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            label="Project Name"
            name="name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input placeholder="e.g. Global Diplomacy Leadership Certification" />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Project objectives, beneficiaries, and activities..." />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Region" name="region" rules={[{ required: true }]}>
              <Select
                placeholder="Select region"
                options={REGIONS.map((r) => ({ value: r, label: r }))}
              />
            </Form.Item>

            <Form.Item label="Status" name="projectStatus" initialValue="ongoing">
              <Select
                options={[
                  { value: 'ongoing', label: 'Ongoing' },
                  { value: 'planned', label: 'Planning' },
                  { value: 'completed', label: 'Completed' },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Year" name="year" initialValue={new Date().getFullYear()}>
              <Input type="number" />
            </Form.Item>

            <Form.Item label="Led by Organization" name="member">
              <Select
                placeholder="Link to member organization"
                allowClear
                options={members.map((m) => ({
                  value: m.documentId || m.id,
                  label: m.name,
                }))}
              />
            </Form.Item>
          </div>

          <Form.Item label="Impact Indication" name="impactIndication">
            <Input placeholder="e.g. 1,500 Beneficiaries reached, 5,530 training hours" />
          </Form.Item>

          <Form.Item label="Countries Covered" name="countriesCovered">
            <Input placeholder="e.g. Vietnam, Cambodia, Laos" />
          </Form.Item>

          <Form.Item label="Focus SDGs (Max 3)" name="focusSdgs">
            <SdgMultiSelect max={3} />
          </Form.Item>

          <Form.Item label="Outstanding Cover Image" name="outstandingImage">
            <MediaPicker previewUrl={editingItem?.outstandingImage?.url} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}