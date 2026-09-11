import { Modal, Card, Tag } from 'antd';
import {
  CrownOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  BarChartOutlined,
  NotificationOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
  CodeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

export interface CatalogSection {
  component: string;
  name: string;
  category: 'Header' | 'Content' | 'Media' | 'Feed' | 'Interactive';
  description: string;
  icon: React.ReactNode;
  defaultData: Record<string, any>;
}

export const SECTION_CATALOG: CatalogSection[] = [
  {
    component: 'sections.hero',
    name: 'Hero Header Banner',
    category: 'Header',
    description: 'Top page banner with headline, color gradient accents, CTAs, and video or image backdrop.',
    icon: <CrownOutlined className="text-amber-500 text-2xl" />,
    defaultData: {
      title: 'Where Unity Drives Change',
      highlightTitle: 'Change',
      eyebrow: 'Youth Organization Union',
      description: 'Bringing youth organizations together across continents.',
      layoutVariant: 'centered',
      buttons: [{ label: 'Join Movement', url: '/#join-section', variant: 'solid' }],
    },
  },
  {
    component: 'sections.rich-text',
    name: 'Rich Text Article Block',
    category: 'Content',
    description: 'Multi-paragraph formatted body text, headings, and quotes.',
    icon: <FontSizeOutlined className="text-blue-500 text-2xl" />,
    defaultData: {
      title: 'Our Commitment',
      content: [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Write your content story or organizational announcement here...' }],
        },
      ],
    },
  },
  {
    component: 'sections.media-text',
    name: '2-Column Media & Story',
    category: 'Content',
    description: 'Side-by-side layout featuring an image or video paired with narrative copy and a button.',
    icon: <LayoutOutlined className="text-emerald-500 text-2xl" />,
    defaultData: {
      title: 'Empowering Local Youth Action',
      eyebrow: 'About Y.O.U',
      content: 'We connect grassroots youth advocates with international diplomatic platforms.',
      mediaPosition: 'right',
    },
  },
  {
    component: 'sections.stats-grid',
    name: 'Stats Counter Grid',
    category: 'Content',
    description: 'Animated counter metrics displaying members, countries, and volunteers.',
    icon: <BarChartOutlined className="text-cyan-500 text-2xl" />,
    defaultData: {
      title: 'Our Global Reach',
      variant: 'home',
      animated: true,
      items: [
        { label: 'Organizational Members', value: 20, prefix: '+' },
        { label: 'Continents', value: 6, prefix: '+' },
        { label: 'Countries', value: 30, prefix: '+' },
        { label: 'Volunteers', value: 1500, prefix: '+' },
      ],
    },
  },
  {
    component: 'sections.cta-banner',
    name: 'Call to Action Banner',
    category: 'Interactive',
    description: 'Full-width colored gradient banner with action button and star watermark.',
    icon: <NotificationOutlined className="text-rose-500 text-2xl" />,
    defaultData: {
      title: 'Ready to Make an Impact?',
      description: 'Join thousands of youth leaders across continents who are making a difference.',
      ctaLabel: 'Register Now',
      ctaUrl: '/#join-section',
      theme: 'rainbow-gradient',
    },
  },
  {
    component: 'sections.image-gallery',
    name: 'Image Gallery',
    category: 'Media',
    description: 'Activity photo gallery with responsive grid and lightbox preview.',
    icon: <PictureOutlined className="text-purple-500 text-2xl" />,
    defaultData: {
      title: 'Recent Initiatives',
      variant: 'featured',
      columns: 3,
      maxVisible: 7,
      images: [],
    },
  },
  {
    component: 'sections.faq-section',
    name: 'FAQ Accordion',
    category: 'Interactive',
    description: 'Collapsible accordion displaying global or custom question-and-answer pairs.',
    icon: <QuestionCircleOutlined className="text-indigo-500 text-2xl" />,
    defaultData: {
      title: 'Frequently Asked Questions',
      useGlobalFaqs: true,
      showViewAllButton: false,
    },
  },
  {
    component: 'sections.featured-projects',
    name: 'Featured Projects Grid',
    category: 'Feed',
    description: 'Dynamic grid showcasing top youth initiatives and SDG projects.',
    icon: <ProjectOutlined className="text-orange-500 text-2xl" />,
    defaultData: {
      title: 'Featured Projects',
      subtitle: 'Explore initiatives aligned with UN Sustainable Development Goals.',
      limit: 3,
      showViewAll: true,
    },
  },
  {
    component: 'sections.featured-members',
    name: 'Member Organizations Grid',
    category: 'Feed',
    description: 'Dynamic cards displaying official member organizations and country origins.',
    icon: <TeamOutlined className="text-teal-500 text-2xl" />,
    defaultData: {
      title: 'Our Member Organizations',
      subtitle: 'Grassroots leaders driving local change across the globe.',
      limit: 6,
      showViewAll: true,
    },
  },
  {
    component: 'sections.team-grid',
    name: 'Leadership & Team Grid',
    category: 'Feed',
    description: 'Grid of Executive Leaders or Continental Directors with social profiles.',
    icon: <UserOutlined className="text-sky-500 text-2xl" />,
    defaultData: {
      title: 'The People Behind Y.O.U',
      termLabel: '2026 - 2027',
      leadershipType: 'all',
    },
  },
  {
    component: 'sections.feature-grid',
    name: 'Feature / Mission Cards',
    category: 'Content',
    description: 'Grid of icon cards with titles and descriptions (e.g. Mission / Values).',
    icon: <AppstoreOutlined className="text-lime-600 text-2xl" />,
    defaultData: {
      title: 'Mission of Y.O.U',
      highlightTitle: 'Y.O.U',
      subtitle: 'Connect – Share – Create opportunities – Develop sustainably',
      columns: 4,
      items: [
        { icon: 'lucide:badge-check', title: 'Community Connection', description: 'Connecting people, organizations, and positive ideas.', active: true },
        { icon: 'lucide:graduation-cap', title: 'Education', description: 'Enhancing knowledge and developing capabilities.' },
        { icon: 'lucide:globe-2', title: 'International Cooperation', description: 'Building collaborative networks for common development.' },
        { icon: 'lucide:orbit', title: 'Sustainable Development', description: 'Towards a prosperous and sustainable community.' },
      ],
    },
  },
  {
    component: 'sections.image-text-grid',
    name: 'Activity Circles Grid',
    category: 'Content',
    description: 'Circular or rounded images with titles and descriptive text.',
    icon: <LayoutOutlined className="text-pink-500 text-2xl" />,
    defaultData: {
      title: "'s activities focus on",
      highlightTitle: 'Y.O.U',
      columns: 5,
      imageShape: 'circle',
      items: [],
    },
  },
  {
    component: 'sections.embed',
    name: 'Embed Video / Map / Iframe',
    category: 'Media',
    description: 'Embed responsive YouTube videos, Google Maps, or custom iframes.',
    icon: <CodeOutlined className="text-neutral-700 text-2xl" />,
    defaultData: {
      title: 'Watch our story',
      embedUrl: 'https://www.youtube.com/watch?v=2cgswCXiaYE',
      aspectRatio: '16:9',
    },
  },
];

