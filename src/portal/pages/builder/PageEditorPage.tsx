import { useEffect, useState, useCallback } from 'react';
import { Button, Card, Form, Input, message, Tabs, Alert, Space } from 'antd';
import { SaveOutlined, EyeOutlined, GlobalOutlined } from '@ant-design/icons';
import { DynamicZoneEditor } from '../../components/builder/DynamicZoneEditor';
import { fetchSingleType, updateSingleType, fetchCollection, updateEntry } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

interface PageEditorPageProps {
  pageType: 'home' | 'about-us' | 'custom';
  documentId?: string;
  previewUrl: string;
}

export function PageEditorPage({ pageType, previewUrl }: PageEditorPageProps) {
  const { token } = usePortalAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [activeLang, setActiveLang] = useState<'en' | 'vi'>('en');
  const [form] = Form.useForm();

  const endpoint = pageType === 'home' ? 'home-page' : pageType === 'about-us' ? 'about-us' : 'pages';

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (pageType === 'home' || pageType === 'about-us') {
        const res = await fetchSingleType(endpoint, { locale: activeLang }, token);
        if (res) {
          setBlocks(res.contentBlocks || []);
          form.setFieldsValue({
            metaTitle: res.seo?.metaTitle || '',
            metaDescription: res.seo?.metaDescription || '',
          });
        }
      }
    } catch (err: any) {
      message.error(err.message || 'Failed to load page content');
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageType, activeLang, form, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (publish = false) => {
    try {
      setSaving(true);
      const values = form.getFieldsValue();
      const payload: Record<string, any> = {
        contentBlocks: blocks,
        seo: {
          metaTitle: values.metaTitle,
          metaDescription: values.metaDescription,
        },
      };

      if (publish) {
        payload.publishedAt = new Date().toISOString();
      }

      if (pageType === 'home' || pageType === 'about-us') {
        await updateSingleType(endpoint, payload, token);
      }

      message.success(publish ? 'Page published live!' : 'Draft saved successfully!');
    } catch (err: any) {
      message.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenPreview = () => {
    window.open(`${previewUrl}?preview=1`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 m-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            {pageType === 'home' ? 'Home Page Builder' : 'About Us Page Builder'}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 m-0">
            Structure sections, manage SEO metadata, and preview changes live on the website.
          </p>
        </div>

        <Space>
          <Button icon={<EyeOutlined />} onClick={handleOpenPreview} className="rounded-xl">
            Live Preview ↗
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => handleSave(false)}
            className="rounded-xl !bg-[#005D9A] font-semibold"
          >
            Save Draft
          </Button>
          <Button
            type="primary"
            loading={saving}
            onClick={() => handleSave(true)}
            className="rounded-xl !bg-emerald-600 font-semibold"
          >
            Publish Live
          </Button>
        </Space>
      </div>

      {/* Main Studio Area */}
      <Tabs
        activeKey={activeLang}
        onChange={(k) => setActiveLang(k as 'en' | 'vi')}
        items={[
          { key: 'en', label: '🇬🇧 English Version' },
          { key: 'vi', label: '🇻🇳 Vietnamese Version' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dynamic Sections */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border border-neutral-200 shadow-sm">
            <DynamicZoneEditor blocks={blocks} onChange={setBlocks} />
          </Card>
        </div>

        {/* Right: SEO Metadata */}
        <div>
          <Card title="Search Engine Optimization (SEO)" className="rounded-3xl border border-neutral-200 shadow-sm">
            <Form form={form} layout="vertical">
              <Form.Item label="Page Meta Title" name="metaTitle">
                <Input placeholder="e.g. Y.O.U – Where Unity Drives Change" />
              </Form.Item>
              <Form.Item label="Meta Description" name="metaDescription">
                <Input.TextArea rows={4} placeholder="Brief summary displayed in Google search results and social share cards..." />
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}