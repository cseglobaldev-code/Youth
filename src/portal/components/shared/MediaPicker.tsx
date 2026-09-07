import { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadMediaFile } from '../../api/content';
import { usePortalAuth } from '../../context/PortalAuthContext';

interface MediaPickerProps {
  value?: number | null;
  previewUrl?: string | null;
  onChange?: (mediaId: number | null, mediaUrl?: string) => void;
}

export function MediaPicker({ previewUrl, onChange }: MediaPickerProps) {
  const { token } = usePortalAuth();
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(previewUrl || null);

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setLoading(true);
      const res = await uploadMediaFile(file, token);
      setCurrentUrl(res.url);
      onChange?.(res.id, res.url);
      message.success('Image uploaded successfully!');
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
        <div className="relative inline-block overflow-hidden rounded-xl border border-neutral-200 shadow-sm">
          <Image
            src={currentUrl}
            alt="Media preview"
            className="h-32 w-48 object-cover rounded-xl"
          />
          <Button
            type="primary"
            danger
            shape="circle"
            size="small"
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            className="absolute top-2 right-2 shadow-md"
          />
        </div>
      ) : (
        <Upload
          customRequest={handleCustomUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={loading} className="rounded-xl">
            {loading ? 'Uploading…' : 'Select Image'}
          </Button>
        </Upload>
      )}
    </div>
  );
}