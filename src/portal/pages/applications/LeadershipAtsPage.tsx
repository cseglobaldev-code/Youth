import { useEffect, useState, useCallback } from 'react';
import {
  Tag,
  Button,
  Drawer,
  Select,
  Input,
  Descriptions,
  Tabs,
  Segmented,
  Badge,
  Card,
  message,
  Space,
  Avatar,
  Empty,
  Tooltip,
} from 'antd';
import {
  WhatsAppOutlined,
  MailOutlined,
  EyeOutlined,
  FilePdfOutlined,
  SaveOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { fetchCollection, updateEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

const PIPELINE_STATUSES: { key: string; label: string; color: string }[] = [
  { key: 'pending', label: 'Pending', color: 'default' },
  { key: 'under_review', label: 'Under Review', color: 'processing' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'warning' },
  { key: 'accepted', label: 'Accepted', color: 'success' },
  { key: 'rejected', label: 'Rejected', color: 'error' },
];

const ASSESSMENT_LABELS: Record<string, string> = {
  q1: 'Q1. Personality & Working Style (Behavioral)',
  q2: 'Q2. Strategic Vision & Commitments',
  q3: 'Q3. Leadership Skills & Operations (Cognitive)',
  q4: 'Q4. Leadership Skills & Operations (Scenario)',
  q5: 'Q5. Ethical & Moral Dilemmas (Cognitive)',
  q6: 'Q6. Ethical & Moral Dilemmas (Scenario)',
  q7: 'Q7. International Affairs & Political Awareness',
  q8: 'Q8. Crisis Management in Political Landscape',
  q9: 'Q9. Country Adaptation & 1-2 Year Forecast',
};

export function LeadershipAtsPage() {
  const { token } = usePortalAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  // Candidate Profile Drawer state
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCollection(
        'leadership-applications',
        {
          pageSize: 100,
          sort: 'createdAt:desc',
          populate: ['profilePhoto', 'resumeCv', 'activityPhotos'],
        },
        token
      );
      setData(res.data);
    } catch (err: any) {
      message.error(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCandidate = (candidate: any) => {
    setSelectedCandidate(candidate);
    setAdminNotes(candidate.adminNotes || '');
    setDrawerOpen(true);
  };

  const handleUpdateStatus = async (id: string | number, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await updateEntry(
        'leadership-applications',
        id,
        {
          status: newStatus,
          reviewedAt: new Date().toISOString(),
        },
        token
      );

      setData((prev) =>
        prev.map((item) =>
          (item.documentId || item.id) === id
            ? { ...item, status: newStatus, reviewedAt: new Date().toISOString() }
            : item
        )
      );

      if (selectedCandidate && (selectedCandidate.documentId || selectedCandidate.id) === id) {
        setSelectedCandidate((prev: any) => ({ ...prev, status: newStatus }));
      }

      message.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      message.error(err.message || 'Status update failed');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCandidate) return;
    try {
      setSavingNotes(true);
      const id = selectedCandidate.documentId || selectedCandidate.id;
      await updateEntry(
        'leadership-applications',
        id,
        {
          adminNotes,
          reviewedAt: new Date().toISOString(),
        },
        token
      );

      setSelectedCandidate((prev: any) => ({ ...prev, adminNotes }));
      setData((prev) =>
        prev.map((item) =>
          (item.documentId || item.id) === id ? { ...item, adminNotes } : item
        )
      );

      message.success('Staff review notes saved');
    } catch (err: any) {
      message.error(err.message || 'Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const tableColumns: TableColumnsType<any> = [
    {
      title: 'Candidate',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: any) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleOpenCandidate(record)}>
          <Avatar src={record.profilePhoto?.url} style={{ backgroundColor: '#005D9A' }}>
            {name?.[0]}
          </Avatar>
          <div>
            <span className="font-semibold text-neutral-900 block">{name}</span>
            <span className="text-xs text-neutral-500">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Region',
      key: 'region',
      render: (_: any, r: any) => (
        <div>
          <span className="font-medium text-neutral-800 block">{r.continent}</span>
          <span className="text-xs text-neutral-500">{r.region}</span>
        </div>
      ),
    },
    {
      title: 'Country of Residence',
      dataIndex: 'countryOfResidence',
      key: 'country',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: any) => {
        const conf = PIPELINE_STATUSES.find((s) => s.key === status) || PIPELINE_STATUSES[0];
        return (
          <Select
            size="small"
            value={status || 'pending'}
            onChange={(val) => handleUpdateStatus(record.documentId || record.id, val)}
            className="w-32"
            options={PIPELINE_STATUSES.map((s) => ({
              value: s.key,
              label: <Tag color={s.color}>{s.label}</Tag>,
            }))}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleOpenCandidate(record)}
          className="rounded-lg"
        >
          Review
        </Button>
      ),
    },
  ];

  const resumeFile = Array.isArray(selectedCandidate?.resumeCv)
    ? selectedCandidate?.resumeCv[0]
    : selectedCandidate?.resumeCv;

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 m-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Leadership Recruitment ATS
          </h1>
          <p className="text-xs text-neutral-500 mt-1 m-0">
            Review and advance Continental Director & Leadership role candidates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Segmented
            value={viewMode}
            onChange={(val) => setViewMode(val as 'kanban' | 'table')}
            options={[
              { value: 'kanban', label: 'Pipeline Board' },
              { value: 'table', label: 'Candidate Table' },
            ]}
          />
          <Button onClick={loadData}>Refresh</Button>
        </div>
      </div>

      {/* View 1: Visual Kanban Pipeline */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {PIPELINE_STATUSES.map((statusObj) => {
            const columnCandidates = data.filter(
              (c) => (c.status || 'pending') === statusObj.key
            );

            return (
              <div
                key={statusObj.key}
                className="flex-1 min-w-[280px] max-w-[320px] rounded-2xl bg-[#F8FAFC] border border-neutral-200 p-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-2 mb-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-neutral-800">{statusObj.label}</span>
                    <Badge count={columnCandidates.length} style={{ backgroundColor: '#005D9A' }} />
                  </div>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-3 min-h-[400px]">
                  {columnCandidates.length === 0 ? (
                    <div className="text-center py-10 text-xs text-neutral-400">No candidates</div>
                  ) : (
                    columnCandidates.map((candidate) => (
                      <Card
                        key={candidate.documentId || candidate.id}
                        hoverable
                        onClick={() => handleOpenCandidate(candidate)}
                        className="rounded-xl border border-neutral-200 shadow-sm cursor-pointer p-0 hover:border-[#005D9A] transition"
                        styles={{ body: { padding: '14px' } }}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar
                            src={candidate.profilePhoto?.url}
                            size={40}
                            style={{ backgroundColor: '#005D9A' }}
                          >
                            {candidate.fullName?.[0]}
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-sm text-neutral-900 truncate m-0">
                              {candidate.fullName}
                            </h4>
                            <p className="text-xs text-neutral-500 m-0 mt-0.5 truncate">
                              {candidate.continent} · {candidate.region}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                          <span>{candidate.countryOfResidence}</span>
                          <span className="text-[#005D9A] font-semibold">Inspect ➔</span>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Data Table */}
      {viewMode === 'table' && (
        <PortalDataTable
          title="Candidate Applications"
          columns={tableColumns}
          dataSource={data}
          loading={loading}
          total={data.length}
          onRefresh={loadData}
        />
      )}

      {/* Candidate Details Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width="min(860px, 92vw)"
        destroyOnHidden
        title={
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <Avatar
                src={selectedCandidate?.profilePhoto?.url}
                size={48}
                style={{ backgroundColor: '#005D9A' }}
              >
                {selectedCandidate?.fullName?.[0]}
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 m-0">
                  {selectedCandidate?.fullName}
                </h3>
                <span className="text-xs text-neutral-500">
                  Applied for Continental Director ({selectedCandidate?.continent} — {selectedCandidate?.region})
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Select
                value={selectedCandidate?.status || 'pending'}
                onChange={(val) =>
                  handleUpdateStatus(selectedCandidate.documentId || selectedCandidate.id, val)
                }
                loading={updatingStatus}
                style={{ width: 140 }}
                options={PIPELINE_STATUSES.map((s) => ({
                  value: s.key,
                  label: <Tag color={s.color}>{s.label}</Tag>,
                }))}
              />
            </div>
          </div>
        }
      >
        {selectedCandidate && (
          <div className="space-y-6">
            {/* Contact Strip */}
            <div className="flex flex-wrap gap-4 rounded-xl bg-neutral-50 p-4 border border-neutral-200 text-sm">
              <div className="flex items-center gap-2 text-neutral-700">
                <MailOutlined className="text-[#005D9A]" />
                <a href={`mailto:${selectedCandidate.email}`} className="text-[#005D9A] hover:underline font-medium">
                  {selectedCandidate.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <WhatsAppOutlined className="text-emerald-600" />
                <a
                  href={`https://wa.me/${selectedCandidate.whatsappNumber?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline font-medium"
                >
                  WhatsApp: {selectedCandidate.whatsappNumber}
                </a>
              </div>
            </div>

            {/* General Profile */}
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3 }}>
              <Descriptions.Item label="Sex">{selectedCandidate.sex}</Descriptions.Item>
              <Descriptions.Item label="Date of Birth">{selectedCandidate.dateOfBirth}</Descriptions.Item>
              <Descriptions.Item label="Nationality">{selectedCandidate.nationality}</Descriptions.Item>
              <Descriptions.Item label="Residence">{selectedCandidate.countryOfResidence}</Descriptions.Item>
              <Descriptions.Item label="City/Town">{selectedCandidate.cityTown}</Descriptions.Item>
              <Descriptions.Item label="Continent">{selectedCandidate.continent}</Descriptions.Item>
            </Descriptions>

            {/* Internal Staff Notes */}
            <Card size="small" title="Internal Reviewer Notes & Score" className="rounded-xl border-amber-200 bg-amber-50/40">
              <Input.TextArea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Write interview notes, candidate rating, or committee feedback here..."
                className="rounded-lg mb-2"
              />
              <div className="flex justify-between items-center text-xs text-neutral-400">
                <span>Last reviewed: {selectedCandidate.reviewedAt ? new Date(selectedCandidate.reviewedAt).toLocaleString() : 'Not reviewed yet'}</span>
                <Button
                  size="small"
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveNotes}
                  loading={savingNotes}
                  className="!bg-[#005D9A]"
                >
                  Save Notes
                </Button>
              </div>
            </Card>

            {/* Tabs: Assessment Answers & Resume/CV */}
            <Tabs
              defaultActiveKey="assessment"
              items={[
                {
                  key: 'assessment',
                  label: 'Assessment Questions (9/9)',
                  children: (
                    <div className="space-y-4 pt-2">
                      {Object.entries(ASSESSMENT_LABELS).map(([qKey, label]) => {
                        const answer = selectedCandidate.assessment?.[qKey];

                        return (
                          <div key={qKey} className="rounded-xl border border-neutral-200 p-4 bg-white">
                            <h5 className="font-semibold text-sm text-neutral-900 mb-2">{label}</h5>
                            <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed m-0 bg-neutral-50 p-3 rounded-lg">
                              {answer || <span className="italic text-neutral-400">No answer provided</span>}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ),
                },
                {
                  key: 'resume',
                  label: 'Resume / CV Document',
                  children: (
                    <div className="pt-2">
                      {resumeFile?.url ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-xl">
                            <span className="text-sm font-semibold flex items-center gap-2">
                              <FilePdfOutlined className="text-red-500 text-lg" />
                              {resumeFile.name || 'Candidate_Resume.pdf'}
                            </span>
                            <Button
                              type="link"
                              href={resumeFile.url}
                              target="_blank"
                              icon={<DownloadOutlined />}
                            >
                              Download File
                            </Button>
                          </div>
                          {/* Embedded In-Browser Viewer */}
                          <div className="w-full h-[600px] border border-neutral-300 rounded-2xl overflow-hidden bg-neutral-100">
                            <iframe
                              src={resumeFile.url}
                              title="Resume Viewer"
                              className="w-full h-full border-0"
                            />
                          </div>
                        </div>
                      ) : (
                        <Empty description="No resume uploaded" />
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}