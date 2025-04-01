'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BillAnalysis {
  title: string;
  summary: string;
  keyPoints: string[];
  impact: string;
  recommendations: string[];
}

export default function AnalysisPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<BillAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Check if this is a new analysis
        if (params.id === 'new') {
          const storedAnalysis = localStorage.getItem('currentAnalysis');
          if (storedAnalysis) {
            setAnalysis(JSON.parse(storedAnalysis));
            localStorage.removeItem('currentAnalysis'); // Clean up
            setLoading(false);
            return;
          }
        }

        // TODO: Implement API call to fetch existing analysis
        // For now, using mock data
        const mockAnalysis: BillAnalysis = {
          title: "Sample Bill Analysis",
          summary: "This is a comprehensive analysis of the proposed legislation...",
          keyPoints: [
            "Key point 1",
            "Key point 2",
            "Key point 3"
          ],
          impact: "The bill will have significant impact on...",
          recommendations: [
            "Recommendation 1",
            "Recommendation 2"
          ]
        };
        
        setAnalysis(mockAnalysis);
      } catch (err) {
        setError('Failed to load analysis');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">No analysis found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{analysis.title}</h1>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <p className="text-gray-700">{analysis.summary}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Key Points</h2>
            <ul className="list-disc list-inside space-y-2">
              {analysis.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Impact Analysis</h2>
            <p className="text-gray-700">{analysis.impact}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
} 