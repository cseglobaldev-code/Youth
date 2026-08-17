import { SectionWrapper } from './SectionWrapper';
import { BlockErrorBoundary } from './BlockErrorBoundary';

// Import trực tiếp từng file block
import { HeroBlock } from './blocks/HeroBlock';
import { RichTextBlock } from './blocks/RichTextBlock';
import { MediaTextBlock } from './blocks/MediaTextBlock';
import { StatsGridBlock } from './blocks/StatsGridBlock';
import { CTABannerBlock } from './blocks/CTABannerBlock';
import { ImageGalleryBlock } from './blocks/ImageGalleryBlock';
import { FaqSectionBlock } from './blocks/FaqSectionBlock';
import { FeaturedProjectsBlock } from './blocks/FeaturedProjectsBlock';
import { FeaturedMembersBlock } from './blocks/FeaturedMembersBlock';
import { TeamGridBlock } from './blocks/TeamGridBlock';
import { EmbedBlock } from './blocks/EmbedBlock';

import type { DynamicContentBlock } from '@/types';

export interface BlockRendererProps {
  blocks: DynamicContentBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {blocks.map((block, index) => {
        const blockId = String(block.id || `block-${index}`);

        return (
          <BlockErrorBoundary key={`${block.__component}-${block.id || index}-${index}`} blockName={block.__component}>
            <SectionWrapper style={block.style} id={blockId}>
              {(() => {
                switch (block.__component) {
                  case 'sections.hero':
                    return <HeroBlock data={block} />;
                  case 'sections.rich-text':
                    return <RichTextBlock data={block} />;
                  case 'sections.media-text':
                    return <MediaTextBlock data={block} />;
                  case 'sections.stats-grid':
                    return <StatsGridBlock data={block} />;
                  case 'sections.cta-banner':
                    return <CTABannerBlock data={block} />;
                  case 'sections.image-gallery':
                    return <ImageGalleryBlock data={block} />;
                  case 'sections.faq-section':
                    return <FaqSectionBlock data={block} />;
                  case 'sections.featured-projects':
                    return <FeaturedProjectsBlock data={block} />;
                  case 'sections.featured-members':
                    return <FeaturedMembersBlock data={block} />;
                  case 'sections.team-grid':
                    return <TeamGridBlock data={block} />;
                  case 'sections.embed':
                    return <EmbedBlock data={block} />;
                  default:
                    return null;
                }
              })()}
            </SectionWrapper>
          </BlockErrorBoundary>
        );
      })}
    </div>
  );
}