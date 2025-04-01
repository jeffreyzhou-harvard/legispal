'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (file.type === 'application/pdf') {
        // For PDF files, we'll need to implement PDF text extraction
        // For now, we'll just show an error
        reject(new Error('PDF support coming soon'));
      } else {
        reader.readAsText(file);
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);

    try {
      const fileContent = await readFileContent(file);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fileContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze bill');
      }

      const analysis = await response.json();
      
      // Store the analysis in localStorage for the analysis page to access
      localStorage.setItem('currentAnalysis', JSON.stringify(analysis));
      
      // Redirect to the analysis page
      router.push('/analysis/new');
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze bill');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/50'}`}
      >
        <input {...getInputProps()} />
        <DocumentTextIcon className="mx-auto h-12 w-12 text-indigo-600" />
        <p className="mt-2 text-gray-600">
          {isDragActive
            ? 'Drop the file here'
            : 'Drag and drop a bill document here, or click to select'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Supported formats: PDF, DOC, DOCX, TXT
        </p>
      </div>

      {file && (
        <div className="mt-4">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              'Analyze Bill'
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
} 