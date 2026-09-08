import { useEffect, useState, useCallback } from 'react';
import {
  Tag,
  Button,
  Drawer,
  Select,
  Input,
  Descriptions,
  message,
  Card,
} from 'antd';
import { EyeOutlined, SaveOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { fetchCollection, updateEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { SDGTag } from '@/components/ui/SDGTag';
import { useRolePermissions } from '../../hooks/useRolePermissions';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'default' },
  under_review: { label: 'Under Review', color: 'processing' },
  shortlisted: { label: 'Shortlisted', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

export function OrganizationReviewPage() {
  const { token } = usePortalAuth();
  const { canManageAts, isReadOnly } = useRolePermissions();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection(
        'organization-applications',
        {
          pageSize: 100,
          sort: 'createdAt:desc',
          populate: ['organizationLogo', 'organizationImage', 'projectImages'],
        },
        token
      );
      setData(res.data);
    } catch (err: any) {
      message.error(err.message || 'Failed to load organization applications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenReview = (org: any) => {
    setSelectedOrg(org);
    setAdminNotes(org.adminNotes || '');
    setDrawerOpen(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrg) return;
    try {
      const id = selectedOrg.documentId || selectedOrg.id;
      await updateEntry('organization-applications', id, { status: newStatus }, token);
      setSelectedOrg((prev: any) => ({ ...prev, status: newStatus }));
      setData((prev) =>
        prev.map((item) => ((item.documentId || item.id) === id ? { ...item, status: newStatus } : item))
      );
      message.success('Status updated');
    } catch (err: any) {
      message.error(err.message || 'Update failed');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedOrg) return;
    try {
      setSavingNotes(true);
      const id = selectedOrg.documentId || selectedOrg.id;
      await updateEntry('organization-applications', id, { adminNotes }, token);
      setSelectedOrg((prev: any) => ({ ...prev, adminNotes }));
      setData((prev) =>
        prev.map((item) => ((item.documentId || item.id) === id ? { ...item, adminNotes } : item))
      );
      message.success('Staff notes saved');
    } catch (err: any) {
      message.error(err.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Organization',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (name: string, record: any) => (
        <span className="font-semibold text-neutral-900 cursor-pointer" onClick={() => handleOpenReview(record)}>
          {name}
        </span>
      ),
    },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    { title: 'Representative', dataIndex: 'representativeFullName', key: 'rep' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const conf = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        return <Tag color={conf.color}>{conf.label}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => handleOpenReview(record)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PortalDataTable
        title="Member Organization Applications"
        columns={columns}
        dataSource={data}
        loading={loading}
        total={data.length}
        onRefresh={loadData}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width="min(800px, 92vw)"
        destroyOnHidden
        title={
            <div className="flex items-center justify-between pr-8">
                <h3 className="text-lg font-bold text-neutral-900 m-0">
                {selectedOrg?.organizationName}
                </h3>
                {isReadOnly || !canManageAts ? (
                <Tag color={STATUS_CONFIG[selectedOrg?.status || 'pending']?.color}>
                    {STATUS_CONFIG[selectedOrg?.status || 'pending']?.label}
                </Tag>
                ) : (
                <Select
                    value={selectedOrg?.status || 'pending'}
                    onChange={handleStatusChange}
                    style={{ width: 140 }}
                    options={Object.entries(STATUS_CONFIG).map(([val, conf]) => ({
                    value: val,
                    label: <Tag color={conf.color}>{conf.label}</Tag>,
                    }))}
                />
                )}
            </div>
        }
        >
            {selectedOrg && (
            <div className="space-y-6">
                <Card size="small" title="Committee Review Notes" className="rounded-xl border-amber-200 bg-amber-50/40">
                <Input.TextArea
                    rows={2}
                    value={adminNotes}
                    disabled={isReadOnly || !canManageAts}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add committee vetting notes or screening decisions..."
                    className="rounded-lg mb-2"
                />
                {!isReadOnly && canManageAts && (
                    <Button size="small" type="primary" icon={<SaveOutlined />} onClick={handleSaveNotes} loading={savingNotes} className="!bg-[#005D9A]">
                    Save Notes
                    </Button>
                )}
            </Card>

            {/* Organization Overview */}
            <Descriptions title="Organization Details" bordered size="small" column={2}>
              <Descriptions.Item label="Representative">{selectedOrg.representativeFullName}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrg.representativePhoneCode} {selectedOrg.representativePhone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrg.email}</Descriptions.Item>
              <Descriptions.Item label="Est. Year">{selectedOrg.yearOfEstablishment}</Descriptions.Item>
              <Descriptions.Item label="Country">{selectedOrg.country}</Descriptions.Item>
              <Descriptions.Item label="Address">{selectedOrg.address}</Descriptions.Item>
              <Descriptions.Item label="Focus Area" span={2}>{selectedOrg.focusArea}</Descriptions.Item>
              <Descriptions.Item label="Website" span={2}>
                {selectedOrg.website ? <a href={selectedOrg.website} target="_blank" rel="noreferrer">{selectedOrg.website}</a> : '—'}
              </Descriptions.Item>
            </Descriptions>

            {/* Project Details */}
            <Descriptions title="Featured Project" bordered size="small" column={2}>
              <Descriptions.Item label="Project Name" span={2}>{selectedOrg.projectName}</Descriptions.Item>
              <Descriptions.Item label="Led By">{selectedOrg.projectLedBy}</Descriptions.Item>
              <Descriptions.Item label="Region">{selectedOrg.region}</Descriptions.Item>
              <Descriptions.Item label="Countries Covered" span={2}>{selectedOrg.countriesCovered}</Descriptions.Item>
              <Descriptions.Item label="Social Impact" span={2}>{selectedOrg.socialImpactMetrics}</Descriptions.Item>
              <Descriptions.Item label="Project Description" span={2}>{selectedOrg.projectDescription}</Descriptions.Item>
            </Descriptions>

            {/* Focus SDGs */}
            {Array.isArray(selectedOrg.focusSdgs) && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Focus SDGs</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOrg.focusSdgs.map((sdg: any) => (
                    <SDGTag key={sdg} sdgId={Number(sdg)} variant="solid" size="md" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}