import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { SDGTag } from '@/components/ui/SDGTag';
import { SocialLinks } from '@/components/common/SocialLinks';
import { ProjectCard } from '@/components/common/ProjectCard';
import { ImageGallery } from '@/components/common/ImageGallery';
import { QRSupportBlock } from '@/components/common/QRSupportBlock';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MEMBERS_DATA, PROJECTS_DATA } from '@/data';

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const member = MEMBERS_DATA.find((m) => m.id === memberId);

  if (!member) {
    return (
      <Container className="py-section text-center">
        <h2 className="text-h2 font-bold text-neutral-900">Member Not Found</h2>
        <p className="mt-2 text-neutral-600">The organization you're looking for doesn't exist.</p>
      </Container>
    );
  }

  const relatedProjects = PROJECTS_DATA.filter((p) => member.projectIds.includes(p.id));

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        {/* Hero */}
        <div className="mb-10">
          {member.coverUrl && (
            <div className="h-48 md:h-64 rounded-card overflow-hidden mb-6">
              <img src={member.coverUrl} alt={member.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-start gap-4">
            <img
              src={member.logoUrl}
              alt={`${member.name} logo`}
              className="w-16 h-16 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <h1 className="font-heading text-h2 md:text-h1 font-bold text-neutral-900">
                {member.name}
              </h1>
              <p className="text-neutral-500 text-sm mt-1">
                {member.country} • {member.continent}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-700 leading-relaxed mb-6">{member.description}</p>

        {/* SDGs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {member.focusSdgs.map((sdgId) => (
            <SDGTag key={sdgId} sdgId={sdgId} size="md" />
          ))}
        </div>

        {/* Social */}
        {member.socialLinks.length > 0 && (
          <SocialLinks links={member.socialLinks} className="mb-10" />
        )}

        {/* Projects */}
        {relatedProjects.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Projects" align="left" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {member.gallery.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Gallery" align="left" />
            <ImageGallery images={member.gallery} maxVisible={6} />
          </div>
        )}

        {/* QR Support */}
        {member.donationQrUrl && (
          <QRSupportBlock qrUrl={member.donationQrUrl} className="max-w-sm mx-auto" />
        )}
      </Container>
    </div>
  );
}
