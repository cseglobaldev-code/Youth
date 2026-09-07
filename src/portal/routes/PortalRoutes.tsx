import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { PortalAuthProvider } from '../context/PortalAuthContext';
import { PortalAuthGuard } from '../components/auth/PortalAuthGuard';
import { PortalLayout } from '../components/layout/PortalLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Content Studios
import { ProjectsManagerPage } from '../pages/content/ProjectsManagerPage';
import { MembersManagerPage } from '../pages/content/MembersManagerPage';
import { NewsManagerPage } from '../pages/content/NewsManagerPage';
import { FaqManagerPage } from '../pages/content/FaqManagerPage';
import { LeadershipManagerPage } from '../pages/content/LeadershipManagerPage';
import { DocumentsManagerPage } from '../pages/content/DocumentsManagerPage';

// Visual Page Builder
import { PageEditorPage } from '../pages/builder/PageEditorPage';

// Application Review Hub (ATS)
import { LeadershipAtsPage } from '../pages/applications/LeadershipAtsPage';
import { OrganizationReviewPage } from '../pages/applications/OrganizationReviewPage';
import { InquiriesInboxPage } from '../pages/applications/InquiriesInboxPage';
import { SupportLedgerPage } from '../pages/applications/SupportLedgerPage';

// Media & Settings
import { MediaStudioPage } from '../pages/media/MediaStudioPage';
import { GeneralSettingsPage } from '../pages/settings/GeneralSettingsPage';
import { StaffUsersPage } from '../pages/settings/StaffUsersPage';
import { ROUTES } from '@/routes/paths';

export function PortalRoutes() {
  return (
    <PortalAuthProvider>
      <Routes>
        {/* Public Login Route */}
        <Route path="login" element={<LoginPage />} />

        {/* Protected Base Management Shell */}
        <Route
          element={
            <PortalAuthGuard>
              <PortalLayout />
            </PortalAuthGuard>
          }
        >
          {/* Default redirect to Dashboard */}
          <Route index element={<Navigate to={ROUTES.PORTAL.DASHBOARD} replace />} />
          
          {/* 1. Universal Overview (Accessible to all authenticated staff) */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* 2. Content Studio & Page Builder (Super Admin, Content Editor & Viewer/Auditor) */}
          <Route element={<PortalAuthGuard allowedRoles={['admin', 'editor', 'viewer']}><Outlet /></PortalAuthGuard>}>
            <Route path="projects" element={<ProjectsManagerPage />} />
            <Route path="members" element={<MembersManagerPage />} />
            <Route path="news" element={<NewsManagerPage />} />
            <Route path="leadership" element={<LeadershipManagerPage />} />
            <Route path="documents" element={<DocumentsManagerPage />} />
            <Route path="faqs" element={<FaqManagerPage />} />
            <Route path="media" element={<MediaStudioPage />} />
            <Route path="builder/home" element={<PageEditorPage pageType="home" previewUrl="/" />} />
            <Route path="builder/about-us" element={<PageEditorPage pageType="about-us" previewUrl="/about-us" />} />
          </Route>

          {/* 3. Review Hub / ATS (Super Admin, HR / Reviewer & Viewer/Auditor) */}
          <Route element={<PortalAuthGuard allowedRoles={['admin', 'reviewer', 'viewer']}><Outlet /></PortalAuthGuard>}>
            <Route path="applications/leadership" element={<LeadershipAtsPage />} />
            <Route path="applications/organizations" element={<OrganizationReviewPage />} />
            <Route path="inquiries" element={<InquiriesInboxPage />} />
            <Route path="support" element={<SupportLedgerPage />} />
          </Route>

          {/* 4. Settings & Staff Management (Super Admin ONLY) */}
          <Route element={<PortalAuthGuard allowedRoles={['admin']}><Outlet /></PortalAuthGuard>}>
            <Route path="settings" element={<GeneralSettingsPage />} />
            <Route path="settings/users" element={<StaffUsersPage />} />
          </Route>
        </Route>

        {/* Absolute Catch-All Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.PORTAL.DASHBOARD} replace />} />
      </Routes>
    </PortalAuthProvider>
  );
}