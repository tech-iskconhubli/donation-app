export interface CampaignConfig {
  id: string;
  header: string;
  bannerImageUrl: string;
  campaignImageUrl: string;
  details: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignStorage {
  [uuid: string]: CampaignConfig;
}

// Default campaign configuration
const defaultConfig: Omit<CampaignConfig, 'id' | 'createdAt' | 'updatedAt'> = {
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

Thank you for your generosity and for being part of our noble mission.`
};

// In-memory storage (in a real app, this would be a database)
let campaignStorage: CampaignStorage = {};

// Generate UUID function
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Initialize with a default campaign if storage is empty
const initializeStorage = () => {
  if (Object.keys(campaignStorage).length === 0) {
    const defaultId = 'donate-iskcon-hubli-dharwad';
    const now = new Date().toISOString();
    campaignStorage[defaultId] = {
      id: defaultId,
      ...defaultConfig,
      createdAt: now,
      updatedAt: now
    };
  }
};

// Get all campaigns
export const getAllCampaigns = (): CampaignStorage => {
  initializeStorage();
  return campaignStorage;
};

// Get campaign by ID
export const getCampaignById = (id: string): CampaignConfig | null => {
  initializeStorage();
  return campaignStorage[id] || null;
};

// Get default campaign (first one or create one)
export const getDefaultCampaign = (): CampaignConfig => {
  initializeStorage();
  const campaigns = Object.values(campaignStorage);
  if (campaigns.length > 0) {
    return campaigns[0];
  }
  
  // Create a new default campaign
  const newId = generateUUID();
  const now = new Date().toISOString();
  const newCampaign: CampaignConfig = {
    id: newId,
    ...defaultConfig,
    createdAt: now,
    updatedAt: now
  };
  
  campaignStorage[newId] = newCampaign;
  return newCampaign;
};

// Create new campaign
export const createCampaign = (configData: Omit<CampaignConfig, 'id' | 'createdAt' | 'updatedAt'>): CampaignConfig => {
  const id = generateUUID();
  const now = new Date().toISOString();
  
  const newCampaign: CampaignConfig = {
    id,
    ...configData,
    createdAt: now,
    updatedAt: now
  };
  
  campaignStorage[id] = newCampaign;
  return newCampaign;
};

// Update existing campaign
export const updateCampaign = (id: string, configData: Omit<CampaignConfig, 'id' | 'createdAt' | 'updatedAt'>): CampaignConfig | null => {
  if (!campaignStorage[id]) {
    return null;
  }
  
  const updatedCampaign: CampaignConfig = {
    ...campaignStorage[id],
    ...configData,
    updatedAt: new Date().toISOString()
  };
  
  campaignStorage[id] = updatedCampaign;
  return updatedCampaign;
};

// Delete campaign
export const deleteCampaign = (id: string): boolean => {
  if (campaignStorage[id]) {
    delete campaignStorage[id];
    return true;
  }
  return false;
};

// Legacy functions for backward compatibility
export const getCampaignConfig = (): CampaignConfig => {
  return getDefaultCampaign();
};

export const updateCampaignConfig = (config: Omit<CampaignConfig, 'id' | 'createdAt' | 'updatedAt'>): void => {
  const defaultCampaign = getDefaultCampaign();
  updateCampaign(defaultCampaign.id, config);
};
