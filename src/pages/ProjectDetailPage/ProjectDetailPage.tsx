import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { SDGTag } from '@/components/ui/SDGTag';
import { Badge } from '@/components/ui/Badge';
import { ImageGallery } from '@/components/common/ImageGallery';
import { SectionHeading } from '@/components/common/SectionHeading';
import { QRSupportBlock } from '@/components/common/QRSupportBlock';
import { PROJECTS_DATA } from '@/data';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = PROJECTS_DATA.find((p) => p.id === projectId);

  if (!project) {
    return (
      <Container className="py-section text-center">
        <h2 className="text-h2 font-bold text-neutral-900">Project Not Found</h2>
        <p className="mt-2 text-neutral-600">The project you're looking for doesn't exist.</p>
      </Container>
    );
  }

  return (
    <div className="py-section-sm lg:py-section">
      <Container>
        {/* Hero image */}
        <div className="h-64 md:h-80 rounded-card overflow-hidden mb-8">
          <img
            src={project.outstandingImageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & status */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="font-heading text-h2 md:text-h1 font-bold text-neutral-900">
            {project.name}
          </h1>
          <Badge
            variant={project.status === 'ongoing' ? 'success' : project.status === 'completed' ? 'default' : 'warning'}
          >
            {project.status}
          </Badge>
        </div>

        {/* Meta */}
        <p className="text-sm text-neutral-500 mb-4">
          {project.region} • {project.countriesCovered.join(', ')}
        </p>

        {/* SDGs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.focusSdgs.map((sdgId) => (
            <SDGTag key={sdgId} sdgId={sdgId} size="md" />
          ))}
        </div>

        {/* Description */}
        <p className="text-neutral-700 leading-relaxed mb-6">{project.description}</p>

        {/* Impact */}
        <div className="bg-neutral-50 p-6 rounded-card mb-8">
          <h3 className="font-semibold text-neutral-900 mb-2">Indication of Impact</h3>
          <p className="text-neutral-700">{project.impactIndication}</p>
        </div>

        {/* Gallery */}
        {project.gallery.length > 0 && (
          <div className="mb-10">
            <SectionHeading title="Gallery" align="left" />
            <ImageGallery images={project.gallery} maxVisible={6} />
          </div>
        )}

        {/* QR Support */}
        {project.donationQrUrl && (
          <QRSupportBlock qrUrl={project.donationQrUrl} className="max-w-sm mx-auto" />
        )}
      </Container>
    </div>
  );
}
