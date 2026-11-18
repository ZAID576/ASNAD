import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-[#0E1217] flex flex-col items-center justify-center p-4 text-center">
      <div className="flex items-center justify-center mb-4 text-black dark:text-white">
        <FileQuestion className="w-12 h-12 text-black dark:text-white" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" size="md" icon={ArrowLeft}>
          Back to Vault
        </Button>
      </Link>
    </div>
  );
};
