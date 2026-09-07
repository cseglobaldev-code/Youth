import { useEffect, useState, useCallback } from 'react';
import { Tag, Button, Modal, Form, Input, Select, Popconfirm, message, Space } from 'antd';
import { EditOutlined, DeleteOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { MediaPicker } from '../../components/shared/MediaPicker';
import { fetchCollection, createEntry, updateEntry, deleteEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

const CATEGORIES = [
  { value: 'governance', label: 'Governance Documents' },
  { value: 'membership', label: 'Membership Documents' },
  { value: 'annual-reports', label: 'Annual Reports' },
];

const FILE_TYPES = ['pdf', 'xls', 'doc', 'ppt'];

export function DocumentsManagerPage() {
  const { token } = usePortalAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection('policy-documents', { pageSize: 100, populate: ['file'] }, token);
      setDocuments(res.data || []);
    } catch (err: any) {
      message.error('Failed to load documents');
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      title: item.title,
      category: item.category,
      fileType: item.fileType || 'pdf',
      fileSize: item.fileSize,
      file: item.file?.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      const id = item.documentId || item.id;
      await deleteEntry('policy-documents', id, token);
      message.success('Document deleted');
      loadData();
    } catch (err: any) {
      message.error('Delete failed');
    }
  };

  const handleFormFinish = async (values: any) => {
    try {
      setSubmitting(true);
      if (editingItem) {
        const id = editingItem.documentId || editingItem.id;
        await updateEntry('policy-documents', id, values, token);
        message.success('Document updated');
      } else {
        await createEntry('policy-documents', values, token);
        message.success('Document created');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      message.error('Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (t: string, r: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer flex items-center gap-2" onClick={() => handleOpenEdit(r)}>
          <FilePdfOutlined className="text-red-500" /> {t}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'cat',
      render: (cat: string) => <Tag color="blue">{cat?.toUpperCase()}</Tag>,
    },
    {
      title: 'File Type',
      dataIndex: 'fileType',
      key: 'type',
      render: (t: string) => <Tag>{t?.toUpperCase()}</Tag>,
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'size',
      render: (s: string) => s || '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm title="Delete document?" onConfirm={() => handleDelete(record)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PortalDataTable
        title="Official Policy & Governance Documents"
        columns={columns}
        dataSource={documents}
        loading={loading}
        total={documents.length}
        onAddNew={handleOpenCreate}
        onRefresh={loadData}
      />

      <Modal
        title={editingItem ? 'Edit Policy Document' : 'Upload Document'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item label="Document Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Y.O.U Constitution & Bylaws 2026" />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Category" name="category" initialValue="governance">
              <Select options={CATEGORIES} />
            </Form.Item>

            <Form.Item label="Format" name="fileType" initialValue="pdf">
              <Select options={FILE_TYPES.map((t) => ({ value: t, label: t.toUpperCase() }))} />
            </Form.Item>
          </div>

          <Form.Item label="Display File Size" name="fileSize">
            <Input placeholder="e.g. 2.4 MB" />
          </Form.Item>

          <Form.Item label="Attached File Document" name="file">
            <MediaPicker previewUrl={editingItem?.file?.url} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}