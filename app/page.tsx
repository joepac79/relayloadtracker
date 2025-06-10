'use client';

import { useState } from 'react';
import CSVUpload from './components/CSVUpload';
import Dashboard from './components/Dashboard';
import { ThemeToggle } from './components/theme-toggle';

interface LoadData {
  [key: string]: string;
}

export default function Home() {
  const [loadData, setLoadData] = useState<LoadData[]>([]);

  const handleDataLoaded = (data: LoadData[]) => {
    setLoadData(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Logo and Title */}
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Company Logo" className="h-24 w-auto mb-1" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Amazon Intermodal Load Tracker
          </h1>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <CSVUpload onDataLoaded={handleDataLoaded} />
        </div>

        {loadData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <Dashboard data={loadData} />
          </div>
        )}
      </div>
    </main>
  );
}
