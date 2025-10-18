import claimsData from '../data/claims.json';
import trendsData from '../data/trends.json';
import topicsData from '../data/topics.json';
import statsData from '../data/stats.json';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Claim {
  id: string;
  text: string;
  date: string;
  region: string;
  confidence: number;
  veracity: string;
  sources: string[];
  cluster: string;
  short_label: string;
  plain_explanation: string;
  technical_note: string;
  latitude: number;
  longitude: number;
  status: string;
  flagged: boolean;
  topic: string;
  supporting_evidence: Evidence[];
  refuting_evidence: Evidence[];
}

export interface Evidence {
  source: string;
  url: string;
  excerpt: string;
  credibility: number;
}

export interface Trend {
  date: string;
  totalClaims: number;
  verifiedFalse: number;
  verifiedTrue: number;
  unverified: number;
}

export interface Topic {
  name: string;
  count: number;
  trend: string;
}

export interface Stats {
  totalClaims: number;
  verifiedClaims: number;
  misinformationClusters: number;
  activeCrises: number;
  accuracyRate: number;
  avgResponseTime: string;
}

// Get all claims with optional filters
export const getClaims = async (filters?: {
  search?: string;
  region?: string;
  topic?: string;
  confidence?: number;
  veracity?: string;
}): Promise<Claim[]> => {
  await delay(300);

  let filtered = [...claimsData] as Claim[];

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter((claim) =>
      claim.text.toLowerCase().includes(searchLower) ||
      claim.cluster.toLowerCase().includes(searchLower) ||
      claim.topic.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.region && filters.region !== 'all') {
    filtered = filtered.filter((claim) => claim.region === filters.region);
  }

  if (filters?.topic && filters.topic !== 'all') {
    filtered = filtered.filter((claim) => claim.topic === filters.topic);
  }

  if (filters?.confidence) {
    filtered = filtered.filter((claim) => claim.confidence >= filters.confidence);
  }

  if (filters?.veracity && filters.veracity !== 'all') {
    filtered = filtered.filter((claim) => claim.veracity === filters.veracity);
  }

  return filtered;
};

// Get a single claim by ID
export const getClaimById = async (id: string): Promise<Claim | null> => {
  await delay(200);
  const claim = claimsData.find((c) => c.id === id);
  return claim ? (claim as Claim) : null;
};

// Get flagged claims for moderation
export const getFlaggedClaims = async (): Promise<Claim[]> => {
  await delay(300);
  return claimsData.filter((claim) => claim.flagged) as Claim[];
};

// Get trend data
export const getTrends = async (): Promise<Trend[]> => {
  await delay(200);
  return trendsData as Trend[];
};

// Get topics data
export const getTopics = async (): Promise<Topic[]> => {
  await delay(200);
  return topicsData as Topic[];
};

// Get overall statistics
export const getStats = async (): Promise<Stats> => {
  await delay(150);
  return statsData as Stats;
};

// Get hotspot data for map
export const getHotspots = async (): Promise<Claim[]> => {
  await delay(250);
  return claimsData as Claim[];
};

// Update claim verification status
export const verifyClaim = async (
  id: string,
  status: string,
  reviewerName?: string
): Promise<{ success: boolean; message: string }> => {
  await delay(400);

  // In a real implementation, this would make an API call
  // For now, we just simulate success
  return {
    success: true,
    message: `Claim ${id} has been marked as ${status}${reviewerName ? ` by ${reviewerName}` : ''}`,
  };
};

// Get recent activity feed
export const getRecentActivity = async (): Promise<Claim[]> => {
  await delay(200);
  // Return most recent claims sorted by date
  return [...claimsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5) as Claim[];
};

// Get unique regions for filter dropdown
export const getRegions = async (): Promise<string[]> => {
  await delay(100);
  const regions = Array.from(new Set(claimsData.map((claim) => claim.region)));
  return regions.sort();
};

// Get all unique topics
export const getAllTopics = async (): Promise<string[]> => {
  await delay(100);
  const topics = Array.from(new Set(claimsData.map((claim) => claim.topic)));
  return topics.sort();
};
