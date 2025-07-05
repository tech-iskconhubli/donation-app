import CampaignPage from '@/components/CampaignPage';

interface CampaignPageProps {
  params: {
    id: string;
  };
}

export default function Campaign({ params }: CampaignPageProps) {
  return <CampaignPage campaignId={params.id} />;
}

export async function generateMetadata({ params }: CampaignPageProps) {
  return {
    title: `Donation Campaign - ${params.id}`,
    description: 'Support our noble cause through various seva activities',
  };
}
