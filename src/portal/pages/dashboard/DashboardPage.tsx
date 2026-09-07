import { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Tag, Badge } from 'antd';
import {
  ProjectOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  HeartOutlined,
  PlusOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '@/api/projects';
import { fetchMembers } from '@/api/members';
import { ROUTES } from '@/routes/paths';

export function DashboardPage() {
  const navigate = useNavigate();
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
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          Portal Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base text-blue-100">
          Welcome to the unified management workspace. Oversee member organizations, review incoming leadership candidates, update live SDG projects, and monitor global impact.
        </p>
      </div>

      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Active Projects</p>
                <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{projectCount}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#005D9A] text-xl">
                <ProjectOutlined />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.PROJECTS)} className="!p-0 font-semibold text-[#005D9A]">
                Manage Projects →
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Member Organizations</p>
                <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{memberCount}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-xl">
                <TeamOutlined />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.MEMBERS)} className="!p-0 font-semibold text-emerald-600">
                Manage Members →
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Review Pipeline</p>
                <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">
                  <Badge count="Active" style={{ backgroundColor: '#EE334E' }} />
                </h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#EE334E] text-xl">
                <UsergroupAddOutlined />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.ATS_LEADERSHIP)} className="!p-0 font-semibold text-[#EE334E]">
                Open Candidate ATS →
              </Button>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="rounded-2xl border border-neutral-100 shadow-sm hover:shadow transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Supporter Postbox</p>
                <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">Live</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-xl">
                <HeartOutlined />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <Button type="link" size="small" onClick={() => navigate(ROUTES.PORTAL.SUPPORT_LEDGER)} className="!p-0 font-semibold text-amber-600">
                View Letters & Pledges →
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Quick Actions" className="lg:col-span-2 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.PORTAL.PROJECTS)}
              className="h-14 rounded-xl text-left font-semibold"
            >
              Add New Project
            </Button>
            <Button
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.PORTAL.NEWS)}
              className="h-14 rounded-xl text-left font-semibold"
            >
              Publish News Article
            </Button>
            <Button
              size="large"
              icon={<UsergroupAddOutlined />}
              onClick={() => navigate(ROUTES.PORTAL.ATS_LEADERSHIP)}
              className="h-14 rounded-xl text-left font-semibold"
            >
              Review Leadership Candidates
            </Button>
            <Button
              size="large"
              icon={<GlobalOutlined />}
              onClick={() => navigate(ROUTES.PORTAL.SETTINGS)}
              className="h-14 rounded-xl text-left font-semibold"
            >
              Update Website Settings
            </Button>
          </div>
        </Card>

        <Card title="System Readiness" className="rounded-2xl border border-neutral-100 shadow-sm">
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span>Strapi v5 Core API</span>
              <Tag color="success">Connected</Tag>
            </div>
            <div className="flex items-center justify-between">
              <span>Cloudflare Worker Proxy</span>
              <Tag color="success">Active</Tag>
            </div>
            <div className="flex items-center justify-between">
              <span>Cloudinary Media Engine</span>
              <Tag color="processing">Ready</Tag>
            </div>
            <div className="flex items-center justify-between">
              <span>SMTP Notifications</span>
              <Tag color="default">Configured</Tag>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}