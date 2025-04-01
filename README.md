# LegisPal

LegisPal is an AI-powered legislative bill analysis tool that helps users understand and analyze government bills using ChatGPT. The application allows users to search for existing bills or upload their own documents for analysis.

## Features

- Search for government bills
- Upload and analyze bill documents (PDF, DOC, DOCX, TXT)
- AI-powered analysis using ChatGPT
- Comprehensive insights including:
  - Bill summary
  - Key points
  - Impact analysis
  - Recommendations

## Prerequisites

- Node.js 18.x or later
- OpenAI API key
- Open States API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/legispal.git
cd legispal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```
OPENAI_API_KEY=your_api_key_here
OPENSTATES_API_KEY=your_openstates_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Search for Bills**
   - Use the search bar to find existing bills
   - Enter keywords, bill numbers, or titles

2. **Upload Bills**
   - Drag and drop a bill document or click to select
   - Supported formats: PDF, DOC, DOCX, TXT
   - Wait for the AI analysis to complete

3. **View Analysis**
   - Read the comprehensive analysis
   - Review key points, impact, and recommendations
   - Share or save the analysis for future reference

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- React Dropzone
- Open States API

## Open States API Integration

LegisPal integrates with the [Open States API](https://v3.openstates.org/) to provide access to real legislative data from state governments across the United States. The API enables the following functionality:

### Bill Search
- Users can search for bills across state legislatures using keywords, bill numbers, or topics
- The application queries the Open States API v3 to retrieve relevant legislation based on search criteria
- Search results include essential information such as bill title, identifier, jurisdiction, session, and sponsor

### Bill Details
- Upon selecting a bill from search results, the application fetches comprehensive bill information including:
  - Full bill text and abstracts
  - Sponsorship information
  - Bill versions and related documents
  - Voting records and results
  - Legislative actions and timeline
  - Subject classifications

### Implementation
- The application implements two main API endpoints:
  - `/api/search` - Handles bill search queries and returns formatted results
  - `/api/bill/[...params]` - Retrieves detailed information for specific bills

### Development Mode
- For development and testing purposes, the application can use mock data to reduce API usage while building features
- This allows for UI development without hitting API rate limits
- **Note:** The current implementation is configured to use mock data by default. To enable live API calls, uncomment the live API code sections in `/src/app/api/search/route.ts` and `/src/app/api/bill/[...params]/route.ts` files.

### API Configuration
To use the Open States API integration, add your API key to the `.env.local` file:
```
OPENSTATES_API_KEY=your_openstates_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 