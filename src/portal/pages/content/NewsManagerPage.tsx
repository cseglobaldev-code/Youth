import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { MediaPicker } from '../../components/shared/MediaPicker';
import { fetchCollection, createEntry, updateEntry, deleteEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

export function NewsManagerPage() {
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
        'news-items',
        {
          page,
          pageSize,
          search,
          searchField: 'title',
          populate: ['image'],
        },
        token
      );
      setData(res.data);
      setTotal(res.meta?.pagination?.total || 0);
    } catch (err: any) {
      message.error(err.message || 'Failed to load news items');
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
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      author: item.author || 'Y.O.U Alliance',
      date: item.date ? dayjs(item.date) : dayjs(),
      image: item.image?.id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      const id = item.documentId || item.id;
      await deleteEntry('news-items', id, token);
      message.success('Article deleted');
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
        date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
      };

      if (editingItem) {
        const id = editingItem.documentId || editingItem.id;
        await updateEntry('news-items', id, payload, token);
        message.success('Article updated');
      } else {
        await createEntry('news-items', payload, token);
        message.success('Article created');
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => handleOpenEdit(record)}>
          {title}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Published Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
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
            title="Delete story"
            description="Are you sure you want to delete this news story?"
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
        title="News & Stories Studio"
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
        searchPlaceholder="Search news articles…"
      />

      <Modal
        title={editingItem ? 'Edit Article' : 'Write New Article'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={720}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item label="Story Headline" name="title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Global Diplomacy Leadership Certification 2026 Launched" />
          </Form.Item>

          <Form.Item label="Story Teaser / Excerpt" name="excerpt" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Summary of the announcement or impact story..." />
          </Form.Item>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Form.Item label="Category / Region" name="category" rules={[{ required: true }]}>
              <Input placeholder="e.g. Southeast Asia / Impact" />
            </Form.Item>

            <Form.Item label="Publish Date" name="date" initialValue={dayjs()}>
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item label="Author" name="author" initialValue="Y.O.U Alliance">
              <Input />
            </Form.Item>
          </div>

          <Form.Item label="Cover Photo" name="image">
            <MediaPicker previewUrl={editingItem?.image?.url} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}