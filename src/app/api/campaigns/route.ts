import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CampaignStorage, CampaignConfig } from '@/data/campaignConfig';

const CAMPAIGNS_FILE_PATH = path.join(process.cwd(), 'data', 'campaigns.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Read campaigns from file
const readCampaignsFromFile = async (): Promise<CampaignStorage> => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(CAMPAIGNS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid, return empty object
    console.log('No existing campaigns file found, starting with empty storage');
    return {};
  }
};

// Write campaigns to file
const writeCampaignsToFile = async (campaigns: CampaignStorage): Promise<void> => {
  try {
    await ensureDataDirectory();
    await fs.writeFile(CAMPAIGNS_FILE_PATH, JSON.stringify(campaigns, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing campaigns to file:', error);
    throw new Error('Failed to save campaigns');
  }
};

// Initialize default campaign if none exist
const initializeDefaultCampaign = async (): Promise<CampaignStorage> => {
  const campaigns = await readCampaignsFromFile();
  
  if (Object.keys(campaigns).length === 0) {
    const defaultId = 'donate-iskcon-hubli-dharwad';
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
    
    await writeCampaignsToFile(campaigns);
  }
  
  return campaigns;
};

// GET - Retrieve all campaigns
export async function GET(request: NextRequest) {
  try {
    const campaigns = await initializeDefaultCampaign();
    
    return NextResponse.json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    console.error('Error retrieving campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve campaigns' },
      { status: 500 }
    );
  }
}

// POST - Save all campaigns (bulk update)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaigns } = body;
    
    if (!campaigns || typeof campaigns !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid campaigns data' },
        { status: 400 }
      );
    }
    
    await writeCampaignsToFile(campaigns);
    
    return NextResponse.json({
      success: true,
      message: 'Campaigns saved successfully',
      data: campaigns
    });
  } catch (error) {
    console.error('Error saving campaigns:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save campaigns' },
      { status: 500 }
    );
  }
}

// PUT - Update or create a single campaign
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, campaign } = body;
    
    if (!campaignId || !campaign) {
      return NextResponse.json(
        { success: false, message: 'Campaign ID and campaign data are required' },
        { status: 400 }
      );
    }
    
    const campaigns = await readCampaignsFromFile();
    campaigns[campaignId] = {
      ...campaign,
      id: campaignId,
      updatedAt: new Date().toISOString()
    };
    
    await writeCampaignsToFile(campaigns);
    
    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaigns[campaignId]
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a campaign
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');
    
    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const campaigns = await readCampaignsFromFile();
    
    if (!campaigns[campaignId]) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    delete campaigns[campaignId];
    await writeCampaignsToFile(campaigns);
    
    return NextResponse.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
