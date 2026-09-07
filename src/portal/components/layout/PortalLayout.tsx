import { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  TeamOutlined,
  ReadOutlined,
  FileProtectOutlined,
  QuestionCircleOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  HeartOutlined,
  PictureOutlined,
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LayoutOutlined,
  IdcardOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { ROUTES } from '@/routes/paths';

const { Header, Sider, Content } = Layout;

export function PortalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = usePortalAuth();
  const { isAdmin, isEditor, isReviewer, isViewer, roleName } = useRolePermissions();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Log out',
      content: 'Are you sure you want to end your portal session?',
      okText: 'Log Out',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        logout();
        navigate(ROUTES.PORTAL.LOGIN);
      },
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'role-tag',
      disabled: true,
      label: (
        <div className="px-1 py-1">
          <p className="m-0 text-xs font-semibold uppercase tracking-wider text-neutral-400">Signed in as</p>
          <p className="m-0 text-sm font-bold text-neutral-900">{user?.username || user?.email || 'User'}</p>
          <span className="inline-block mt-1 text-[11px] font-semibold bg-[#EBF4FA] text-[#005D9A] px-2 py-0.5 rounded">
            {roleName}
          </span>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined className="text-red-500" />,
      danger: true,
      label: 'Log Out',
      onClick: handleLogout,
    },
  ];

  const siderMenuItems: MenuProps['items'] = [
    {
      key: ROUTES.PORTAL.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Overview',
      onClick: () => navigate(ROUTES.PORTAL.DASHBOARD),
    },

    // Content Studio: Admins, Editors & Viewers (Read-Only)
    ...(isAdmin || isEditor || isViewer
      ? [
          {
            key: 'content-studio',
            icon: <ReadOutlined />,
            label: isViewer ? 'Content (Inspect)' : 'Content Studio',
            children: [
              {
                key: ROUTES.PORTAL.PROJECTS,
                icon: <ProjectOutlined />,
                label: 'Projects',
                onClick: () => navigate(ROUTES.PORTAL.PROJECTS),
              },
              {
                key: ROUTES.PORTAL.MEMBERS,
                icon: <TeamOutlined />,
                label: 'Member Orgs',
                onClick: () => navigate(ROUTES.PORTAL.MEMBERS),
              },
              {
                key: ROUTES.PORTAL.NEWS,
                icon: <ReadOutlined />,
                label: 'News & Stories',
                onClick: () => navigate(ROUTES.PORTAL.NEWS),
              },
              {
                key: ROUTES.PORTAL.LEADERSHIP,
                icon: <UserOutlined />,
                label: 'Leadership Roster',
                onClick: () => navigate(ROUTES.PORTAL.LEADERSHIP),
              },
              {
                key: ROUTES.PORTAL.DOCUMENTS,
                icon: <FileProtectOutlined />,
                label: 'Policy Documents',
                onClick: () => navigate(ROUTES.PORTAL.DOCUMENTS),
              },
              {
                key: ROUTES.PORTAL.FAQS,
                icon: <QuestionCircleOutlined />,
                label: 'FAQs',
                onClick: () => navigate(ROUTES.PORTAL.FAQS),
              },
            ],
          },
          {
            key: 'page-builder',
            icon: <LayoutOutlined />,
            label: isViewer ? 'Page Layouts (Inspect)' : 'Page Builder',
            children: [
              {
                key: '/portal/builder/home',
                label: 'Home Page',
                onClick: () => navigate('/portal/builder/home'),
              },
              {
                key: '/portal/builder/about-us',
                label: 'About Us',
                onClick: () => navigate('/portal/builder/about-us'),
              },
            ],
          },
        ]
      : []),

    // Review Hub (ATS): Admins, HR Reviewers & Viewers (Inspect)
    ...(isAdmin || isReviewer || isViewer
      ? [
          {
            key: 'ats-pipeline',
            icon: <UsergroupAddOutlined />,
            label: isViewer ? 'Applications (Inspect)' : 'Review Hub (ATS)',
            children: [
              {
                key: ROUTES.PORTAL.ATS_LEADERSHIP,
                icon: <IdcardOutlined />,
                label: 'Leadership Candidates',
                onClick: () => navigate(ROUTES.PORTAL.ATS_LEADERSHIP),
              },
              {
                key: ROUTES.PORTAL.ATS_ORGANIZATIONS,
                icon: <BankOutlined />,
                label: 'Organization Apps',
                onClick: () => navigate(ROUTES.PORTAL.ATS_ORGANIZATIONS),
              },
              {
                key: ROUTES.PORTAL.INQUIRIES,
                icon: <MessageOutlined />,
                label: 'Inquiries',
                onClick: () => navigate(ROUTES.PORTAL.INQUIRIES),
              },
              {
                key: ROUTES.PORTAL.SUPPORT_LEDGER,
                icon: <HeartOutlined />,
                label: 'Support Postbox',
                onClick: () => navigate(ROUTES.PORTAL.SUPPORT_LEDGER),
              },
            ],
          },
        ]
      : []),

    // Media Studio: Admins, Editors & Viewers (Inspect)
    ...(isAdmin || isEditor || isViewer
      ? [
          {
            key: ROUTES.PORTAL.MEDIA,
            icon: <PictureOutlined />,
            label: isViewer ? 'Media (Inspect)' : 'Media Studio',
            onClick: () => navigate(ROUTES.PORTAL.MEDIA),
          },
        ]
      : []),

    // Settings & Staff Accounts: Super Admins Only
    ...(isAdmin
      ? [
          {
            key: 'settings-group',
            icon: <SettingOutlined />,
            label: 'Settings',
            children: [
              {
                key: ROUTES.PORTAL.SETTINGS,
                label: 'General Website Settings',
                onClick: () => navigate(ROUTES.PORTAL.SETTINGS),
              },
              {
                key: '/portal/settings/users',
                label: 'Staff Accounts',
                onClick: () => navigate('/portal/settings/users'),
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        theme="light"
        className="border-r border-neutral-200 shadow-sm"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-neutral-100">
          {!collapsed && (
            <Link to={ROUTES.PORTAL.DASHBOARD} className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-[#005D9A]">Y.O.U</span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Portal</span>
            </Link>
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-neutral-600 cursor-pointer"
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['content-studio', 'ats-pipeline', 'settings-group']}
          items={siderMenuItems}
          className="border-r-0 pt-2"
        />
      </Sider>

      <Layout>
        <Header className="flex h-16 items-center justify-between bg-white px-6 border-b border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-neutral-600">
              Welcome back, <strong className="text-neutral-900">{user?.username || user?.email || 'User'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 hover:border-[#005D9A] hover:text-[#005D9A] transition"
            >
              <GlobalOutlined /> View Live Website ↗
            </a>

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition">
                <Avatar style={{ backgroundColor: '#005D9A' }}>
                  {(user?.username?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                </Avatar>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 min-h-[calc(100vh-112px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}