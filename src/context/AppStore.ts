import { create } from 'zustand';

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedRegion: string;
  setSelectedRegion: (region: string) => void;

  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;

  confidenceFilter: number;
  setConfidenceFilter: (confidence: number) => void;

  veracityFilter: string;
  setVeracityFilter: (veracity: string) => void;

  showAboutModal: boolean;
  setShowAboutModal: (show: boolean) => void;

  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedRegion: 'all',
  setSelectedRegion: (region) => set({ selectedRegion: region }),

  selectedTopic: 'all',
  setSelectedTopic: (topic) => set({ selectedTopic: topic }),

  confidenceFilter: 0,
  setConfidenceFilter: (confidence) => set({ confidenceFilter: confidence }),

  veracityFilter: 'all',
  setVeracityFilter: (veracity) => set({ veracityFilter: veracity }),

  showAboutModal: false,
  setShowAboutModal: (show) => set({ showAboutModal: show }),

  notifications: [],
  addNotification: (message, type) => set((state) => ({
    notifications: [...state.notifications, { id: Date.now().toString(), message, type }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));
