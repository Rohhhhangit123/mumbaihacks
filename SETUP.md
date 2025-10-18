# TruthLens Setup Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking

## Project Features

### Pages
- **Dashboard** (`/`) - Overview with stats, charts, and recent activity
- **Claims Explorer** (`/claims`) - Search and filter all claims
- **Claim Details** (`/claim/:id`) - Detailed view with AI analysis
- **Moderator Dashboard** (`/moderator`) - Review flagged claims
- **Map View** (`/map`) - Geographic visualization of hotspots

### Key Components
- Dark mode toggle (persistent across sessions)
- Toast notifications for user actions
- Responsive design for all screen sizes
- Loading states with skeletons
- Animated transitions with Framer Motion

## Mock Data Structure

All mock data is located in `src/data/`:

- `claims.json` - 8 sample claims with full metadata
- `stats.json` - Dashboard statistics
- `trends.json` - Time-series data for charts
- `topics.json` - Topic popularity data

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme.

### API Integration
Modify `src/api/agentService.ts` to connect to your backend:

```typescript
// Example: Replace mock with real API
export const getClaims = async (filters?: any) => {
  const response = await fetch(`${API_BASE_URL}/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  return response.json();
};
```

### Adding New Pages
1. Create new page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`

## Environment Variables

Create a `.env` file for configuration:

```env
VITE_API_URL=https://your-api.com
VITE_MAP_TOKEN=your_mapbox_token
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the production-ready files

3. Deploy to your preferred hosting:
   - **Vercel**: `vercel deploy`
   - **Netlify**: Drag & drop `dist/` folder
   - **Static Server**: Serve the `dist/` folder

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Tips

- The app uses code splitting via dynamic imports
- Images and assets are optimized by Vite
- Recharts and Leaflet are loaded only on pages that use them
- Loading skeletons improve perceived performance

## Troubleshooting

### Map not displaying
Ensure Leaflet CSS is loaded in `index.html`:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

### Dark mode not persisting
Zustand state is in-memory by default. For persistence, add:
```typescript
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({ /* ... */ }),
    { name: 'truthlens-storage' }
  )
);
```

### Build size warnings
The bundle includes Recharts and Leaflet which are large. Consider:
- Lazy loading pages with React.lazy()
- Using lighter chart libraries for simpler visualizations
- Code splitting with dynamic imports

## Next Steps

1. Connect to real backend API
2. Add user authentication
3. Implement real-time updates via WebSocket
4. Add unit tests with Vitest
5. Set up CI/CD pipeline
6. Enable PWA features for offline support

## Support

For questions or issues, refer to the main README.md or documentation of individual libraries.
