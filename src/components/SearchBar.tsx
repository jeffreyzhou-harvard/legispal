'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Bill {
  id: string;
  title: string;
  identifier: string;
  classification: string;
  subject: string;
  abstract: string;
  session: string;
  jurisdiction: {
    name: string;
    id: string;
  };
  primarySponsor: {
    name: string;
    id: string;
  };
  actions: Array<{
    date: string;
    description: string;
    classification: string;
  }>;
  documents: Array<{
    url: string;
    note: string;
  }>;
  votes: Array<{
    date: string;
    result: string;
    counts: {
      yes: number;
      no: number;
      abstain: number;
    };
  }>;
  updatedAt: string;
}

interface Filters {
  jurisdiction: string;
  session: string;
  classification: string;
  subject: string;
}

interface Pagination {
  hasNextPage: boolean;
  endCursor: string;
  currentPage: number;
  totalPages: number;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Bill[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    jurisdiction: '',
    session: '',
    classification: '',
    subject: '',
  });
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const router = useRouter();

  const handleSearch = async (page: number = 1) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    if (page === 1) {
      setSearchResults([]);
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          ...filters,
          page,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      if (page === 1) {
        setSearchResults(data.bills);
      } else {
        setSearchResults(prev => [...prev, ...data.bills]);
      }
      setPagination(data.pagination);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Failed to search bills. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handleLoadMore = () => {
    if (pagination && pagination.hasNextPage) {
      handleSearch(pagination.currentPage + 1);
    }
  };

  const handleBillSelect = (bill: Bill) => {
    // Store the bill data for the analysis page
    localStorage.setItem('currentAnalysis', JSON.stringify({
      title: bill.title,
      summary: bill.abstract,
      keyPoints: [
        `Bill ID: ${bill.identifier}`,
        `Jurisdiction: ${bill.jurisdiction.name}`,
        `Session: ${bill.session}`,
        `Primary Sponsor: ${bill.primarySponsor.name}`,
        `Latest Action: ${bill.actions[0]?.description} (${new Date(bill.actions[0]?.date).toLocaleDateString()})`,
        `Status: ${bill.classification}`,
        `Subject: ${bill.subject}`,
      ],
      impact: bill.abstract,
      recommendations: [],
      metadata: {
        documents: bill.documents,
        votes: bill.votes,
        actions: bill.actions,
      },
    }));
    
    // Redirect to the analysis page
    router.push('/analysis/new');
  };

  const getVoteColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'pass':
        return 'text-green-600';
      case 'fail':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for bills by title, number, or keyword..."
            className="w-full px-4 py-3 pl-8 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FunnelIcon className="h-3.5 w-3.5 text-gray-500" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurisdiction
              </label>
              <input
                type="text"
                value={filters.jurisdiction}
                onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
                placeholder="e.g., California"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session
              </label>
              <input
                type="text"
                value={filters.session}
                onChange={(e) => setFilters({ ...filters, session: e.target.value })}
                placeholder="e.g., 2023 Regular Session"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Classification
              </label>
              <input
                type="text"
                value={filters.classification}
                onChange={(e) => setFilters({ ...filters, classification: e.target.value })}
                placeholder="e.g., Bill"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                placeholder="e.g., Education"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
          {searchResults.map((bill) => (
            <div
              key={bill.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => handleBillSelect(bill)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 text-lg">{bill.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{bill.identifier}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {bill.classification}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{bill.abstract}</p>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Jurisdiction:</span>
                  <span className="ml-1 text-gray-900">{bill.jurisdiction.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Session:</span>
                  <span className="ml-1 text-gray-900">{bill.session}</span>
                </div>
                <div>
                  <span className="text-gray-500">Sponsor:</span>
                  <span className="ml-1 text-gray-900">{bill.primarySponsor.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Subject:</span>
                  <span className="ml-1 text-gray-900">{bill.subject}</span>
                </div>
              </div>

              {bill.actions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Latest Action</h5>
                  <p className="text-sm text-gray-600">
                    {bill.actions[0].description}
                    <span className="text-gray-400 ml-2">
                      ({new Date(bill.actions[0].date).toLocaleDateString()})
                    </span>
                  </p>
                </div>
              )}

              {bill.votes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Latest Vote</h5>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getVoteColor(bill.votes[0].result)}`}>
                      {bill.votes[0].result}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({bill.votes[0].counts.yes} Yes, {bill.votes[0].counts.no} No, {bill.votes[0].counts.abstain} Abstain)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {pagination && pagination.hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isSearching}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    Loading more...
                  </>
                ) : (
                  <>
                    Load More
                    <ChevronRightIcon className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Try searching for:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Bill numbers (e.g., "HB 1234")</li>
          <li>Keywords (e.g., "climate change", "healthcare")</li>
          <li>Bill titles</li>
        </ul>
      </div>
    </div>
  );
} 