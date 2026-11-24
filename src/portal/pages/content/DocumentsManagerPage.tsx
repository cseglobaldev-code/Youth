import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Space,
  Alert,
} from 'antd';
import { PortalDataTable } from '../../components/shared/PortalDataTable';
import { MediaPicker } from '../../components/shared/MediaPicker';
import {
  fetchCollection,
  createEntry,
  updateEntry,
  deleteEntry,
} from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { DOCUMENT_CATALOG, CAREER_CONTINENTS } from '@/data/documentCatalog';
import { DocumentBlocksEditor } from '../../components/shared/DocumentBlocksEditor';
import { safeDocumentUrl } from '@/lib/utils/documentLinks';

const SECTIONS = [
  ...DOCUMENT_CATALOG.map((item) => ({ value: item.key, label: item.title })),
  { value: 'annual-report', label: 'Annual Reports' },
  { value: 'terms-of-service', label: 'Terms of Service' },
  { value: 'privacy-policy', label: 'Privacy Policy' },
];
const httpsRule = {
  validator: (_: unknown, value: string) =>
    !value || (safeDocumentUrl(value) && value.startsWith('https://'))
      ? Promise.resolve()
      : Promise.reject(
          new Error('Enter a public HTTPS link, not iframe HTML.'),
        ),
};

