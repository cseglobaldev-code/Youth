import { useEffect, useState, useCallback } from 'react';
import {
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
import { DIAL_CODES } from '@/data/dialCodes';

const CONTINENTS = ['Asia', 'Africa', 'America', 'Australia', 'Europe'];

export function MembersManagerPage() {
  const { token } = usePortalAuth();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection(
        'members',
        {
          page,
          pageSize,
          search,
          searchField: 'name',
          populate: ['logo', 'cover'],
        },
        token
      );
      setData(res.data);
      setTotal(res.meta?.pagination?.total || 0);
    } catch (err: any) {
      message.error(err.message || 'Failed to load member organizations');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      shortDescription: item.shortDescription,
      description: item.description,
      country: item.country,
      continent: item.continent,
      leader: item.leader,
      period: item.period || '2021 → present',
      focusSdgs: Array.isArray(item.focusSdgs)
        ? item.focusSdgs.map(Number)
        : [],
      logo: item.logo?.id,
      cover: item.cover?.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      const id = item.documentId || item.id;
      await deleteEntry('members', id, token);
      message.success('Member organization deleted');
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Delete failed');
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
        await updateEntry('members', id, payload, token);
        message.success('Member updated successfully');
      } else {
        await createEntry('members', payload, token);
        message.success('Member created successfully');
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
      title: 'Organization Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => handleOpenEdit(record)}>
          {name}
        </span>
      ),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Continent',
      dataIndex: 'continent',
      key: 'continent',
    },
    {
      title: 'Representative',
      dataIndex: 'leader',
      key: 'leader',
      render: (leader: string) => leader || '—',
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
            title="Delete Member"
            description="Delete this organization record?"
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
        title="Member Organizations Studio"
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
        searchPlaceholder="Search member orgs…"
      />

      <Modal
        title={editingItem ? 'Edit Organization' : 'Add New Organization'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={720}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item label="Organization Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Education Hub Ghana" />
          </Form.Item>

          <Form.Item label="Short Introduction (Card Teaser)" name="shortDescription" rules={[{ required: true }]}>
            <Input placeholder="One sentence summary (~140 chars)" />
          </Form.Item>

          <Form.Item label="Full Overview" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Detailed mission, community impact, programs..." />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Country" name="country" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select country"
                options={DIAL_CODES.map((d) => ({ value: d.country, label: d.country }))}
              />
            </Form.Item>

            <Form.Item label="Continent" name="continent" rules={[{ required: true }]}>
              <Select
                placeholder="Select continent"
                options={CONTINENTS.map((c) => ({ value: c, label: c }))}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Representative / Leader Name" name="leader">
              <Input placeholder="Full name of organization lead" />
            </Form.Item>

            <Form.Item label="Operating Period" name="period" initialValue="2021 → present">
              <Input placeholder="e.g. 2019 → present" />
            </Form.Item>
          </div>

          <Form.Item label="Focus SDGs (Max 3)" name="focusSdgs">
            <SdgMultiSelect max={3} />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Logo" name="logo">
              <MediaPicker previewUrl={editingItem?.logo?.url} />
            </Form.Item>

            <Form.Item label="Cover Banner" name="cover">
              <MediaPicker previewUrl={editingItem?.cover?.url} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}