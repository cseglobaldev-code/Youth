import { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { uploadMediaFile } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

interface MediaPickerProps {
  value?: number | null;
  previewUrl?: string | null;
  accept?: string;
  onChange?: (mediaId: number | null, mediaUrl?: string) => void;
}

function getFileIcon(url: string) {
  const lower = url.toLowerCase();
  if (lower.endsWith('.pdf')) return <FilePdfOutlined className="text-3xl text-red-500" />;
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv'))
    return <FileExcelOutlined className="text-3xl text-emerald-600" />;
  if (lower.endsWith('.doc') || lower.endsWith('.docx'))
    return <FileWordOutlined className="text-3xl text-blue-600" />;
  return <FileTextOutlined className="text-3xl text-neutral-500" />;
}

export function MediaPicker({
  previewUrl,
  accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  onChange,
}: MediaPickerProps) {
  const { token } = usePortalAuth();
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(previewUrl || null);

  const isImage =
    currentUrl &&
    (/\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(currentUrl) || !currentUrl.includes('.'));

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setLoading(true);
      const res = await uploadMediaFile(file, token);
      setCurrentUrl(res.url);
      onChange?.(res.id, res.url);
      message.success(`${file.name} uploaded successfully!`);
      onSuccess?.(res);
    } catch (err: any) {
      message.error(err.message || 'Upload failed');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCurrentUrl(null);
    onChange?.(null, '');
  };

  return (
    <div className="space-y-3">
      {currentUrl ? (
        <div className="relative inline-flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm max-w-full">
          {isImage ? (
            <div className="h-20 w-28 overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <Image src={currentUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200 shadow-sm">
              {getFileIcon(currentUrl)}
            </div>
          )}

          <div className="min-w-0 flex-1 pr-8">
            <span className="text-xs font-semibold text-neutral-800 block truncate max-w-[220px]">
              {currentUrl.split('/').pop() || 'Attached File'}
            </span>
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[#005D9A] hover:underline"
            >
              Open File ↗
            </a>
          </div>

          <Button
            type="primary"
            danger
            shape="circle"
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            className="absolute top-2 right-2 shadow-sm"
            title="Remove file"
          />
        </div>
      ) : (
        <Upload
          customRequest={handleCustomUpload}
          showUploadList={false}
          accept={accept}
        >
          <Button icon={<UploadOutlined />} loading={loading} className="rounded-xl font-semibold">
            {loading ? 'Uploading…' : 'Select or Upload Document'}
          </Button>
        </Upload>
      )}
    </div>
  );
}