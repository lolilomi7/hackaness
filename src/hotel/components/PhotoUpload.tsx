import { useRef, useState } from 'react';
import { HOTEL_COLORS } from '../theme';
import { uploadStayPhoto } from '../../lib/photos';
import PhotoGallery from './PhotoGallery';

interface PhotoUploadProps {
  stayId: string;
  paths: string[];
  onChange: (paths: string[]) => void;
  showGallery?: boolean;
}

export default function PhotoUpload({
  stayId,
  paths,
  onChange,
  showGallery = true,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const nextPaths = [...paths];
    let lastError: string | null = null;
    for (const file of Array.from(files)) {
      const result = await uploadStayPhoto(stayId, file);
      if (result.path) {
        nextPaths.push(result.path);
      } else {
        lastError = result.error ?? 'Some photos could not be uploaded.';
      }
    }
    if (nextPaths.length !== paths.length) onChange(nextPaths);
    if (lastError) setError(lastError);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      {showGallery && <PhotoGallery paths={paths} />}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        id={`photo-input-${stayId}`}
      />
      <label
        htmlFor={`photo-input-${stayId}`}
        className="cursor-pointer self-start rounded-full border px-3 py-1 text-xs"
        style={{
          borderColor: HOTEL_COLORS.brass,
          color: HOTEL_COLORS.parchment,
          opacity: uploading ? 0.6 : 1,
        }}
      >
        {uploading ? 'Uploading…' : 'Add a photo'}
      </label>
      {error && (
        <p className="text-xs" style={{ color: '#a54848' }}>
          {error}
        </p>
      )}
    </div>
  );
}
