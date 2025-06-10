'use client';

import { useState } from 'react';
import Papa from 'papaparse';

interface CSVData {
  [key: string]: string;
}

interface CSVUploadProps {
  onDataLoaded: (data: CSVData[]) => void;
}

export default function CSVUpload({ onDataLoaded }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        onDataLoaded(results.data as CSVData[]);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the file format.');
      },
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFileUpload(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div
      className={`p-4 border-2 border-dashed rounded-lg text-center max-w-xs mx-auto ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-2">
        <div className="text-gray-600">
          <p className="text-base font-medium">Drag and drop your CSV file here</p>
          <p className="text-xs">or</p>
        </div>
        <label className="inline-block px-2 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 text-sm">
          Browse Files
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
