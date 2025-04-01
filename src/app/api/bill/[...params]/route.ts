import { NextRequest, NextResponse } from 'next/server';

const OPENSTATES_API_URL = 'https://v3.openstates.org';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Extract parameters from the route
    const [jurisdictionId, session, billIdentifier] = params.params;
    
    if (!jurisdictionId || !session || !billIdentifier) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENSTATES_API_KEY;
    if (!apiKey) {
      throw new Error('OpenStates API key is not configured');
    }
    
    // For debugging
    console.log(`Bill Details Request: ${jurisdictionId}/${session}/${billIdentifier}`);
    console.log('OpenStates API Key:', apiKey);
    
    // Use mock data for development/debugging
    // This will allow us to test the UI without hitting API limits
    const mockBill = {
      id: 'ocd-bill/1234567890',
      title: 'A sample bill to regulate something important',
      identifier: billIdentifier,
      classification: ['bill'],
      subject: ['Health', 'Finance', 'Technology', 'Environment'],
      abstract: 'This is a sample bill abstract that explains what the bill is about. It provides a comprehensive overview of the legislation and its intended impact on various sectors including healthcare, financial services, and environmental protection.',
      session: session,
      jurisdiction: {
        name: jurisdictionId === 'ocd-jurisdiction/country:us/state:ny/government' ? 'New York' : 'California',
        id: jurisdictionId,
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
        },
        {
          date: '2023-03-05',
          description: 'Hearing scheduled',
          classification: ['committee-hearing'],
        },
        {
          date: '2023-03-20',
          description: 'Passed House',
          classification: ['passage'],
        },
        {
          date: '2023-04-05',
          description: 'Referred to Senate Committee',
          classification: ['referral-committee'],
        }
      ],
      documents: [
        {
          url: 'https://example.com/bill/123/text.pdf',
          note: 'Bill Text',
        },
        {
          url: 'https://example.com/bill/123/fiscal-impact.pdf',
          note: 'Fiscal Impact Statement',
        },
        {
          url: 'https://example.com/bill/123/committee-report.pdf',
          note: 'Committee Report',
        }
      ],
      votes: [
        {
          date: '2023-02-28',
          result: 'pass',
          counts: {
            yes: 12,
            no: 5,
            abstain: 1,
          }
        },
        {
          date: '2023-03-15',
          result: 'pass',
          counts: {
            yes: 35,
            no: 20,
            abstain: 2,
          }
        }
      ],
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
        },
        {
          url: 'https://example.com/bill/123/version3.pdf',
          note: 'Engrossed Version',
          date: '2023-03-25',
        }
      ],
      sponsorships: [
        {
          name: 'Jane Smith',
          primary: true,
          entity_type: 'person'
        },
        {
          name: 'John Doe',
          primary: false,
          entity_type: 'person'
        },
        {
          name: 'Alice Johnson',
          primary: false,
          entity_type: 'person'
        }
      ],
      updatedAt: '2023-04-10',
    };
    
    return NextResponse.json(mockBill);

    // The live API code below is commented out for now
    // We'll use mock data while debugging the API integration
    
    /*
    // Fetch bill details from the OpenStates API
    const response = await fetch(
      `${OPENSTATES_API_URL}/bills/${jurisdictionId}/${session}/${billIdentifier}`,
      {
        method: 'GET',
        headers: {
          'X-API-KEY': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenStates API Error:', response.status, errorText);
      throw new Error(`Failed to fetch bill details: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenStates API Response:', JSON.stringify(data).substring(0, 200) + '...');

    // Transform the data to match our frontend expectations
    const bill = {
      id: data.id,
      title: data.title,
      identifier: data.identifier,
      classification: data.classification || [],
      subject: data.subject || [],
      abstract: data.abstract,
      session: data.session,
      jurisdiction: {
        name: data.jurisdiction.name,
        id: data.jurisdiction.id,
      },
      primarySponsor: data.sponsors?.find((s: any) => s.primary)?.entity,
      actions: data.actions?.map((action: any) => ({
        date: action.date,
        description: action.description,
        classification: action.classification || [],
      })) || [],
      documents: data.documents || [],
      versions: data.versions || [],
      votes: data.votes?.map((vote: any) => ({
        date: vote.date,
        result: vote.result,
        counts: vote.counts,
      })) || [],
      sponsorships: data.sponsorships || [],
      updatedAt: data.updated_at,
    };

    return NextResponse.json(bill);
    */
  } catch (error) {
    console.error('Bill detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bill details' },
      { status: 500 }
    );
  }
} 