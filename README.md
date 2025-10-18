# TruthLens – AI Misinformation Detection Dashboard

A production-ready React + Vite web application designed for journalists, analysts, and the public to detect, analyze, and combat misinformation in real-time.

## 🎯 Project Overview

TruthLens provides an interactive dashboard that allows users to:

- **Monitor emerging misinformation trends** with real-time analytics
- **View verified claims** with fact-check results and AI-generated explanations
- **Search, filter, and visualize** claim data across multiple dimensions
- **Access AI-generated explanations** in both plain language and technical formats
- **Enable human moderators** to review and verify flagged claims
- **Visualize geographic hotspots** of misinformation with interactive maps

## 🚀 Features

### 1. Homepage Dashboard
- Real-time statistics (total claims, verified claims, active clusters, crises)
- Interactive line chart showing misinformation trends over time
- Bar chart displaying top 5 trending topics
- Live feed of recent claim detections with confidence scores
- Animated statistics with Framer Motion

### 2. Claims Explorer
- Searchable, filterable data table of all detected claims
- Advanced filters: region, topic, veracity status, confidence level
- Pagination-ready with smooth animations
- Quick access to detailed claim information

### 3. Claim Detail View
- Comprehensive claim information with cluster and timestamp data
- AI Veracity score with visual progress bar
- Supporting and refuting evidence with credibility ratings
- Three types of AI-generated outputs:
  - **Short Fact Label**: Quick verdict
  - **Plain-Language Explanation**: For general public
  - **Technical Note**: For journalists and analysts
- Expandable sources section
- Action buttons for moderator workflows

### 4. Moderator Dashboard
- View and manage flagged claims
- Priority-based sorting (high/medium/low urgency)
- Category filters for efficient triage
- Status update actions with reviewer tracking
- Activity logging and review history

### 5. Geographic Map Visualization
- Interactive Leaflet map with custom markers
- Color-coded severity indicators (red/orange/yellow)
- Clustered view by region
- Sliding side panel with region-specific claims
- Click markers to explore details

### 6. UI/UX Enhancements
- Dark mode toggle with persistent state
- Fully responsive design (desktop, tablet, mobile)
- Smooth page transitions with Framer Motion
- Toast notification system for user feedback
- Loading skeletons for better perceived performance
- About modal explaining the TruthLens system
- Glassmorphism effects and subtle animations

## 📁 Project Structure

```
src/
├── api/
│   └── agentService.ts          # Mock API service layer
├── components/
│   ├── AboutModal.tsx           # Information modal
│   ├── Layout.tsx               # Main layout with navigation
│   ├── LoadingSkeleton.tsx      # Loading state components
│   ├── StatCard.tsx             # Reusable stat card
│   └── Toast.tsx                # Notification system
├── context/
│   └── AppStore.ts              # Zustand global state management
├── data/
│   ├── claims.json              # Mock claims data
│   ├── stats.json               # Dashboard statistics
│   ├── topics.json              # Topic data
│   └── trends.json              # Trend data over time
├── pages/
│   ├── ClaimDetailPage.tsx      # Individual claim details
│   ├── ClaimsExplorerPage.tsx   # Claims search and filter
│   ├── HomePage.tsx             # Dashboard overview
│   ├── MapPage.tsx              # Geographic visualization
│   └── ModeratorPage.tsx        # Moderator workflow
├── App.tsx                      # Main app with routing
├── index.css                    # Global styles
└── main.tsx                     # Entry point
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Framer Motion** - Animation library
- **Recharts** - Chart visualization
- **React Leaflet** - Interactive maps
- **Zustand** - State management
- **date-fns** - Date formatting

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔌 API Integration

Currently, the application uses **mock data** from JSON files in `src/data/`. All API calls are simulated with delays to mimic real network behavior.

### Mock API Functions (`src/api/agentService.ts`)

- `getClaims(filters?)` - Get all claims with optional filters
- `getClaimById(id)` - Get a single claim by ID
- `getFlaggedClaims()` - Get claims flagged for review
- `getTrends()` - Get trend data for charts
- `getTopics()` - Get topic statistics
- `getStats()` - Get overall dashboard statistics
- `getHotspots()` - Get geographic hotspot data
- `verifyClaim(id, status, reviewerName?)` - Update claim status
- `getRecentActivity()` - Get recent claim detections
- `getRegions()` - Get list of unique regions
- `getAllTopics()` - Get list of all topics

### Connecting to Real Backend

To integrate with your backend API:

1. **Update `src/api/agentService.ts`**:
   - Replace mock data imports with `fetch` or `axios` calls
   - Update function bodies to call your actual endpoints
   - Example:

   ```typescript
   export const getClaims = async (filters?: any): Promise<Claim[]> => {
     const response = await fetch('https://your-api.com/api/claims', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(filters)
     });
     return response.json();
   };
   ```

2. **Update environment variables**:
   - Create `.env` file with your API base URL
   - Use `import.meta.env.VITE_API_URL` in service calls

3. **Add authentication**:
   - Implement JWT tokens or session management
   - Add auth headers to API calls
   - Protect routes based on user roles

### Backend API Endpoints (Recommended Structure)

```
GET    /api/claims              # Get all claims (with query params)
GET    /api/claims/:id          # Get claim by ID
GET    /api/claims/flagged      # Get flagged claims
POST   /api/claims/:id/verify   # Update claim verification status
GET    /api/stats               # Get dashboard statistics
GET    /api/trends              # Get trend data
GET    /api/topics              # Get topic statistics
GET    /api/hotspots            # Get geographic hotspots
GET    /api/regions             # Get list of regions
```

## 🎨 Design Philosophy

- **Minimalist UI** with soft shadows and rounded corners
- **Glassmorphism effects** for modern aesthetic
- **Consistent color system** with proper contrast ratios
- **Responsive breakpoints** for all device sizes
- **Smooth animations** using Framer Motion
- **Professional color palette** (blues, greens, neutrals - no purple by default)
- **Accessible** with proper ARIA labels and keyboard navigation

## 🌍 Mock Data

The application includes 8 sample claims covering various scenarios:

1. Radioactive water claim (False)
2. Vaccine side effects (False)
3. Government lockdown rumor (Unverified)
4. Flood casualty numbers (Partially True)
5. AI job replacement (False)
6. Election manipulation (False)
7. Energy drink safety (Under Investigation)
8. Meteor strike hoax (False)

Each claim includes:
- Full text and metadata
- Confidence scores and veracity ratings
- Supporting and refuting evidence with credibility scores
- AI-generated labels and explanations
- Geographic coordinates for map visualization
- Cluster assignment and topic categorization

## 🔮 Future Enhancements

- Real-time WebSocket updates for live claim detection
- User authentication and role-based access control
- Advanced analytics and reporting dashboards
- Export functionality (PDF, CSV, JSON)
- Integration with external fact-checking APIs
- Machine learning model performance metrics
- Multi-language support
- Browser notifications for high-priority claims
- Collaborative review workflows for teams

## 📄 License

This project is provided as-is for demonstration purposes.

## 🤝 Contributing

This is a demonstration project. For production use, ensure proper security audits, performance optimization, and accessibility compliance.

---

**Built with ❤️ for a more informed society**
