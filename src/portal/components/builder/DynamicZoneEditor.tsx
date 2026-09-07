import { useState } from 'react';
import { Button, Card, Empty, Tag, Space, Popconfirm } from 'antd';
import {
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { SectionCatalogModal, SECTION_CATALOG, type CatalogSection } from './SectionCatalogModal';
import { BlockEditorDrawer } from './BlockEditorDrawer';

interface DynamicZoneEditorProps {
  blocks: any[];
  onChange: (blocks: any[]) => void;
}

export function DynamicZoneEditor({ blocks = [], onChange }: DynamicZoneEditorProps) {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddSection = (section: CatalogSection) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      __component: section.component,
      ...section.defaultData,
    };
    onChange([...blocks, newBlock]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  const handleDuplicate = (index: number) => {
    const block = blocks[index];
    const duplicated = {
      ...JSON.parse(JSON.stringify(block)),
      id: `block-${Date.now()}`,
    };
    const next = [...blocks];
    next.splice(index + 1, 0, duplicated);
    onChange(next);
  };

  const handleDelete = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const handleSaveBlock = (updatedBlock: any) => {
    if (editingIndex === null) return;
    const next = [...blocks];
    next[editingIndex] = updatedBlock;
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-neutral-900 m-0">Page Layout Sections</h3>
          <p className="text-xs text-neutral-500 m-0">
            {blocks.length} sections configured. Drag &amp; reorder to structure the page flow.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCatalogOpen(true)}
          className="rounded-xl !bg-[#005D9A] font-semibold"
        >
          Add Section
        </Button>
      </div>

      {blocks.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-2 border-neutral-300 text-center py-10 bg-neutral-50">
          <Empty description="No sections on this page yet" />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCatalogOpen(true)}
            className="mt-4 !bg-[#005D9A]"
          >
            Select First Section
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => {
            const catalogInfo = SECTION_CATALOG.find((c) => c.component === block.__component);

            return (
              <div
                key={block.id || index}
                className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-[#005D9A] transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 border border-neutral-100">
                    {catalogInfo?.icon || <span className="font-bold">#</span>}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-neutral-900">
                        {catalogInfo?.name || block.__component}
                      </span>
                      <Tag color="blue" className="text-[11px]">
                        {catalogInfo?.category || 'Block'}
                      </Tag>
                    </div>
                    <p className="text-xs text-neutral-400 truncate m-0 mt-0.5">
                      {block.title || block.eyebrow || block.description || '(No title configured)'}
                    </p>
                  </div>
                </div>

                <Space>
                  <Button
                    size="small"
                    icon={<ArrowUpOutlined />}
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    title="Move up"
                  />
                  <Button
                    size="small"
                    icon={<ArrowDownOutlined />}
                    disabled={index === blocks.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    title="Move down"
                  />
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => handleDuplicate(index)}
                    title="Duplicate"
                  />
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    icon={<EditOutlined />}
                    onClick={() => setEditingIndex(index)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Remove Section"
                    description="Delete this section from the page?"
                    onConfirm={() => handleDelete(index)}
                    okText="Delete"
                    okType="danger"
                  >
                    <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              </div>
            );
          })}
        </div>
      )}

      {/* Catalog Picker Modal */}
      <SectionCatalogModal
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onSelectSection={handleAddSection}
      />

      {/* Section Editor Drawer */}
      <BlockEditorDrawer
        open={editingIndex !== null}
        block={editingIndex !== null ? blocks[editingIndex] : null}
        onClose={() => setEditingIndex(null)}
        onSave={handleSaveBlock}
      />
    </div>
  );
}