'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';
import { loadCampaignsFromStorage } from '@/utils/fileStorage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const redirectToDefaultCampaign = async () => {
      try {
        // Load campaigns from storage
        const campaigns = await loadCampaignsFromStorage();
        
        if (Object.keys(campaigns).length === 0) {
          // No campaigns available, redirect to campaigns list
          router.push('/campaigns');
        } else {
          // Redirect to the first available active campaign
          const activeCampaigns = Object.values(campaigns).filter(campaign => campaign.active !== false);
          if (activeCampaigns.length > 0) {
            router.push(`/campaign/${activeCampaigns[0].id}`);
          } else {
            // No active campaigns, redirect to campaigns list
            router.push('/campaigns');
          }
        }
      } catch (error) {
        console.error('Error loading campaigns:', error);
        // Fallback: redirect to campaigns list
        router.push('/campaigns');
      }
    };

    redirectToDefaultCampaign();
  }, [router]);

  return (
    <Box minH="100vh" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Spinner size="xl" color="brand.500" />
        <Text fontSize="lg" color="gray.600">
          Loading campaign...
        </Text>
      </VStack>
    </Box>
  );
}
