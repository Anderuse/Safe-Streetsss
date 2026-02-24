export interface SafetyReport {
  id: string;
  lat: number;
  lng: number;
  // Visual map position (percentage based)
  mapX?: number;  // 0-100 percentage
  mapY?: number;  // 0-100 percentage
  type: 'dangerous' | 'not-busy' | 'no-security';
  locationName: string;
  address: string;
  description: string;
  timestamp: Date;
  upvotes: number;
  imageUrl: string;
}
