import { useEffect, useState, useCallback } from 'react';
import { Tag, Button, Drawer, Select, message, Descriptions } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { fetchCollection, updateEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';

export function InquiriesInboxPage() {
  const { token } = usePortalAuth();
  const { canManageAts, isReadOnly } = useRolePermissions();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection('inquiries', { pageSize: 100, sort: 'createdAt:desc' }, token);
      setData(res.data);
    } catch (err: any) {
      message.error(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpen = (item: any) => {
    setSelectedInquiry(item);
    setDrawerOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedInquiry) return;
    try {
      const id = selectedInquiry.documentId || selectedInquiry.id;
      await updateEntry('inquiries', id, { status: newStatus }, token);
      setSelectedInquiry((prev: any) => ({ ...prev, status: newStatus }));
      setData((prev) =>
        prev.map((item) => ((item.documentId || item.id) === id ? { ...item, status: newStatus } : item))
      );
      message.success('Status updated');
    } catch (err: any) {
      message.error('Update failed');
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Sender Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => handleOpen(record)}>
          {name}
        </span>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => <Tag color="blue">{reason}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'resolved' ? 'success' : status === 'in_progress' ? 'processing' : 'default';
        return <Tag color={color}>{status?.toUpperCase() || 'UNREAD'}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : '—'),
    },
  ];

  return (
    <div>
      <PortalDataTable
        title="Contact Messages & Inquiries"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={data.length}
        onRefresh={loadData}
      />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} width={600} title="Inquiry Details">
    {selectedInquiry && (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Status:</span>
          {isReadOnly || !canManageAts ? (
            <Tag color={selectedInquiry.status === 'resolved' ? 'success' : selectedInquiry.status === 'in_progress' ? 'processing' : 'default'}>
              {selectedInquiry.status?.toUpperCase() || 'UNREAD'}
            </Tag>
          ) : (
            <Select
              value={selectedInquiry.status || 'unread'}
              onChange={handleStatusChange}
              style={{ width: 140 }}
              options={[
                { value: 'unread', label: 'Unread' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
              ]}
            />
          )}
        </div>

            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Sender">{selectedInquiry.name}</Descriptions.Item>
              <Descriptions.Item label="Email">
                <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedInquiry.phone || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Reason">{selectedInquiry.reason}</Descriptions.Item>
            </Descriptions>

            <div>
              <h4 className="font-semibold text-sm mb-2">Message:</h4>
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-sm leading-relaxed whitespace-pre-line">
                {selectedInquiry.message}
              </div>
            </div>

            <Button
              type="primary"
              icon={<MailOutlined />}
              href={`mailto:${selectedInquiry.email}?subject=Re: Your inquiry regarding ${selectedInquiry.reason}`}
              className="!bg-[#005D9A]"
              block
            >
              Reply via Email
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}