interface SectionCatalogModalProps {
  open: boolean;
  onClose: () => void;
  onSelectSection: (section: CatalogSection) => void;
}

export function SectionCatalogModal({ open, onClose, onSelectSection }: SectionCatalogModalProps) {
  return (
    <Modal
      title={<span className="text-lg font-bold text-neutral-900">Add Page Section</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={880}
      destroyOnHidden
    >
      <p className="text-xs text-neutral-500 mb-6">
        Select a section type to add to your page layout. You can reorder sections and customize content anytime.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
        {SECTION_CATALOG.map((sec) => (
          <Card
            key={sec.component}
            hoverable
            onClick={() => {
              onSelectSection(sec);
              onClose();
            }}
            className="rounded-2xl border border-neutral-200 shadow-sm hover:border-[#005D9A] transition cursor-pointer p-0 flex flex-col"
            styles={{ body: { padding: '16px', display: 'flex', flexDirection: 'column', height: '100%' } }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                {sec.icon}
              </div>
              <Tag color="blue">{sec.category}</Tag>
            </div>

            <h4 className="font-bold text-sm text-neutral-900 m-0 mb-1">{sec.name}</h4>
            <p className="text-xs text-neutral-500 leading-relaxed m-0 flex-1">{sec.description}</p>
          </Card>
        ))}
      </div>
    </Modal>
  );
}