import { CampaignConfig, CampaignStorage } from '@/data/campaignConfig';

const STORAGE_FILE = 'campaigns.json';

// In a real application, these would interact with a file system or database
// For now, we'll use localStorage in the browser and memory on the server

export const saveCampaignsToStorage = (campaigns: CampaignStorage): void => {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    localStorage.setItem(STORAGE_FILE, JSON.stringify(campaigns));
  } else {
    // Server-side: In a real app, this would write to a file or database
    // For now, we'll just log it
    console.log('Saving campaigns to storage:', campaigns);
  }
};

export const loadCampaignsFromStorage = (): CampaignStorage => {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    const stored = localStorage.getItem(STORAGE_FILE);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored campaigns:', error);
        return {};
      }
    }
  }
  return {};
};

export const initializeDefaultCampaign = (): string => {
  const defaultId = 'donate-iskcon-hubli-dharwad';
  const campaigns = loadCampaignsFromStorage();
  
  if (!campaigns[defaultId]) {
    const now = new Date().toISOString();
    campaigns[defaultId] = {
      id: defaultId,
      header: "Support Our Noble Cause",
      bannerImageUrl: "https://www.fueladream.com/public/uploads/0894810651297247.jpg",
      campaignImageUrl: "https://www.fueladream.com/public/uploads/0894810651297247.jpg",
      active: true,
      details: `Join us in our mission to serve the community through various seva activities. Your generous donation will help us continue our work in temple construction, educational frameworks, annadanam (free food distribution), and special festival celebrations.

Every contribution, no matter how small, makes a significant difference in the lives of those we serve. Together, we can build a stronger, more compassionate community.

Your support enables us to:
- Maintain and construct temples that serve as spiritual centers
- Provide educational opportunities for underprivileged children
- Organize annadanam to feed the needy
- Celebrate festivals that bring communities together
- Support various other social welfare activities

Thank you for your generosity and for being part of our noble mission.`,
      createdAt: now,
      updatedAt: now
    };
    
    saveCampaignsToStorage(campaigns);
  }
  
  return defaultId;
};
