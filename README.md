# Garage Invoice Generator

<img src="garage-logo.svg" alt="Garage Logo" width="200">

Professional PDF invoice generator for Garage fire truck listings.

## Features

- **Instant PDF Generation**: Convert any Garage fire truck listing URL into a professional invoice
- **Garage-Branded Design**: Matches Garage's design system with signature orange (#FF6B2C) branding
- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript 5, and Tailwind CSS 4
- **Fully Tested**: Comprehensive test suite with 20+ tests using Vitest and React Testing Library
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: End-to-end TypeScript for reliability

## Design System

This application closely follows Garage's design system:

- **Primary Color**: `#FF6B2C` (Garage Orange)
- **Typography**: Clean, modern sans-serif with bold headings
- **Layout**: Card-based design with spacious padding
- **Components**: Built with shadcn/ui and Radix UI primitives
- **Accessibility**: WCAG compliant with proper ARIA labels

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Components** | shadcn/ui + Radix UI |
| **PDF Generation** | @react-pdf/renderer |
| **Testing** | Vitest + React Testing Library |
| **Package Manager** | npm |

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd garagetakehome

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Testing

This project includes a comprehensive test suite covering:
- Custom React hooks
- UI components and interactions
- API endpoints
- Utility functions and constants
- Error handling

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
test/
├── setup.ts                          # Test configuration
app/
├── page.test.tsx                     # Home page component tests
hooks/
├── use-pdf-generator.test.ts        # Custom hook tests
lib/
└── constants.test.ts                 # Constants and utilities tests
```

### Test Results

```
Test Files  3 passed (3)
     Tests  20 passed (20)
```

## Usage

1. **Paste a URL**: Enter any Garage fire truck listing URL (e.g., `https://www.shopgarage.com/listing/abc-123`)
2. **Generate Invoice**: Click "Generate PDF Invoice"
3. **Download**: The PDF will automatically download to your device

### Supported URL Formats

- `https://www.shopgarage.com/listing/{id}`
- `https://withgarage.com/listing/{id}`
- `http://www.shopgarage.com/listing/{id}`

## Project Structure

```
garagetakehome/
├── app/
│   ├── api/
│   │   ├── listing/route.ts          # Fetch listing data API
│   │   └── generate-pdf/route.ts     # Generate PDF API
│   ├── layout.tsx                     # Root layout with metadata
│   ├── page.tsx                       # Main invoice generator page
│   └── globals.css                    # Global styles with Garage theme
├── components/
│   ├── ui/                            # shadcn/ui components
│   └── InvoicePDF.tsx                 # PDF template component
├── hooks/
│   └── use-pdf-generator.ts           # PDF generation logic hook
├── lib/
│   └── constants.ts                   # Shared constants and config
├── types/
│   └── listing.ts                     # TypeScript interfaces
├── test/
│   └── setup.ts                       # Vitest configuration
├── public/
│   └── garage-logo.svg                # Garage brand logo
└── vitest.config.ts                   # Test runner config
```

## Development

### Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Run production build
npm run lint       # Run ESLint
npm test           # Run tests
```

### Environment Variables

No environment variables required for basic functionality. The app uses fallback mock data when the Garage API is unavailable.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

## Features in Detail

### PDF Generation

- Professional invoice layout with Garage branding
- Includes listing details, pricing, and metadata
- Automatic date formatting
- Clean typography and spacing

### API Routes

**`/api/listing`**
- Fetches listing data from Garage API
- Falls back to mock data for development
- Validates required fields

**`/api/generate-pdf`**
- Generates PDF from listing data
- Type-safe with validation
- Returns downloadable PDF file

### Custom Hooks

**`usePDFGenerator`**
- Manages URL state and validation
- Handles API calls and error states
- Uses React 19's `useTransition` for non-blocking UI
- Memoized with `useCallback` for performance

## Troubleshooting

### Common Issues

**PDF not downloading?**
- Check browser pop-up settings
- Ensure JavaScript is enabled
- Try a different browser

**Invalid URL error?**
- Verify the URL format matches `*/listing/{id}`
- Ensure the listing ID is present

**API errors?**
- The app falls back to mock data if the API is unavailable
- Check network connectivity

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests as needed
5. Ensure all tests pass (`npm test`)
6. Submit a pull request

## Contact

For questions or support, contact: alaz@withgarage.com

---

Built for Garage
