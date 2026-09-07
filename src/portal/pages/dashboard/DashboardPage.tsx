import { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Badge, Alert } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  PlusOutlined,
  GlobalOutlined,
  LockOutlined,
  EyeOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '@/api/projects';
import { fetchMembers } from '@/api/members';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { ROUTES } from '@/routes/paths';

export function DashboardPage() {
  const navigate = useNavigate();
  const { isAdmin, isEditor, isReviewer, isViewer, roleName } = useRolePermissions();
  const [projectCount, setProjectCount] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchMembers()])
      .then(([projects, members]) => {
        setProjectCount(projects.length);
        setMemberCount(members.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#005D9A] via-[#125A94] to-[#0B1A2B] p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold m-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Portal Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-blue-100 m-0">
              Welcome to the Y.O.U Management Portal. Your active workspace role is <strong>{roleName}</strong>.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold">
            {isAdmin ? '👑 Super Admin' : isEditor ? '✍️ Content Editor' : isReviewer ? '📋 HR / Reviewer' : '👁️ Viewer / Auditor'}
          </span>
        </div>
      </div>

      {isViewer && (
        <Alert
          type="info"
          showIcon
          icon={<LockOutlined />}
          message="Auditor / Read-Only Workspace"
          description="You are currently signed in with auditor privileges. You can inspect all metrics, candidate assessments, and content in read-only mode."
          className="rounded-2xl"
        />
      )}

      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        {(isAdmin || isEditor || isViewer) && (
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider m-0">Active Projects</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-1 m-0">{projectCount}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#005D9A] text-xl">
                  <ProjectOutlined />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.PROJECTS)} className="!p-0 font-semibold text-[#005D9A]">
                  {isViewer ? 'Inspect Projects ➔' : 'Manage Projects ➔'}
                </Button>
              </div>
            </Card>
          </Col>
        )}

        {(isAdmin || isEditor || isViewer) && (
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider m-0">Member Orgs</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-1 m-0">{memberCount}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-xl">
                  <TeamOutlined />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.MEMBERS)} className="!p-0 font-semibold text-emerald-600">
                  {isViewer ? 'Inspect Members ➔' : 'Manage Members ➔'}
                </Button>
              </div>
            </Card>
          </Col>
        )}

        {(isAdmin || isReviewer || isViewer) && (
          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider m-0">Review Pipeline</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-1 m-0">
                    <Badge count="Active" style={{ backgroundColor: '#EE334E' }} />
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#EE334E] text-xl">
                  <UsergroupAddOutlined />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.ATS_LEADERSHIP)} className="!p-0 font-semibold text-[#EE334E]">
                  {isViewer ? 'Inspect Candidates ➔' : 'Open Candidate ATS ➔'}
                </Button>
              </div>
            </Card>
          </Col>
        )}

        {(isAdmin || isReviewer || isViewer) && (
          <Col xs={24} sm={12} lg={6}>
            <Card className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider m-0">Supporter Postbox</p>
                  <h3 className="text-3xl font-extrabold text-neutral-900 mt-1 m-0">Live</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-xl">
                  <HeartOutlined />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.SUPPORT_LEDGER)} className="!p-0 font-semibold text-amber-600">
                  {isViewer ? 'Inspect Letters ➔' : 'View Letters & Pledges ➔'}
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {/* Role-Specific Quick Actions */}
      <Card title="Workspace Quick Shortcuts" className="rounded-2xl border border-neutral-100 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Admin Shortcuts */}
          {isAdmin && (
            <>
              <Button size="large" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.PORTAL.PROJECTS)} className="h-14 rounded-xl text-left font-semibold">
                Add New Project
              </Button>
              <Button size="large" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.PORTAL.NEWS)} className="h-14 rounded-xl text-left font-semibold">
                Publish News Story
              </Button>
              <Button size="large" icon={<UsergroupAddOutlined />} onClick={() => navigate(ROUTES.PORTAL.ATS_LEADERSHIP)} className="h-14 rounded-xl text-left font-semibold">
                Review Candidates (ATS)
              </Button>
              <Button size="large" icon={<GlobalOutlined />} onClick={() => navigate(ROUTES.PORTAL.SETTINGS)} className="h-14 rounded-xl text-left font-semibold">
                Website Settings
              </Button>
            </>
          )}

          {/* Editor Shortcuts */}
          {isEditor && (
            <>
              <Button size="large" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.PORTAL.PROJECTS)} className="h-14 rounded-xl text-left font-semibold">
                Create Project
              </Button>
              <Button size="large" icon={<PlusOutlined />} onClick={() => navigate(ROUTES.PORTAL.NEWS)} className="h-14 rounded-xl text-left font-semibold">
                Publish News Story
              </Button>
              <Button size="large" icon={<FileTextOutlined />} onClick={() => navigate('/portal/builder/home')} className="h-14 rounded-xl text-left font-semibold">
                Edit Home Page Layout
              </Button>
              <Button size="large" icon={<ProjectOutlined />} onClick={() => navigate(ROUTES.PORTAL.MEMBERS)} className="h-14 rounded-xl text-left font-semibold">
                Add Member Org
              </Button>
            </>
          )}

          {/* HR Reviewer Shortcuts */}
          {isReviewer && (
            <>
              <Button size="large" icon={<UsergroupAddOutlined />} onClick={() => navigate(ROUTES.PORTAL.ATS_LEADERSHIP)} className="h-14 rounded-xl text-left font-semibold">
                Candidate Pipeline
              </Button>
              <Button size="large" icon={<TeamOutlined />} onClick={() => navigate(ROUTES.PORTAL.ATS_ORGANIZATIONS)} className="h-14 rounded-xl text-left font-semibold">
                Vet Member Orgs
              </Button>
              <Button size="large" icon={<HeartOutlined />} onClick={() => navigate(ROUTES.PORTAL.SUPPORT_LEDGER)} className="h-14 rounded-xl text-left font-semibold">
                Export Donor Ledger (CSV)
              </Button>
              <Button size="large" icon={<GlobalOutlined />} onClick={() => navigate(ROUTES.PORTAL.INQUIRIES)} className="h-14 rounded-xl text-left font-semibold">
                Check Inquiries
              </Button>
            </>
          )}

          {/* Viewer / Auditor Shortcuts */}
          {isViewer && (
            <>
              <Button size="large" icon={<EyeOutlined />} onClick={() => navigate(ROUTES.PORTAL.ATS_LEADERSHIP)} className="h-14 rounded-xl text-left font-semibold">
                Inspect Candidates
              </Button>
              <Button size="large" icon={<EyeOutlined />} onClick={() => navigate(ROUTES.PORTAL.PROJECTS)} className="h-14 rounded-xl text-left font-semibold">
                Inspect Projects
              </Button>
              <Button size="large" icon={<EyeOutlined />} onClick={() => navigate(ROUTES.PORTAL.MEMBERS)} className="h-14 rounded-xl text-left font-semibold">
                Inspect Member Orgs
              </Button>
              <Button size="large" icon={<EyeOutlined />} onClick={() => navigate(ROUTES.PORTAL.SUPPORT_LEDGER)} className="h-14 rounded-xl text-left font-semibold">
                Inspect Donor Ledger
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}