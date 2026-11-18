import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  HardDrive,
  ShieldCheck,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Folder,
  Lock,
  Layers,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { driveApi } from '../api/driveApi';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/fileHelpers';

export const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, driveStatus, refreshDriveStatus, refreshUser } = useAuth();
  const toast = useToast();

  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);

  useEffect(() => {
    const driveParam = searchParams.get('drive');
    const errorParam = searchParams.get('drive_error');

    if (driveParam === 'connected') {
      toast.success('Google Drive connected successfully!');
      refreshDriveStatus();
      refreshUser();
      setSearchParams(new URLSearchParams());
    } else if (errorParam) {
      toast.error(`Google Drive connection failed: ${decodeURIComponent(errorParam)}`);
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, refreshDriveStatus, refreshUser, setSearchParams, toast]);

  const handleConnectDrive = async () => {
    setConnecting(true);
    try {
      const res = await driveApi.connect();
      if (res.success && res.data.authUrl) {
        // Redirect browser to Google's OAuth consent screen
        window.location.href = res.data.authUrl;
      }
    } catch (err) {
      toast.error(err.message || 'Could not initiate Google OAuth');
      setConnecting(false);
    }
  };

  const handleDisconnectConfirm = async () => {
    setDisconnecting(true);
    try {
      const res = await driveApi.disconnect();
      if (res.success) {
        toast.info('Google Drive disconnected');
        setDisconnectDialogOpen(false);
        refreshDriveStatus();
        refreshUser();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to disconnect Google Drive');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="space-y-3.5 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings & Cloud Storage
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
          Manage your connected Google Drive storage, account profile, and security preferences.
        </p>
      </div>

      {/* Cloud Storage (Google Drive) Section */}
      <div className="bg-white dark:bg-surface-dark-card rounded-xl sm:rounded-2xl border border-gray-200/90 dark:border-surface-dark-border p-3.5 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-3 sm:pb-5 border-b border-gray-100 dark:border-surface-dark-border">
          <div className="flex items-start gap-2.5 sm:gap-3.5">
            <div className="flex items-center justify-center flex-shrink-0 text-black dark:text-white pt-1">
              <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-black dark:text-white" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
                  Google Drive Integration
                </h3>
                {driveStatus?.connected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.2 rounded-full">
                    <AlertCircle className="w-3 h-3" /> Disconnected
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                Files are stored directly in your personal Google Drive inside a dedicated <code>/Asnad</code> folder.
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            {driveStatus?.connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDisconnectDialogOpen(true)}
                className="text-brand-red border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                Disconnect Drive
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={HardDrive}
                onClick={handleConnectDrive}
                loading={connecting}
              >
                Connect Google Drive
              </Button>
            )}
          </div>
        </div>

        {driveStatus?.connected ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-border/30 border border-gray-100 dark:border-surface-dark-border space-y-1">
              <span className="text-gray-400 font-medium">Google Account Email</span>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                {driveStatus.googleEmail || 'Linked Account'}
              </p>
              {driveStatus.connectedAt && (
                <p className="text-[11px] text-gray-400">
                  Connected on {formatDate(driveStatus.connectedAt)}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-border/30 border border-gray-100 dark:border-surface-dark-border space-y-1">
              <span className="text-gray-400 font-medium flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-brand-yellow" />
                Dedicated Storage Folder
              </span>
              <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                /Asnad
              </p>
              <p className="text-[11px] text-gray-400 font-mono truncate">
                Folder ID: {driveStatus.driveFolderId || 'Auto-created'}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Why connect Google Drive?</span>
              Asnad does not store your private documents on our servers. Connecting your Google Drive gives you full control and ownership of your files while giving you Asnad's fast, modern vault interface.
            </div>
          </div>
        )}
      </div>

      {/* Vault Management (Trash Bin Quick Link) */}
      <div className="bg-white dark:bg-surface-dark-card rounded-xl sm:rounded-2xl border border-gray-200/90 dark:border-surface-dark-border p-3.5 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center flex-shrink-0 text-black dark:text-white">
            <Trash2 className="w-5 h-5 text-black dark:text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-gray-100">Trash Bin</h4>
            <p className="text-[10px] sm:text-xs text-gray-500">Restore or permanently delete removed documents</p>
          </div>
        </div>
        <Link to="/trash">
          <Button variant="outline" size="sm" icon={ExternalLink} className="text-xs py-1 px-2.5">
            Open Trash
          </Button>
        </Link>
      </div>

      {/* User Account Profile */}
      <div className="bg-white dark:bg-surface-dark-card rounded-2xl border border-gray-200/90 dark:border-surface-dark-border p-6 shadow-sm space-y-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <User className="w-4 h-4 text-brand-blue" />
          Account Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-border/30 border border-gray-100 dark:border-surface-dark-border space-y-1">
            <span className="text-gray-400 font-medium">Full Name</span>
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
              {user?.name}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-border/30 border border-gray-100 dark:border-surface-dark-border space-y-1">
            <span className="text-gray-400 font-medium">Email Address</span>
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
              {user?.email}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-border/30 border border-gray-100 dark:border-surface-dark-border space-y-1">
            <span className="text-gray-400 font-medium">Account Status</span>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm capitalize">
              {user?.status || 'Active'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-surface-dark-border/30 border border-gray-100 dark:border-surface-dark-border space-y-1">
            <span className="text-gray-400 font-medium">Member Since</span>
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Security & Architecture Highlights */}
      <div className="bg-white dark:bg-surface-dark-card rounded-2xl border border-gray-200/90 dark:border-surface-dark-border p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-green" />
          Security Architecture
        </h3>

        <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800 dark:text-gray-200">AES-256-GCM Token Encryption:</strong> All Google OAuth refresh tokens are encrypted at rest with authenticated encryption (using GCM mode with unique nonces and auth tags).
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <HardDrive className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800 dark:text-gray-200">User-Owned Storage Guarantee:</strong> Documents are never stored in Asnad’s filesystem or MongoDB. Only metadata and file references are saved in your personal database records.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Layers className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800 dark:text-gray-200">Minimum Scope Principle:</strong> Asnad only requests <code>drive.file</code> scope. Asnad cannot read or modify any files outside the ones you create or explicitly choose in Asnad.
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Google Drive Dialog */}
      <ConfirmDialog
        isOpen={disconnectDialogOpen}
        onClose={() => setDisconnectDialogOpen(false)}
        onConfirm={handleDisconnectConfirm}
        title="Disconnect Google Drive?"
        message="Asnad will revoke access to your Google Drive. Your existing files in your Google Drive will NOT be deleted."
        confirmText="Disconnect"
        variant="danger"
        loading={disconnecting}
      />
    </div>
  );
};
