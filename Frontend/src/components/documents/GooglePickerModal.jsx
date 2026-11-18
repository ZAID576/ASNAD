import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { HardDrive, Copy, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';
import { driveApi } from '../../api/driveApi';
import { documentApi } from '../../api/documentApi';
import { useToast } from '../../context/ToastContext';

export const GooglePickerModal = ({
  isOpen,
  onClose,
  categories = [],
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('drive_import_link');
  const [categoryId, setCategoryId] = useState('');
  const [importing, setImporting] = useState(false);
  const toast = useToast();

  const launchPicker = async () => {
    setLoading(true);
    try {
      const res = await driveApi.getToken();
      if (!res.success || !res.data) {
        throw new Error('Failed to retrieve Picker authentication token');
      }

      const { accessToken, apiKey, projectNumber } = res.data;

      // Ensure window.gapi is loaded
      if (!window.gapi) {
        throw new Error('Google Picker API script is still loading. Please try again in a moment.');
      }

      window.gapi.load('picker', () => {
        try {
          const view = new window.google.picker.DocsView()
            .setIncludeFolders(true)
            .setSelectFolderEnabled(false);

          if (!apiKey || !apiKey.startsWith('AIzaSy')) {
            throw new Error('Google Picker API Key is missing or invalid. Please create a Google API Key in Google Cloud Console and set GOOGLE_PICKER_API_KEY in your environment variables.');
          }

          const picker = new window.google.picker.PickerBuilder()
            .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
            .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(projectNumber)
            .setOAuthToken(accessToken)
            .addView(view)
            .setDeveloperKey(apiKey)
            .setCallback((data) => {
              if (data.action === window.google.picker.Action.PICKED) {
                const doc = data.docs[0];
                setSelectedFile({
                  id: doc.id,
                  name: doc.name,
                  mimeType: doc.mimeType,
                  size: doc.sizeBytes || 0,
                  url: doc.url,
                });
              }
              setLoading(false);
            })
            .build();

          picker.setVisible(true);
        } catch (pickerErr) {
          console.error('Picker Builder Error:', pickerErr);
          toast.error('Could not display Google Picker: ' + pickerErr.message);
          setLoading(false);
        }
      });
    } catch (err) {
      toast.error(err.message || 'Could not launch Google Picker');
      setLoading(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;

    setImporting(true);
    try {
      const res = await documentApi.importFromDrive({
        driveFileId: selectedFile.id,
        name: selectedFile.name,
        mimeType: selectedFile.mimeType,
        size: selectedFile.size,
        importType,
        categoryId: categoryId || null,
      });

      if (res.success) {
        toast.success(`"${selectedFile.name}" imported successfully`);
        setSelectedFile(null);
        onClose();
        if (onSuccess) onSuccess(res.data.document);
      }
    } catch (err) {
      toast.error(err.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedFile(null);
        onClose();
      }}
      title="Import from Google Drive"
      subtitle="Select an existing document from your personal Google Drive"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-surface-dark-border rounded-xl text-center">
            <div className="flex items-center justify-center mb-3 text-black dark:text-white">
              <HardDrive className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Select Google Drive File
            </h4>
            <p className="text-xs text-gray-500 mb-5 max-w-xs">
              Opens the secure Google Picker dialog to choose any file in your Drive.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={launchPicker}
              loading={loading}
              icon={HardDrive}
            >
              Open Google Picker
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl">
              <span className="text-[11px] font-semibold text-brand-blue uppercase tracking-wider block mb-1">
                Selected File
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{selectedFile.mimeType}</p>
            </div>

            {/* Import Mode selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Import Method
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => setImportType('drive_import_link')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    importType === 'drive_import_link'
                      ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-gray-200 dark:border-surface-dark-border hover:bg-gray-50 dark:hover:bg-surface-dark-border/40'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-gray-900 dark:text-gray-100 mb-1">
                    <LinkIcon className="w-3.5 h-3.5 text-brand-blue" />
                    Link Only
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Keep file in its current Drive folder. No duplicate created.
                  </p>
                </div>

                <div
                  onClick={() => setImportType('drive_import_copy')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    importType === 'drive_import_copy'
                      ? 'border-brand-blue bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-gray-200 dark:border-surface-dark-border hover:bg-gray-50 dark:hover:bg-surface-dark-border/40'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs text-gray-900 dark:text-gray-100 mb-1">
                    <Copy className="w-3.5 h-3.5 text-brand-blue" />
                    Copy to Asnad
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Duplicate into your dedicated /Asnad Drive folder.
                  </p>
                </div>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Assign Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-surface-dark-border bg-white dark:bg-surface-dark-card text-gray-900 dark:text-gray-100 text-sm py-2 px-3 focus:outline-none focus:border-brand-blue"
              >
                <option value="">(No Category - Uncategorized)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                disabled={importing}
              >
                Change File
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmImport}
                loading={importing}
              >
                Import Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
