import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CampaignStorage } from '@/data/campaignConfig';

const CAMPAIGNS_FILE_PATH = path.join(process.cwd(), 'data', 'campaigns.json');

// Read campaigns from file
const readCampaignsFromFile = async (): Promise<CampaignStorage> => {
  try {
    const data = await fs.readFile(CAMPAIGNS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
};

// GET - Retrieve a single campaign by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;
    const campaigns = await readCampaignsFromFile();
    const campaign = campaigns[campaignId];
    
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    console.error('Error retrieving campaign:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve campaign' },
      { status: 500 }
    );
  }
}
