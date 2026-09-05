import { Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { LeadershipPage } from '@/pages/LeadershipPage';
import { MembersPage } from '@/pages/MembersPage';
import { MemberDetailPage } from '@/pages/MemberDetailPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { NewsPage } from '@/pages/NewsPage/NewsPage';
import { NewsDetailPage } from '@/pages/NewsDetailPage/NewsDetailPage';
import { PolicyDocumentsPage } from '@/pages/PolicyDocumentsPage';
import { ContactPage } from '@/pages/ContactPage';
import { DynamicPage } from '@/pages/DynamicPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about-us" element={<AboutPage />} />
        <Route path="leadership" element={<LeadershipPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/:memberId" element={<MemberDetailPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:newsId" element={<NewsDetailPage />} />
        <Route path="policy-documents" element={<PolicyDocumentsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="pages/:slug" element={<DynamicPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}