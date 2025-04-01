import { NextResponse } from 'next/server';

// Update to use the v3 API
const OPENSTATES_API_URL = 'https://v3.openstates.org';

export async function POST(request: Request) {
  try {
    const { query, jurisdiction, session, classification, subject, page = 1 } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENSTATES_API_KEY;
    if (!apiKey) {
      throw new Error('OpenStates API key is not configured');
    }

    // For debugging
    console.log('OpenStates API Key:', apiKey);
    
    // Use mock data for development/debugging
    // This will allow us to test the UI without hitting API limits
    const mockData = {
      bills: [
        {
          id: 'ocd-bill/1234567890',
          title: 'A sample bill to regulate something important',
          identifier: 'HB 123',
          classification: ['bill'],
          subject: ['Health', 'Finance'],
          abstract: 'This is a sample bill abstract that explains what the bill is about.',
          session: '2023',
          jurisdiction: {
            name: 'New York',
            id: 'ocd-jurisdiction/country:us/state:ny/government',
          },
          primarySponsor: {
            name: 'Jane Smith',
            id: 'ocd-person/abcdef1234567890',
          },
          actions: [
            {
              date: '2023-01-15',
              description: 'Introduced in House',
              classification: ['introduction', 'referred-to-committee'],
            },
            {
              date: '2023-02-10',
              description: 'Passed House Committee',
              classification: ['committee-passage'],
            }
          ],
          documents: [
            {
              url: 'https://example.com/bill/123/text.pdf',
              note: 'Bill Text',
            }
          ],
          votes: [
            {
              date: '2023-03-01',
              result: 'pass',
              counts: {
                yes: 35,
                no: 20,
                abstain: 2,
              }
            }
          ],
          updatedAt: '2023-03-05',
          versions: [
            {
              url: 'https://example.com/bill/123/version1.pdf',
              note: 'Introduced Version',
              date: '2023-01-15',
            },
            {
              url: 'https://example.com/bill/123/version2.pdf',
              note: 'Amended Version',
              date: '2023-02-28',
            }
          ]
        },
        {
          id: 'ocd-bill/0987654321',
          title: 'An act concerning education reform',
          identifier: 'SB 456',
          classification: ['bill'],
          subject: ['Education', 'Budget'],
          abstract: 'This bill reforms the education system.',
          session: '2023',
          jurisdiction: {
            name: 'New York',
            id: 'ocd-jurisdiction/country:us/state:ny/government',
          },
          primarySponsor: {
            name: 'John Doe',
            id: 'ocd-person/fedcba0987654321',
          },
          actions: [
            {
              date: '2023-01-20',
              description: 'Introduced in Senate',
              classification: ['introduction', 'referred-to-committee'],
            }
          ],
          documents: [
            {
              url: 'https://example.com/bill/456/text.pdf',
              note: 'Bill Text',
            }
          ],
          votes: [],
          updatedAt: '2023-01-25',
          versions: [
            {
              url: 'https://example.com/bill/456/version1.pdf',
              note: 'Introduced Version',
              date: '2023-01-20',
            }
          ]
        }
      ],
      pagination: {
        total_pages: 1,
        total_items: 2,
        page: 1,
        per_page: 10
      }
    };
    
    return NextResponse.json({
      bills: mockData.bills,
      pagination: {
        hasNextPage: mockData.pagination.total_pages > page,
        endCursor: null,
        currentPage: page,
        totalPages: mockData.pagination.total_pages,
        totalItems: mockData.pagination.total_items,
      },
    });

    // The live API code below is commented out for now
    // We'll use mock data while debugging the API integration
    
    /*
    // Construct query parameters for the bills search endpoint
    const params = new URLSearchParams();
    
    // Required parameters
    params.append('query', query);
    params.append('apikey', apiKey);
    
    // Optional parameters
    if (jurisdiction) params.append('jurisdiction', jurisdiction);
    if (session) params.append('session', session);
    if (classification) params.append('classification', classification);
    if (subject) params.append('subject', subject);
    params.append('page', page.toString());
    params.append('per_page', '10');
    
    // Log the constructed URL for debugging (without API key)
    const debugUrl = `${OPENSTATES_API_URL}/bills?${new URLSearchParams({
      query,
      ...(jurisdiction && { jurisdiction }),
      ...(session && { session }),
      ...(classification && { classification }),
      ...(subject && { subject }),
      page: page.toString(),
      per_page: '10'
    }).toString()}`;
    
    console.log('Requesting URL:', debugUrl);
    
    // Use the REST API endpoint for bill search
    const response = await fetch(`${OPENSTATES_API_URL}/bills?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenStates API Error:', response.status, errorText);
      throw new Error(`Failed to fetch from Open States API: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('OpenStates API Response:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Transform the data to match our frontend expectations
    const bills = data.results.map((bill: any) => ({
      id: bill.id,
      title: bill.title,
      identifier: bill.identifier,
      classification: bill.classification || [],
      subject: bill.subject || [],
      abstract: bill.abstract,
      session: bill.session,
      jurisdiction: {
        name: bill.jurisdiction.name,
        id: bill.jurisdiction.id,
      },
      primarySponsor: bill.sponsors?.find((s: any) => s.primary)?.entity,
      actions: bill.actions?.map((action: any) => ({
        date: action.date,
        description: action.description,
        classification: action.classification || [],
      })) || [],
      documents: bill.documents || [],
      votes: bill.votes?.map((vote: any) => ({
        date: vote.date,
        result: vote.result,
        counts: vote.counts,
      })) || [],
      versions: bill.versions || [],
      updatedAt: bill.updated_at,
    }));
    
    return NextResponse.json({
      bills,
      pagination: {
        hasNextPage: data.pagination.total_pages > page,
        endCursor: null, // API v3 doesn't use cursors
        currentPage: page,
        totalPages: data.pagination.total_pages || 1,
        totalItems: data.pagination.total_items || 0,
      },
    });
    */
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search bills' },
      { status: 500 }
    );
  }
} 