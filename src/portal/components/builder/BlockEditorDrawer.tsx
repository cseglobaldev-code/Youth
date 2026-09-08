import { useEffect } from 'react';
import { Drawer, Form, Input, Select, Switch, Button, Divider, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { MediaPicker } from '../shared/MediaPicker';

interface BlockEditorDrawerProps {
  open: boolean;
  block: any | null;
  onClose: () => void;
  onSave: (updatedBlock: any) => void;
}

const BG_OPTIONS = [
  { value: 'white', label: 'White (#FFFFFF)' },
  { value: 'light-blue', label: 'Light Blue Soft (#F2F7FF)' },
  { value: 'dark-navy', label: 'Dark Navy Brand (#0B1A2B)' },
  { value: 'rainbow-soft', label: 'Soft Rainbow Gradient Tint' },
  { value: 'transparent', label: 'Transparent' },
];

const PADDING_OPTIONS = [
  { value: 'none', label: 'None (0px)' },
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' },
];

const WIDTH_OPTIONS = [
  { value: 'default', label: 'Default (1344px)' },
  { value: 'narrow', label: 'Narrow (960px)' },
  { value: 'wide', label: 'Wide (1536px)' },
  { value: 'full', label: 'Full Width (100%)' },
];

export function BlockEditorDrawer({ open, block, onClose, onSave }: BlockEditorDrawerProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (block) {
      form.setFieldsValue({
        ...block,
        style: {
          background: block.style?.background || 'white',
          paddingTop: block.style?.paddingTop || 'normal',
          paddingBottom: block.style?.paddingBottom || 'normal',
          containerWidth: block.style?.containerWidth || 'default',
        },
        // Flatten rich-text if it is AST
        textContent: Array.isArray(block.content)
          ? block.content.map((c: any) => c.children?.map((ch: any) => ch.text).join('')).join('\n\n')
          : typeof block.content === 'string' ? block.content : '',
      });
    }
  }, [block, form]);

  const handleFinish = (values: any) => {
    const updated = {
      ...block,
      ...values,
      style: values.style,
    };

    // Serialize textContent back to blocks if rich-text
    if (block.__component === 'sections.rich-text') {
      const paragraphs = (values.textContent || '').split(/\n\n+/).filter(Boolean);
      updated.content = paragraphs.map((p: string) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p.trim() }],
      }));
    }

    onSave(updated);
    onClose();
  };

  if (!block) return null;

  return (
    <Drawer
      title={<span className="font-bold text-neutral-900">Edit Section: {block.__component}</span>}
      open={open}
      onClose={onClose}
      width="min(680px, 92vw)"
      destroyOnHidden
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} className="!bg-[#005D9A]">
            Apply Changes
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Common Section Heading Fields */}
        <Form.Item label="Section Title / Headline" name="title">
          <Input placeholder="Main heading for this section" />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item label="Eyebrow Text" name="eyebrow">
            <Input placeholder="e.g. ABOUT Y.O.U" />
          </Form.Item>
          <Form.Item label="Gradient Highlighted Word" name="highlightTitle">
            <Input placeholder="Word to apply rainbow gradient to" />
          </Form.Item>
        </div>

        <Form.Item label="Subtitle / Description" name="description">
          <Input.TextArea rows={2} placeholder="Optional explanatory paragraph below title" />
        </Form.Item>

        {/* Component Specific Fields */}
        {block.__component === 'sections.hero' && (
          <>
            <Form.Item label="Layout Variant" name="layoutVariant" initialValue="centered">
              <Select
                options={[
                  { value: 'centered', label: 'Centered (Text over Media)' },
                  { value: 'split-media', label: 'Split (Text Left, Image Right)' },
                ]}
              />
            </Form.Item>
            <Form.Item label="YouTube Video ID (Optional)" name="youtubeVideoId">
              <Input placeholder="e.g. 2cgswCXiaYE" />
            </Form.Item>
            <Form.Item label="Hero Backdrop Image" name="image">
              <MediaPicker previewUrl={block.imageUrl || block.image?.url} />
            </Form.Item>
          </>
        )}

        {block.__component === 'sections.media-text' && (
          <>
            <Form.Item label="Content Story" name="content" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="Story content..." />
            </Form.Item>
            <Form.Item label="Media Position" name="mediaPosition" initialValue="right">
              <Select
                options={[
                  { value: 'left', label: 'Media on Left' },
                  { value: 'right', label: 'Media on Right' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Media Asset" name="media">
              <MediaPicker previewUrl={block.mediaUrl || block.media?.url} />
            </Form.Item>
          </>
        )}

        {block.__component === 'sections.rich-text' && (
          <Form.Item label="Article Body (Separate paragraphs with double Enter)" name="textContent">
            <Input.TextArea rows={8} placeholder="Write body text here..." />
          </Form.Item>
        )}

        {block.__component === 'sections.cta-banner' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Button Label" name="ctaLabel" rules={[{ required: true }]}>
              <Input placeholder="e.g. Register Now" />
            </Form.Item>
            <Form.Item label="Button Destination URL" name="ctaUrl">
              <Input placeholder="e.g. /#join-section or https://..." />
            </Form.Item>
            <Form.Item label="Color Theme" name="theme" initialValue="rainbow-gradient">
              <Select
                options={[
                  { value: 'rainbow-gradient', label: 'Y.O.U Rainbow Gradient' },
                  { value: 'blue-gradient', label: 'Blue Brand Gradient' },
                  { value: 'solid-brand', label: 'Solid Brand Navy' },
                  { value: 'white-box', label: 'Clean White Box' },
                ]}
              />
            </Form.Item>
          </div>
        )}

        {block.__component === 'sections.faq-section' && (
          <Form.Item label="Display Shared Global FAQs?" name="useGlobalFaqs" valuePropName="checked">
            <Switch />
          </Form.Item>
        )}

        {block.__component === 'sections.embed' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item label="Embed URL (YouTube, Map, etc.)" name="embedUrl" rules={[{ required: true }]}>
              <Input placeholder="https://www.youtube.com/watch?v=..." />
            </Form.Item>
            <Form.Item label="Aspect Ratio" name="aspectRatio" initialValue="16:9">
              <Select
                options={[
                  { value: '16:9', label: '16:9 (Standard Video)' },
                  { value: '4:3', label: '4:3' },
                  { value: '1:1', label: '1:1 (Square)' },
                ]}
              />
            </Form.Item>
          </div>
        )}

        <Divider>Section Styling &amp; Layout</Divider>

        {/* Section Style Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <Form.Item label="Background Color" name={['style', 'background']}>
            <Select options={BG_OPTIONS} />
          </Form.Item>

          <Form.Item label="Container Width" name={['style', 'containerWidth']}>
            <Select options={WIDTH_OPTIONS} />
          </Form.Item>

          <Form.Item label="Top Padding" name={['style', 'paddingTop']}>
            <Select options={PADDING_OPTIONS} />
          </Form.Item>

          <Form.Item label="Bottom Padding" name={['style', 'paddingBottom']}>
            <Select options={PADDING_OPTIONS} />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
}