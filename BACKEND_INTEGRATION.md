# Backend Integration Guide

This document explains how to connect TruthLens to your AI misinformation detection backend.

## Architecture Overview

```
┌─────────────────┐
│   TruthLens     │
│  Frontend (UI)  │
└────────┬────────┘
         │ HTTP/REST
         │ or WebSocket
         ▼
┌─────────────────┐
│  Backend API    │
│  (Your Server)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Pipelines   │
├─────────────────┤
│ • Detection     │
│ • Clustering    │
│ • Retrieval     │
│ • Verification  │
│ • Explanation   │
└─────────────────┘
```

## Backend API Endpoints (Recommended)

### 1. Claims Management

#### Get All Claims
```
GET /api/claims
Query Parameters:
  - search: string (optional)
  - region: string (optional)
  - topic: string (optional)
  - confidence: number (0-1, optional)
  - veracity: string (optional)
  - limit: number (optional, default: 50)
  - offset: number (optional, default: 0)

Response:
{
  "claims": [
    {
      "id": "CLM001",
      "text": "...",
      "date": "2025-10-17T10:30:00Z",
      "region": "Mumbai",
      "confidence": 0.82,
      "veracity": "Likely False",
      "sources": ["..."],
      "cluster": "RadiationEvent2025",
      "topic": "Public Safety",
      ...
    }
  ],
  "total": 521,
  "hasMore": true
}
```

#### Get Single Claim
```
GET /api/claims/:id

Response:
{
  "id": "CLM001",
  "text": "...",
  "confidence": 0.82,
  "veracity": "Likely False",
  "short_label": "False — City X water is safe.",
  "plain_explanation": "...",
  "technical_note": "...",
  "supporting_evidence": [...],
  "refuting_evidence": [...],
  ...
}
```

#### Update Claim Status
```
POST /api/claims/:id/verify
Body:
{
  "status": "Verified as False",
  "reviewerName": "John Doe",
  "notes": "Optional review notes"
}

Response:
{
  "success": true,
  "message": "Claim CLM001 has been marked as Verified as False by John Doe"
}
```

### 2. Dashboard Data

#### Get Statistics
```
GET /api/stats

Response:
{
  "totalClaims": 521,
  "verifiedClaims": 487,
  "misinformationClusters": 34,
  "activeCrises": 7,
  "accuracyRate": 93.5,
  "avgResponseTime": "4.2 hours"
}
```

#### Get Trends
```
GET /api/trends
Query Parameters:
  - startDate: ISO date (optional)
  - endDate: ISO date (optional)
  - granularity: "day" | "week" | "month" (default: "day")

Response:
{
  "trends": [
    {
      "date": "2025-10-11",
      "totalClaims": 45,
      "verifiedFalse": 28,
      "verifiedTrue": 12,
      "unverified": 5
    },
    ...
  ]
}
```

#### Get Topics
```
GET /api/topics
Query Parameters:
  - limit: number (optional, default: 10)

Response:
{
  "topics": [
    {
      "name": "Public Safety",
      "count": 147,
      "trend": "up"
    },
    ...
  ]
}
```

### 3. Moderation

#### Get Flagged Claims
```
GET /api/claims/flagged
Query Parameters:
  - topic: string (optional)
  - urgency: "high" | "medium" | "low" (optional)

Response:
{
  "claims": [...],
  "total": 23
}
```

### 4. Geographic Data

#### Get Hotspots
```
GET /api/hotspots

Response:
{
  "hotspots": [
    {
      "region": "Mumbai",
      "claims": [...],
      "latitude": 19.0760,
      "longitude": 72.8777,
      "severity": "high"
    },
    ...
  ]
}
```

### 5. Reference Data

#### Get Regions
```
GET /api/regions

Response:
{
  "regions": ["Mumbai", "Delhi", "Bangalore", ...]
}
```

#### Get All Topics
```
GET /api/topics/all

Response:
{
  "topics": ["Public Safety", "Health", "Politics", ...]
}
```

## Frontend Service Layer Update

