'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  currentImage: string;
  onImageUpload: (url: string) => void;
}

export default function ImageUpload({
  currentImage,
  onImageUpload,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Helper function to ensure image URL is complete
  const getImageUrl = (url: string) => {
    if (!url) return '';
    // If it's an upload path, make sure it's an absolute path
    if (url.startsWith('/uploads/')) {
      return url; // This is already absolute from the site root
    }
    return url;
  };

  const handleUpload = async (file: File) => {
    setError('');
    setIsUploading(true);
    
    console.log(`Uploading file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        console.error('Upload failed with status:', response.status);
        console.error('Error details:', data);
        throw new Error(data.error || 'Upload failed');
      }

      if (!data.url) {
        console.error('Invalid response format, missing URL:', data);
        throw new Error('Invalid server response');
      }

      console.log('Upload successful, URL:', data.url);
      onImageUpload(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      if (err instanceof Error) {
        setError(`Upload failed: ${err.message}`);
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleUpload(file);
    } else {
      setError('Please upload an image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  // Use the actual image URL for displaying
  const displayImageUrl = getImageUrl(currentImage);

  return (
    <div className="space-y-4">
      <div
        className={`relative h-64 border-2 border-dashed rounded-lg overflow-hidden transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <AnimatePresence>
          {displayImageUrl && !isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {displayImageUrl.startsWith('/uploads/') ? (
                // Use img tag for local uploads to avoid Next.js Image component path issues
                <img
                  src={displayImageUrl}
                  alt="Uploaded image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={displayImageUrl}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  unoptimized={displayImageUrl.startsWith('/uploads/')}
                />
              )}
              <div className="absolute inset-0 bg-black/40 transition-opacity opacity-0 hover:opacity-100">
                <div className="flex items-center justify-center h-full">
                  <span className="text-white text-sm">
                    Drop new image or click to change
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!displayImageUrl && !isUploading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">
                Drop image here or click to upload
              </div>
              <div className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                PNG, JPG, GIF up to 5MB
              </div>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-primary-600 dark:text-primary-400">
              Uploading...
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
} 