import { Button, Input, Select } from 'antd';
import { DocumentContent } from '@/components/documents/DocumentContent';

interface Props {
  value?: any[];
  onChange?: (blocks: any[]) => void;
  disabled?: boolean;
}
// Existing blocks/inline formatting stay intact until their text is edited.
// The full Strapi editor remains available for rich links, lists and media.
export function DocumentBlocksEditor({
  value = [],
  onChange,
  disabled,
}: Props) {
  const replace = (index: number, block: any) =>
    onChange?.(value.map((item, i) => (i === index ? block : item)));
  const text = (node: any): string =>
    node.text ?? (node.children || []).map(text).join('');
  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500">
        Edit headings and paragraphs here. Editing a paragraph replaces its
        inline formatting; use Strapi for rich links, lists and media.
      </p>
      {value.map((block, index) => (
        <div key={index} className="border rounded-lg p-3">
          {['paragraph', 'heading', 'quote'].includes(block.type) ? (
            <>
              <Select
                disabled={disabled}
                className="mb-2 w-40"
                value={
                  block.type === 'heading' ? `h${block.level}` : block.type
                }
                options={[
                  { value: 'paragraph', label: 'Paragraph' },
                  ...[2, 3, 4].map((level) => ({
                    value: `h${level}`,
                    label: `Heading ${level}`,
                  })),
                  { value: 'quote', label: 'Quote' },
                ]}
                onChange={(type) =>
                  replace(index, {
                    ...block,
                    type: type.startsWith('h') ? 'heading' : type,
                    level: type.startsWith('h')
                      ? Number(type.slice(1))
                      : undefined,
                  })
                }
              />
              <Input.TextArea
                aria-label={`Content block ${index + 1}`}
                disabled={disabled}
                autoSize={{ minRows: 2, maxRows: 10 }}
                value={text(block)}
                onChange={(event) =>
                  replace(index, {
                    ...block,
                    children: [{ type: 'text', text: event.target.value }],
                  })
                }
              />
            </>
          ) : (
            <DocumentContent blocks={[block]} />
          )}
          <Button
            disabled={disabled}
            size="small"
            className="mt-2"
            onClick={() => onChange?.(value.filter((_, i) => i !== index))}
          >
            Remove block
          </Button>
        </div>
      ))}
      <Button
        disabled={disabled}
        onClick={() =>
          onChange?.([
            ...value,
            { type: 'paragraph', children: [{ type: 'text', text: '' }] },
          ])
        }
      >
        Add paragraph
      </Button>
    </div>
  );
}