export function DocumentsManagerPage() {
  const { token } = usePortalAuth();
  const { canManageContent } = useRolePermissions();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const section = Form.useWatch('section', form);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all: any[] = [];
      let page = 1,
        total = 1;
      do {
        const result = await fetchCollection(
          'policy-documents',
          {
            page,
            pageSize: 100,
            status: 'draft',
            populate: ['file', 'coverImage', 'slideImages', 'archives'],
          },
          token,
        );
        all.push(...result.data);
        total = result.meta.pagination.total;
        page++;
      } while (all.length < total);
      setDocuments(all);
    } catch {
      message.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    void load();
  }, [load]);
  const edit = (item: any = null) => {
    setEditing(item);
    form.resetFields();
    if (item)
      form.setFieldsValue({
        ...item,
        file: item.file?.id,
        coverImage: item.coverImage?.id,
        slideImages: item.slideImages?.map((image: any) => ({ id: image.id })),
      });
    setOpen(true);
  };
  const save = async (status: 'draft' | 'published') => {
    if (!canManageContent) return;
    try {
      const values = await form.validateFields();
      setSaving(true);
      const selected = DOCUMENT_CATALOG.find(
        (item) => item.key === values.section,
      );
      const legal = ['terms-of-service', 'privacy-policy'].includes(
        values.section,
      );
      const data = {
        ...values,
        category: selected?.category || (legal ? 'legal' : 'annual-reports'),
        displayMode: selected?.mode || (legal ? 'legal' : 'annual-report'),
        continent:
          values.section === 'careers' ? values.continent || null : null,
        displayOrder: Number(values.displayOrder) || 0,
        effectiveDate: values.effectiveDate || null,
        slideImages:
          (values.slideImages ?? editing?.slideImages)
            ?.map((image: any) => image.id)
            .filter(Boolean) || [],
        archives: (values.archives ?? editing?.archives ?? []).map(
          (item: any) => ({
            ...item,
            label: item.label || null,
            embedUrl: item.embedUrl || null,
          }),
        ),
      };
      // Legal permalinks are stable even when their titles are edited.
      if (legal) data.slug = values.section;
      if (editing)
        await updateEntry(
          'policy-documents',
          editing.documentId || editing.id,
          data,
          token,
          status,
        );
      else await createEntry('policy-documents', data, token, status);
      message.success(
        status === 'published'
          ? 'Published. Website updates on refresh or within 30 seconds.'
          : 'Draft saved. Publish to update the website.',
      );
      setOpen(false);
      void load();
    } catch (err: any) {
      if (!err.errorFields) message.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div>
      <Alert
        className="mb-5"
        type="info"
        showIcon
        title="Documents are managed here and in Strapi → Content Manager → Documents."
        description="Save draft keeps changes off the website. Save & Publish makes them public. To remove a published version without deleting its history, use Unpublish in Strapi. Rich text, links and images can also be edited with the full Strapi Blocks editor."
      />
      <PortalDataTable
        title="Documents & Legal Pages"
        dataSource={documents
          .filter((item) =>
            `${item.title} ${item.section} ${item.continent || ''}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .slice((page - 1) * pageSize, page * pageSize)}
        loading={loading}
        total={
          documents.filter((item) =>
            `${item.title} ${item.section} ${item.continent || ''}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          ).length
        }
        currentPage={page}
        pageSize={pageSize}
        onPageChange={(value, size) => {
          setPage(value);
          setPageSize(size);
        }}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onRefresh={load}
        onAddNew={canManageContent ? () => edit() : undefined}
        columns={[
          { title: 'Title', dataIndex: 'title' },
          { title: 'Section', dataIndex: 'section' },
          { title: 'Continent', dataIndex: 'continent' },
          { title: 'Version', dataIndex: 'revision' },
          {
            title: 'Actions',
            render: (_: unknown, item: any) => (
              <Space>
                <Button onClick={() => edit(item)}>
                  {canManageContent ? 'Edit draft' : 'View'}
                </Button>
                {canManageContent && (
                  <Popconfirm
                    title="Delete this document and all its versions?"
                    onConfirm={async () => {
                      try {
                        await deleteEntry(
                          'policy-documents',
                          item.documentId || item.id,
                          token,
                        );
                        void load();
                      } catch {
                        message.error('Delete failed');
                      }
                    }}
                  >
                    <Button danger>Delete</Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? 'Edit document' : 'Create document'}
        open={open}
        onCancel={() => setOpen(false)}
        width={850}
        destroyOnHidden
        footer={
          canManageContent ? (
            <Space>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button loading={saving} onClick={() => void save('draft')}>
                Save draft
              </Button>
              <Button
                type="primary"
                loading={saving}
                onClick={() => void save('published')}
              >
                Save & Publish
              </Button>
            </Space>
          ) : null
        }
      >
        <Form
          form={form}
          layout="vertical"
          disabled={!canManageContent}
          initialValues={{ fileType: 'pdf', revision: '0.0', displayOrder: 0 }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div className="grid sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="section"
              label="Website section"
              rules={[{ required: true }]}
            >
              <Select options={SECTIONS} />
            </Form.Item>
            <Form.Item
              name="slug"
              label="Page slug (keep stable after publishing)"
            >
              <Input placeholder="e.g. governance-policy" />
            </Form.Item>
          </div>
          {section === 'careers' && (
            <Form.Item
              name="continent"
              label="Continent (leave empty for shared career documents)"
            >
              <Select
                allowClear
                options={CAREER_CONTINENTS.map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </Form.Item>
          )}
          <div className="grid sm:grid-cols-3 gap-x-4">
            <Form.Item
              name="revision"
              label="Version"
              rules={[
                { required: true },
                { pattern: /^v?\d+\.\d+$/, message: 'Use 0.0, 1.0, etc.' },
              ]}
            >
              <Input placeholder="0.0" />
            </Form.Item>
            <Form.Item name="effectiveDate" label="Effective / report date">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="displayOrder" label="Display order">
              <Input type="number" />
            </Form.Item>
          </div>
          {!['terms-of-service', 'privacy-policy'].includes(section) && (
            <>
              <Form.Item
                name="externalUrl"
                label="Public source link (preferred over file uploads)"
                rules={[httpsRule]}
              >
                <Input placeholder="https://..." />
              </Form.Item>
              <Form.Item
                name="embedUrl"
                label="Optional preview / published embed URL"
                rules={[httpsRule]}
                extra="Google Docs/Slides: Publish to web, then paste the URL only. Folder links open in a new tab."
              >
                <Input placeholder="https://docs.google.com/..." />
              </Form.Item>
              <Form.Item name="file" label="Optional attached file">
                <MediaPicker
                  key={`file-${editing?.documentId || 'new'}`}
                  previewUrl={editing?.file?.url}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
              </Form.Item>
              <Form.Item name="fileType" label="File icon">
                <Select
                  options={['pdf', 'doc', 'xls', 'ppt'].map((value) => ({
                    value,
                    label: value.toUpperCase(),
                  }))}
                />
              </Form.Item>
            </>
          )}
          {section === 'annual-report' && (
            <Form.Item name="coverImage" label="Annual report card image">
              <MediaPicker
                key={`cover-${editing?.documentId || 'new'}`}
                previewUrl={editing?.coverImage?.url}
                accept="image/*"
              />
            </Form.Item>
          )}
          {['protocol', 'bluebook'].includes(section) && (
            <>
              <p className="mb-3">
                Display as slides. Use a published presentation link above, or
                add slide images in order.
              </p>
              <Form.List name="slideImages">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <div key={field.key} className="mb-4">
                        <Form.Item
                          name={[field.name, 'id']}
                          label={`Slide ${field.name + 1}`}
                        >
                          <MediaPicker
                            previewUrl={editing?.slideImages?.[field.name]?.url}
                            accept="image/*"
                          />
                        </Form.Item>
                        <Button
                          disabled={!canManageContent}
                          onClick={() => remove(field.name)}
                        >
                          Remove slide
                        </Button>
                      </div>
                    ))}
                    <Button disabled={!canManageContent} onClick={() => add()}>
                      Add slide
                    </Button>
                  </>
                )}
              </Form.List>
            </>
          )}
          <Form.Item name="content" label="Page content">
            <DocumentBlocksEditor disabled={!canManageContent} />
          </Form.Item>
          {!['protocol', 'bluebook'].includes(section) && (
            <>
              <h3 className="text-lg font-semibold my-4">Archived versions</h3>
              <p className="mb-4 text-neutral-500">
                Save a separate public copy for each historical version.
                Changing the current source link does not freeze its old
                content.
              </p>
              <Form.List name="archives">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        className="border rounded-xl p-4 mb-4"
                      >
                        <Form.Item name={[field.name, 'id']} hidden>
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'label']}
                          label="Optional label"
                        >
                          <Input />
                        </Form.Item>
                        <div className="grid sm:grid-cols-2 gap-x-4">
                          <Form.Item
                            name={[field.name, 'revision']}
                            label="Version"
                            rules={[
                              { required: true },
                              { pattern: /^v?\d+\.\d+$/, message: 'Use 0.0' },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'effectiveDate']}
                            label="Date"
                            rules={[{ required: true }]}
                          >
                            <Input type="date" />
                          </Form.Item>
                        </div>
                        <Form.Item
                          name={[field.name, 'url']}
                          label="Archived public link"
                          rules={[{ required: true }, httpsRule]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          name={[field.name, 'embedUrl']}
                          label="Optional embed URL"
                          rules={[httpsRule]}
                        >
                          <Input />
                        </Form.Item>
                        <Button
                          disabled={!canManageContent}
                          onClick={() => remove(field.name)}
                        >
                          Remove archive entry
                        </Button>
                      </div>
                    ))}
                    <Button
                      disabled={!canManageContent}
                      onClick={() => add({ revision: '0.0' })}
                    >
                      Add archived version
                    </Button>
                  </>
                )}
              </Form.List>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
