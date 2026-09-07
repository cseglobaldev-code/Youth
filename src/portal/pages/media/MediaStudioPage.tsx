import { useEffect, useState, useCallback } from 'react';
import { Card, Input, Button, Upload, Modal, Image, message, Popconfirm, Tooltip, Empty, Space } from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  CopyOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  ReloadOutlined,
  EyeOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { fetchMediaFiles, deleteMediaFile, uploadMediaFile } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';

export function MediaStudioPage() {
  const { token } = usePortalAuth();
  const { canUploadMedia, isReadOnly } = useRolePermissions();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMediaFiles({ search }, token);
      setFiles(data);
    } catch (err: any) {
      message.error('Failed to load media gallery');
    } finally {
      setLoading(false);
    }
  }, [search, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    message.success('Asset URL copied to clipboard');
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteMediaFile(id, token);
      message.success('Asset deleted');
      loadData();
    } catch {
      message.error('Delete failed');
    }
  };

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      message.loading({ content: `Uploading ${file.name}...`, key: 'upload' });
      await uploadMediaFile(file, token);
      message.success({ content: `${file.name} uploaded`, key: 'upload' });
      onSuccess?.();
      loadData();
    } catch (err: any) {
      message.error({ content: err.message || 'Upload failed', key: 'upload' });
      onError?.(err);
    } finally {
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 m-0" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Media Studio
          </h1>
          <p className="text-xs text-neutral-500 mt-1 m-0">
            Cloudinary media assets ({files.length} items). Click any image or document to view and inspect.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search files…"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-xl"
            allowClear
          />
          {/* 👇 Fix: Attached 'loading' state to Reload button */}
          <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading} className="rounded-xl" />
          
          {!isReadOnly && canUploadMedia && (
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setIsUploadModalOpen(true)}
              className="rounded-xl !bg-[#005D9A] font-semibold"
            >
              Upload Asset
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => {
          const isImage = file.mime?.startsWith('image/');

          return (
            <Card
              key={file.id}
              hoverable
              className="rounded-2xl border border-neutral-200 overflow-hidden p-0 shadow-sm transition"
              styles={{ body: { padding: '8px' } }}
            >
              <div
                className="aspect-square rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-2 cursor-pointer relative group"
                onClick={() => {
                  if (!isImage) {
                    setPreviewDoc(file);
                  }
                }}
              >
                {isImage ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover"
                    preview={{ cover: <EyeOutlined className="text-lg" /> }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center">
                    <FilePdfOutlined className="text-4xl text-red-500 group-hover:scale-110 transition" />
                    <span className="text-[10px] text-blue-600 font-semibold mt-1">Click to view</span>
                  </div>
                )}
              </div>

              <p className="text-xs font-semibold text-neutral-800 truncate m-0" title={file.name}>
                {file.name}
              </p>
              <span className="text-[10px] text-neutral-400 block">{Math.round(file.size || 0)} KB</span>

              <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <Space>
                  {!isImage && (
                    <Tooltip title="View Document">
                      <Button size="small" type="text" icon={<EyeOutlined />} onClick={() => setPreviewDoc(file)} />
                    </Tooltip>
                  )}
                  <Tooltip title="Copy URL">
                    <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => handleCopyLink(file.url)} />
                  </Tooltip>
                </Space>

                {!isReadOnly && canUploadMedia && (
                  <Popconfirm title="Delete asset?" onConfirm={() => handleDelete(file.id)}>
                    <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        title="Upload Assets to Cloudinary"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Upload.Dragger customRequest={handleCustomUpload} showUploadList={false} multiple>
          <p className="text-4xl text-blue-500 mb-2">
            <UploadOutlined />
          </p>
          <p className="font-semibold text-neutral-800">Click or drag files to this area to upload</p>
          <p className="text-xs text-neutral-400">Supports JPG, PNG, WebP, SVG, PDF, and DOCX files</p>
        </Upload.Dragger>
      </Modal>

      <Modal
        title={
          <div className="flex items-center justify-between pr-8">
            <span className="font-bold text-neutral-900 truncate max-w-[500px]">
              {previewDoc?.name}
            </span>
            {previewDoc?.url && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                href={previewDoc.url}
                target="_blank"
                download
                size="small"
                className="!bg-[#005D9A]"
              >
                Download
              </Button>
            )}
          </div>
        }
        open={Boolean(previewDoc)}
        onCancel={() => setPreviewDoc(null)}
        footer={null}
        width="min(920px, 94vw)"
        destroyOnHidden
      >
        {previewDoc?.url ? (
          <div className="w-full h-[650px] border border-neutral-300 rounded-2xl overflow-hidden bg-neutral-100 mt-4">
            <iframe
              src={previewDoc.url}
              title={previewDoc.name}
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <Empty description="No document URL available" className="py-16" />
        )}
      </Modal>
    </div>
  );
}