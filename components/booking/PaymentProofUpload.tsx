'use client';

import { Theme } from '@/types';
import Image from 'next/image';

interface PaymentProofUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
  theme: Theme;
}

export default function PaymentProofUpload({
  file,
  previewUrl,
  onFileChange,
  theme,
}: PaymentProofUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      onFileChange(null, null);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(selectedFile.type)) {
      alert('Format file tidak valid! Hanya JPG dan PNG yang diperbolehkan.');
      e.target.value = '';
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (selectedFile.size > maxSize) {
      alert('Ukuran file terlalu besar! Maksimal 2MB.');
      e.target.value = '';
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      onFileChange(selectedFile, event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 mb-2">
        Upload Bukti Transfer/DP <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          id="paymentProof"
          name="payment_proof"
          accept="image/jpeg,image/jpg,image/png"
          required
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="paymentProof"
          className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-${theme.accentColor}-400 hover:bg-${theme.accentColor}-50/30 transition-all`}
        >
          {!previewUrl ? (
            <div className="text-center">
              <svg className="w-12 h-12 text-zinc-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm font-semibold text-zinc-700 mb-1">
                Klik untuk upload bukti transfer
              </p>
              <p className="text-xs text-zinc-500">JPG, PNG (Max. 2MB)</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="relative w-full max-h-48 mx-auto rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain"
                />
              </div>
              {file && (
                <p className="text-sm text-zinc-600 mt-2 text-center truncate">
                  {file.name}
                </p>
              )}
              <p className="text-xs text-zinc-500 mt-1 text-center">
                Klik untuk mengganti file
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
