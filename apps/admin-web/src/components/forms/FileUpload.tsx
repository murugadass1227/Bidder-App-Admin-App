'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Upload, 
  X, 
  FileImage, 
  FileVideo, 
  FileText,
  Eye,
  Trash2,
  Download
} from 'lucide-react';
import { LotFile } from '@/types';

interface FileUploadProps {
  files: LotFile[];
  onFilesChange: (files: LotFile[]) => void;
  type: 'images' | 'videos' | 'documents';
  maxFiles?: number;
  accept?: string;
  disabled?: boolean;
}

const fileTypes = {
  images: {
    accept: 'image/*',
    icon: FileImage,
    label: 'Images',
    maxFiles: 20,
  },
  videos: {
    accept: 'video/*',
    icon: FileVideo,
    label: 'Videos',
    maxFiles: 5,
  },
  documents: {
    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    icon: FileText,
    label: 'Documents',
    maxFiles: 10,
  },
};

const accessLevels = [
  { value: 'public', label: 'Public' },
  { value: 'bidder_only', label: 'Bidder Only' },
  { value: 'winner_only', label: 'Winner Only' },
];

export function FileUpload({ 
  files, 
  onFilesChange, 
  type, 
  maxFiles, 
  accept, 
  disabled = false 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const config = fileTypes[type];
  const maxFileCount = maxFiles || config.maxFiles;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (newFiles: File[]) => {
    if (disabled) return;
    
    const remainingSlots = maxFileCount - files.length;
    const filesToProcess = newFiles.slice(0, remainingSlots);
    
    if (filesToProcess.length === 0) {
      alert(`Maximum ${maxFileCount} files allowed`);
      return;
    }

    setUploading(true);
    
    try {
      const processedFiles: LotFile[] = await Promise.all(
        filesToProcess.map(async (file) => {
          // Simulate file upload
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return {
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url: URL.createObjectURL(file), // In production, this would be the actual URL
            accessLevel: 'public' as const,
            uploadedAt: new Date(),
          };
        })
      );

      onFilesChange([...files, ...processedFiles]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    if (disabled) return;
    onFilesChange(files.filter(file => file.id !== fileId));
  };

  const updateFileAccess = (fileId: string, accessLevel: 'public' | 'bidder_only' | 'winner_only') => {
    if (disabled) return;
    onFilesChange(
      files.map(file => 
        file.id === fileId ? { ...file, accessLevel } : file
      )
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {files.length < maxFileCount && (
        <Card className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <CardContent className="p-6">
            <div
              className="text-center"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  {uploading ? 'Uploading...' : `Upload ${config.label}`}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-400">
                  {files.length}/{maxFileCount} files uploaded
                </p>
              </div>
              <input
                type="file"
                multiple
                accept={accept || config.accept}
                onChange={handleFileInput}
                disabled={disabled || uploading}
                className="hidden"
                id={`file-upload-${type}`}
              />
              <Button
                type="button"
                variant="outline"
                disabled={disabled || uploading}
                className="mt-4"
                onClick={() => document.getElementById(`file-upload-${type}`)?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Select Files'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {file.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={file.accessLevel}
                      onValueChange={(value: any) => updateFileAccess(file.id, value)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {accessLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={disabled}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
