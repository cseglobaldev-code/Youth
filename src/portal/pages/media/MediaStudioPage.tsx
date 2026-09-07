import { useEffect, useState, useCallback } from 'react';
import { Card, Input, Button, Upload, Modal, Image, message, Popconfirm } from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  CopyOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { fetchMediaFiles, deleteMediaFile, uploadMediaFile } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

export function MediaStudioPage() {
  const { token } = usePortalAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    message.success('URL copied to clipboard');
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
      setUploading(true);
      await uploadMediaFile(file, token);
      message.success(`${file.name} uploaded`);
      onSuccess?.();
      loadData();
    } catch (err: any) {
      message.error(err.message || 'Upload failed');
      onError?.(err);
    } finally {
      setUploading(false);
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
            Cloudinary media assets ({files.length} items). Upload, copy URLs, and manage storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search files…"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-xl"
          />
          <Button icon={<ReloadOutlined />} onClick={loadData} className="rounded-xl" />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-xl !bg-[#005D9A] font-semibold"
          >
            Upload Asset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => {
          const isImage = file.mime?.startsWith('image/');

          return (
            <Card
              key={file.id}
              hoverable
              className="rounded-2xl border border-neutral-200 overflow-hidden p-0 shadow-sm"
              styles={{ body: { padding: '8px' } }}
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-2">
                {isImage ? (
                  <Image src={file.url} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                  <FilePdfOutlined className="text-4xl text-neutral-400" />
                )}
              </div>

              <p className="text-xs font-semibold text-neutral-800 truncate m-0" title={file.name}>
                {file.name}
              </p>
              <span className="text-[10px] text-neutral-400 block">{Math.round(file.size || 0)} KB</span>

              <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                <Button size="small" type="text" icon={<CopyOutlined />} onClick={() => handleCopyLink(file.url)} title="Copy URL" />
                <Popconfirm title="Delete asset?" onConfirm={() => handleDelete(file.id)}>
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        title="Upload Assets"
        open={isUploadModalOpen}
        onCancel={() => setIsUploadModalOpen(false)}
        footer={null}
      >
        <Upload.Dragger customRequest={handleCustomUpload} showUploadList={false} multiple>
          <p className="text-4xl text-blue-500 mb-2">
            <UploadOutlined />
          </p>
          <p className="font-semibold text-neutral-800">Click or drag files to this area to upload</p>
          <p className="text-xs text-neutral-400">Supports JPG, PNG, WebP, SVG, and PDF files</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
}