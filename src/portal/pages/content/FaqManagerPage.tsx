import { useEffect, useState, useCallback } from 'react';
import { Button, Modal, Form, Input, Popconfirm, message, Space } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { fetchCollection, createEntry, updateEntry, deleteEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';

export function FaqManagerPage() {
  const { token } = usePortalAuth();
  const { canManageContent, isReadOnly } = useRolePermissions();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection(
        'faqs',
        {
          pageSize: 100,
          sort: 'displayOrder:asc',
        },
        token
      );
      setFaqs(res.data || []);
    } catch (err: any) {
      message.error(err.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (isReadOnly || !canManageContent) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const next = [...faqs];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setFaqs(next);
  };

  const handleSaveOrder = async () => {
    if (isReadOnly || !canManageContent) return;
    try {
      setSavingOrder(true);
      await Promise.all(
        faqs.map((faq, index) => {
          const id = faq.documentId || faq.id;
          return updateEntry('faqs', id, { displayOrder: index + 1 }, token);
        })
      );
      message.success('FAQ display order saved successfully');
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    form.setFieldsValue({
      question: item.question,
      answer: item.answer,
      displayOrder: item.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item: any) => {
    if (isReadOnly || !canManageContent) return;
    try {
      const id = item.documentId || item.id;
      await deleteEntry('faqs', id, token);
      message.success('FAQ deleted');
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Failed to delete FAQ');
    }
  };

  const handleFormFinish = async (values: any) => {
    try {
      setSubmitting(true);
      if (editingItem) {
        const id = editingItem.documentId || editingItem.id;
        await updateEntry('faqs', id, values, token);
        message.success('FAQ updated');
      } else {
        await createEntry('faqs', { ...values, displayOrder: faqs.length + 1 }, token);
        message.success('FAQ created');
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
      title: 'Order',
      key: 'order',
      width: 120,
      render: (_: any, __: any, index: number) => (
        <Space>
          <span className="font-bold text-neutral-400 w-6">#{index + 1}</span>
          {!isReadOnly && canManageContent && (
            <>
              <Button
                size="small"
                icon={<ArrowUpOutlined />}
                disabled={index === 0}
                onClick={() => handleMove(index, 'up')}
              />
              <Button
                size="small"
                icon={<ArrowDownOutlined />}
                disabled={index === faqs.length - 1}
                onClick={() => handleMove(index, 'down')}
              />
            </>
          )}
        </Space>
      ),
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (q: string, r: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => handleOpenEdit(r)}>
          {q}
        </span>
      ),
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
            disabled={isReadOnly || !canManageContent}
          />
          {!isReadOnly && canManageContent && (
            <Popconfirm title="Delete FAQ?" onConfirm={() => handleDelete(record)}>
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
        title="Frequently Asked Questions (FAQs)"
        columns={columns}
        dataSource={faqs}
        loading={loading}
        total={faqs.length}
        onAddNew={canManageContent ? handleOpenCreate : undefined}
        onRefresh={loadData}
        extraActions={
          !isReadOnly && canManageContent ? (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={savingOrder}
              onClick={handleSaveOrder}
              className="rounded-xl !bg-emerald-600 font-semibold"
            >
              Save Reordered Priority
            </Button>
          ) : undefined
        }
      />

      <Modal
        title={editingItem ? 'Edit FAQ' : 'Create New FAQ'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item label="Question" name="question" rules={[{ required: true }]}>
            <Input placeholder="e.g. What is the mission of Y.O.U?" disabled={isReadOnly} />
          </Form.Item>
          <Form.Item label="Answer" name="answer" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Answer text..." disabled={isReadOnly} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}