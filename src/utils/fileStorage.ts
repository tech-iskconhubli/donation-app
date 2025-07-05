import { CampaignConfig, CampaignStorage } from '@/data/campaignConfig';

// API-based storage functions for file system persistence

export const saveCampaignsToStorage = async (campaigns: CampaignStorage): Promise<void> => {
  if (typeof window !== 'undefined') {
    // Client-side: make API call to save to file system
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaigns }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save campaigns');
      }
    } catch (error) {
      console.error('Error saving campaigns:', error);
      throw error;
    }
  } else {
    // Server-side: this should not be called directly
    console.warn('saveCampaignsToStorage called on server-side');
  }
};

export const loadCampaignsFromStorage = async (): Promise<CampaignStorage> => {
  if (typeof window !== 'undefined') {
    // Client-side: fetch from API
    try {
      const response = await fetch('/api/campaigns', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load campaigns');
      }
      
      const result = await response.json();
      return result.data || {};
    } catch (error) {
      console.error('Error loading campaigns:', error);
      return {};
    }
  } else {
    // Server-side: return empty object (will be handled by API)
    return {};
  }
};

export const saveSingleCampaign = async (campaignId: string, campaign: CampaignConfig): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId, campaign }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save campaign');
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
      throw error;
    }
  }
};

export const deleteCampaignFromStorage = async (campaignId: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch(`/api/campaigns?id=${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
};

export const getSingleCampaign = async (campaignId: string): Promise<CampaignConfig | null> => {
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return null;
      }
      
      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error getting campaign:', error);
      return null;
    }
  }
  return null;
};

export const initializeDefaultCampaign = async (): Promise<string> => {
  // This will be handled by the API automatically
  const campaigns = await loadCampaignsFromStorage();
  const campaignIds = Object.keys(campaigns);
  
  if (campaignIds.length > 0) {
    return campaignIds[0];
  }
  
  // If no campaigns exist, the API will create the default one
  return 'donate-iskcon-hubli-dharwad';
};

// Legacy function for backward compatibility (now async)
export const saveCampaignsToStorageSync = (campaigns: CampaignStorage): void => {
  // Convert to async call but don't wait for it
  saveCampaignsToStorage(campaigns).catch(console.error);
};

export const loadCampaignsFromStorageSync = (): CampaignStorage => {
  // This function should not be used anymore, but kept for compatibility
  console.warn('loadCampaignsFromStorageSync is deprecated. Use loadCampaignsFromStorage instead.');
  return {};
};
