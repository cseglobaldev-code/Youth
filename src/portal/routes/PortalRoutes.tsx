import { Routes, Route, Navigate } from 'react-router-dom';
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

export function PortalRoutes() {
  return (
    <PortalAuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />

        <Route
          element={
            <PortalAuthGuard>
              <PortalLayout />
            </PortalAuthGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Content Studios */}
          <Route path="projects" element={<ProjectsManagerPage />} />
          <Route path="members" element={<MembersManagerPage />} />
          <Route path="news" element={<NewsManagerPage />} />
          <Route path="leadership" element={<LeadershipManagerPage />} />
          <Route path="documents" element={<DocumentsManagerPage />} />
          <Route path="faqs" element={<FaqManagerPage />} />

          {/* Visual Page Builders */}
          <Route
            path="builder/home"
            element={<PageEditorPage pageType="home" previewUrl="/" />}
          />
          <Route
            path="builder/about-us"
            element={<PageEditorPage pageType="about-us" previewUrl="/about-us" />}
          />

          {/* Application Review Hub (ATS) */}
          <Route path="applications/leadership" element={<LeadershipAtsPage />} />
          <Route path="applications/organizations" element={<OrganizationReviewPage />} />
          <Route path="inquiries" element={<InquiriesInboxPage />} />
          <Route path="support" element={<SupportLedgerPage />} />

          {/* Media & Settings */}
          <Route path="media" element={<MediaStudioPage />} />
          <Route path="settings" element={<GeneralSettingsPage />} />
          <Route path="settings/users" element={<StaffUsersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </PortalAuthProvider>
  );
}