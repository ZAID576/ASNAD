import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  UploadCloud,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  FolderTree,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { documentApi } from '../../api/documentApi';
import { categoryApi } from '../../api/categoryApi';
import { formatBytes } from '../../utils/fileHelpers';
import { GooglePickerModal } from './GooglePickerModal';

export const DocumentUploaderModal = ({ isOpen, onClose, onSuccess }) => {
  const { driveStatus } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [pickerModalOpen, setPickerModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      categoryApi.list().then((res) => {
        if (res.success) setCategories(res.data.categories || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selected) => {
    // Allows any file size accepted by user's personal Google Drive
    setFile(selected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    if (!driveStatus?.connected) {
      toast.error('Please connect your Google Drive first in Settings');
      navigate('/settings');
      onClose();
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Step 1: Initiate Google Drive direct upload session
      const initRes = await documentApi.initiateUpload({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
      });

      if (initRes.success && initRes.data?.uploadUrl) {
        const uploadUrl = initRes.data.uploadUrl;

        // Step 2: Upload file directly to Google Drive via XMLHttpRequest for real-time progress
        const driveData = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadUrl, true);
          xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const percent = Math.round((evt.loaded / evt.total) * 100);
              setProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const parsed = JSON.parse(xhr.responseText);
                resolve(parsed);
              } catch (e) {
                resolve({ id: null });
              }
            } else {
              reject(new Error(`Google Drive upload failed (${xhr.status})`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during Google Drive upload'));
          xhr.send(file);
        });

        // Step 3: Register uploaded document in MongoDB
        const driveFileId = driveData?.id;
        const completeRes = await documentApi.completeUpload({
          driveFileId,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          categoryId: categoryId || null,
        });

        if (completeRes.success) {
          toast.success(`"${file.name}" uploaded to Google Drive successfully!`);
          setFile(null);
          setProgress(0);
          onClose();
          if (onSuccess) onSuccess(completeRes.data.document);
        }
      } else {
        throw new Error('Could not initiate upload session');
      }
    } catch (directErr) {
      console.warn('Direct upload fallback triggering:', directErr);
      // Fallback: standard multipart upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        if (categoryId) {
          formData.append('categoryId', categoryId);
        }

        const res = await documentApi.upload(formData, (percent) => {
          setProgress(percent);
        });

        if (res.success) {
          toast.success(`"${file.name}" uploaded to Google Drive successfully!`);
          setFile(null);
          setProgress(0);
          onClose();
          if (onSuccess) onSuccess(res.data.document);
        }
      } catch (fallbackErr) {
        toast.error(fallbackErr.message || directErr.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          if (!uploading) {
            setFile(null);
            setProgress(0);
            onClose();
          }
        }}
        title="Upload Document"
        subtitle="Files are saved securely in your own connected Google Drive (/Asnad)"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Drive check warning banner if not connected */}
          {!driveStatus?.connected && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block mb-0.5">Google Drive Not Connected</span>
                Files are stored directly in your personal Drive. Connect Drive to start uploading.
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      navigate('/settings');
                    }}
                    className="text-xs py-1"
                  >
                    Go to Cloud Settings
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* File drop zone */}
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-gray-200 dark:border-surface-dark-border hover:border-gray-300 dark:hover:border-gray-700 bg-gray-50/50 dark:bg-surface-dark-border/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex items-center justify-center mb-3 text-black dark:text-white">
                <UploadCloud className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Drag and drop your file here, or <span className="text-brand-blue underline">browse</span>
              </h4>
              <p className="text-xs text-gray-500 max-w-xs">
                Supports Videos, Photos, Documents, PDFs, and all files saved to your Google Drive
              </p>
            </div>
          ) : (
            <div className="p-4 border border-gray-200 dark:border-surface-dark-border rounded-xl bg-gray-50/60 dark:bg-surface-dark-border/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center flex-shrink-0 text-black dark:text-white">
                  <File className="w-6 h-6 text-black dark:text-white" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={() => setFile(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Progress bar */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Streaming to Google Drive...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-surface-dark-border h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-blue h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={uploading}
              className="w-full rounded-lg border border-gray-300 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-900 dark:text-gray-100 text-sm py-2 px-3 focus:outline-none focus:border-brand-blue disabled:opacity-60"
            >
              <option value="">(No Category - Uncategorized)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-surface-dark-border"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-400 font-medium uppercase">Or</span>
            <div className="flex-grow border-t border-gray-200 dark:border-surface-dark-border"></div>
          </div>

          {/* Alternative action: Pick from Google Drive directly */}
          <Button
            variant="outline"
            size="md"
            icon={HardDrive}
            onClick={() => {
              onClose();
              setPickerModalOpen(true);
            }}
            className="w-full text-xs font-medium"
          >
            Select Existing File from Google Drive
          </Button>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-surface-dark-border">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              loading={uploading}
              disabled={!file || !driveStatus?.connected}
              icon={UploadCloud}
            >
              Upload to Drive
            </Button>
          </div>
        </div>
      </Modal>

      {/* Google Picker Modal */}
      <GooglePickerModal
        isOpen={pickerModalOpen}
        onClose={() => setPickerModalOpen(false)}
        categories={categories}
        onSuccess={(doc) => {
          if (onSuccess) onSuccess(doc);
        }}
      />
    </>
  );
};
