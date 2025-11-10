# Garage Fire Truck Invoice Generator

A Next.js application that generates professional PDF invoices for Garage fire truck listings. This tool allows users to paste a Garage listing URL and receive a beautifully formatted PDF invoice suitable for fire department approval processes.

## 🚀 Tech Stack

- **Next.js 16** - Latest App Router with React Server Components
- **React 19** - Modern React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **@react-pdf/renderer** - PDF generation library

## ✨ Features

- ✅ Extract listing UUID from Garage URLs automatically
- ✅ Fetch listing data via API (with fallback mock data)
- ✅ Generate professional, styled PDF invoices
- ✅ One-click download functionality
- ✅ Responsive, modern UI with loading states
- ✅ Comprehensive error handling and validation
- ✅ Mobile-friendly design

## 📋 Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

## 🛠️ Installation

1. **Clone or download the repository**

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Get a Garage listing URL**  
   Visit [withgarage.com](https://withgarage.com) and find a fire truck listing

2. **Paste the URL**  
   Copy the full URL (format: `https://withgarage.com/listing/{uuid}`) into the input field

3. **Generate Invoice**  
   Click "Generate PDF Invoice" button

4. **Download**  
   The PDF will automatically download with the filename `garage-invoice-{uuid}.pdf`

## 📁 Project Structure

```
garagetakehome/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── listing/
│   │   │   └── route.ts         # Fetch listing data from Garage API
│   │   └── generate-pdf/
│   │       └── route.ts         # Generate PDF from listing data
│   ├── globals.css              # Global styles (Tailwind)
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Home page with form UI
├── components/
│   └── InvoicePDF.tsx           # PDF invoice template component
├── public/                       # Static assets
├── .gitignore                   # Git ignore rules
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config for Tailwind
├── README.md                    # This file
└── tsconfig.json                # TypeScript configuration
```

## 🔌 API Endpoints

### `GET /api/listing?id={uuid}`

Fetches listing data from Garage's API.

**Query Parameters:**
- `id` (required): The listing UUID from the URL

**Response:**
```json
{
  "id": "abc-123-xyz",
  "title": "2018 Pierce Enforcer Pumper",
  "description": "Excellent condition fire truck...",
  "price": 425000,
  "year": 2018,
  "make": "Pierce",
  "model": "Enforcer",
  "mileage": 15000
}
```

### `POST /api/generate-pdf`

Generates a PDF invoice from listing data.

**Request Body:**
```json
{
  "id": "abc-123-xyz",
  "title": "2018 Pierce Enforcer Pumper",
  "description": "Details...",
  "price": 425000
}
```

**Response:**  
Returns a PDF file with `Content-Type: application/pdf`

## 🎨 PDF Invoice Design

The generated invoice includes:
- Professional header with "INVOICE" title
- Invoice date and listing ID
- Fire truck title and description
- Detailed specifications (year, make, model, mileage)
- Prominent price display
- Clean, modern layout suitable for printing

## 🔍 API Discovery

The application attempts to fetch data from several potential Garage API endpoints:
- `https://api.withgarage.com/listings/{id}`
- `https://withgarage.com/api/listings/{id}`
- `https://api.withgarage.com/v1/listings/{id}`
- `https://withgarage.com/api/v1/listings/{id}`

If the actual API is not accessible (due to authentication or network restrictions), the application falls back to mock data, allowing the invoice generation feature to be demonstrated.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: Garage invoice generator"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Vercel will automatically detect Next.js and configure everything

3. **Done!**  
   Your app will be live at `https://your-project.vercel.app`

### Other Deployment Options

- **Netlify**: Connect GitHub repo and deploy
- **Docker**: Use `next build` and `next start`
- **Self-hosted**: Build with `npm run build` and serve with `npm start`

## 📦 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🧪 Testing the Application

1. Start the development server: `npm run dev`
2. Open http://localhost:3000
3. Try these example URL formats:
   - `https://withgarage.com/listing/abc-123-xyz`
   - `https://withgarage.com/listing/550e8400-e29b-41d4-a716-446655440000`

The app will extract the UUID and attempt to fetch/generate invoice data.

## 🛡️ Error Handling

The application handles various error scenarios:
- ❌ Invalid URL format
- ❌ Missing listing ID
- ❌ API request failures
- ❌ PDF generation errors
- ❌ Network issues

All errors are displayed to users with clear, actionable messages.

## 📝 Assignment Notes

This project was created as part of the Garage take-home assignment. Key requirements implemented:

✅ Next.js application with TypeScript  
✅ Text input for Garage listing URLs  
✅ UUID extraction from `/listing/{uuid}` pattern  
✅ API integration (with mock fallback)  
✅ PDF invoice generation with listing details  
✅ Professional styling and UX  
✅ Ready for Vercel deployment  

**Time Estimate:** Approximately 3-5 hours to complete

## 📧 Contact

For questions about this implementation, please contact the assignment contact at Garage.

## 📄 License

MIT License - See LICENSE file for details