Update `src/api/agentService.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for API calls
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`, // Add if using auth
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

// Example: Update getClaims function
export const getClaims = async (filters?: {
  search?: string;
  region?: string;
  topic?: string;
  confidence?: number;
  veracity?: string;
}): Promise<Claim[]> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.region && filters.region !== 'all') {
    params.append('region', filters.region);
  }
  if (filters?.topic && filters.topic !== 'all') {
    params.append('topic', filters.topic);
  }
  if (filters?.confidence) {
    params.append('confidence', filters.confidence.toString());
  }
  if (filters?.veracity && filters.veracity !== 'all') {
    params.append('veracity', filters.veracity);
  }

  const data = await apiCall(`/api/claims?${params.toString()}`);
  return data.claims;
};

// Example: Update verifyClaim function
export const verifyClaim = async (
  id: string,
  status: string,
  reviewerName?: string
): Promise<{ success: boolean; message: string }> => {
  return apiCall(`/api/claims/${id}/verify`, {
    method: 'POST',
    body: JSON.stringify({ status, reviewerName }),
  });
};
```

## Real-Time Updates with WebSocket

For live claim detection updates:

```typescript
// src/api/websocket.ts
export class ClaimWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    this.ws = new WebSocket(
      import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws'
    );

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }

  disconnect() {
    this.ws?.close();
  }
}

// Usage in components:
import { useEffect } from 'react';
import { ClaimWebSocket } from '../api/websocket';

export const HomePage = () => {
  useEffect(() => {
    const ws = new ClaimWebSocket();
    ws.connect();

    ws.on('new_claim', (claim) => {
      console.log('New claim detected:', claim);
      // Update UI with new claim
    });

    return () => ws.disconnect();
  }, []);

  // ...
};
```

## Authentication

If your backend requires authentication:

```typescript
// src/api/auth.ts
export const login = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  // Store token
  localStorage.setItem('auth_token', data.token);

  return data;
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const logout = () => {
  localStorage.removeItem('auth_token');
};
```

Then update `AppStore.ts` to include auth state:

```typescript
interface AppState {
  // ... existing state
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}
```

## Error Handling

Add global error handler:

```typescript
// src/api/errorHandler.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
  }
}

export const handleAPIError = (error: any) => {
  if (error instanceof APIError) {
    if (error.statusCode === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.statusCode === 403) {
      // Show permission error
      console.error('Permission denied');
    }
  }

  // Show user-friendly error
  console.error('API Error:', error);
};
```

## Environment Configuration

Create `.env` files for different environments:

**.env.development**
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws
```

**.env.production**
```env
VITE_API_URL=https://api.truthlens.com
VITE_WS_URL=wss://api.truthlens.com/ws
```

## Testing API Integration

Use tools like:
- **Postman** - Test API endpoints
- **curl** - Command-line testing
- **Mock Service Worker** - Mock API in development

Example MSW setup:

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/claims', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        claims: [...],
        total: 100
      })
    );
  }),
];
```

## Deployment Checklist

- [ ] Update API URLs in environment variables
- [ ] Add CORS headers on backend
- [ ] Implement rate limiting
- [ ] Add request/response logging
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Enable HTTPS
- [ ] Add health check endpoint
- [ ] Document API with Swagger/OpenAPI
- [ ] Set up CI/CD pipeline

## Performance Optimization

1. **Caching**: Implement response caching with Redis
2. **Pagination**: Use cursor-based pagination for large datasets
3. **Compression**: Enable gzip/brotli on API responses
4. **CDN**: Serve static assets via CDN
5. **Lazy Loading**: Load charts/maps only when needed

## Security Best Practices

- Validate all inputs on backend
- Use parameterized queries to prevent SQL injection
- Implement rate limiting (100 requests/minute)
- Sanitize user-generated content
- Use HTTPS everywhere
- Implement CSRF protection
- Add request signing for critical operations
- Regular security audits

---

**Ready to connect!** Once your backend is ready, update the service layer and you're good to go.
