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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Logo and Theme Toggle */}
        <div className="flex justify-between items-center">
          <img src="/logo.png" alt="Company Logo" className="h-16 w-auto" />
          <ThemeToggle />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Amazon Intermodal Load Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your CSV file to track and analyze your intermodal loads
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <CSVUpload onDataLoaded={handleDataLoaded} />
        </div>

        {loadData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <Dashboard data={loadData} />
          </div>
        )}
      </div>
    </main>
  );
} 