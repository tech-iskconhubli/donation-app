'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Image,
  Alert,
  AlertIcon,
  Button,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import DonationForm from '@/components/DonationForm';
import ContactInfo from '@/components/ContactInfo';
import { getCampaignById, CampaignConfig } from '@/data/campaignConfig';
import { getSingleCampaign } from '@/utils/fileStorage';

interface CampaignPageProps {
  campaignId: string;
}

const CampaignPage = ({ campaignId }: CampaignPageProps) => {
  const [config, setConfig] = useState<CampaignConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const campaign = await getSingleCampaign(campaignId);
        
        if (campaign) {
          setConfig(campaign);
          setError(null);
        } else {
          setError('Campaign not found');
          setConfig(null);
        }
      } catch (err) {
        console.error('Error loading campaign:', err);
        setError('Error loading campaign data');
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [campaignId]);

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
        <Text fontSize="lg" color="gray.600">Loading campaign...</Text>
      </Box>
    );
  }

  if (error || !config) {
    return (
      <Box minH="100vh" bg="gray.100" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="md">
          <Alert status="error" borderRadius="lg" p={6}>
            <AlertIcon />
            <VStack spacing={4} align="start">
              <Text fontWeight="bold">Campaign Not Found</Text>
              <Text>{error || 'The requested campaign could not be found.'}</Text>
              <Button onClick={() => router.push('/')} size="sm">
                Go to Home
              </Button>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.100" >
      {/* Inactive Campaign Warning */}
      {config && !config.active && (
        <Alert status="warning" variant="solid">
          <AlertIcon />
          <Text fontWeight="bold">
            This campaign is currently inactive and not visible to the public.
          </Text>
        </Alert>
      )}

      {/* Banner Section */}
      {config.bannerImageUrl && (
        <Box as="header" bg="white" shadow="sm">
          <Container maxW="7xl" py={6}>
            <Flex justify="center">
              <Image
                src={config.bannerImageUrl}
                alt="Campaign Banner"
                maxW="100%"
                objectFit="cover"
                borderRadius="lg"
                shadow="md"
              />
            </Flex>
          </Container>
        </Box>
      )}

      {/* Main Content */}
      <Container as="main" maxW="7xl" py={8} px={{ base: 4, md: 8 }} >
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={{ base: 6, md: 8 }}>
          {/* Left Column */}
          <Flex justify={{ base: 'center', md: 'flex-start' }} w="100%">
        <GridItem width={{ base: '90%', md: '100%' }}>

            <VStack spacing={{ base: 6, md: 8 }} align="stretch">
              {/* Header Section */}
              <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" shadow="lg">
                <Heading as="h1" size={{ base: 'lg', md: 'xl' }} color="gray.800" mb={4}>
                  {config.header}
                </Heading>
              </Box>

              {/* Campaign Image Section */}
              {config.campaignImageUrl && (
                <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" shadow="lg">
                  <Box position="relative" aspectRatio="16/9">
                    <Image
                      src={config.campaignImageUrl}
                      alt="Campaign Image"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      borderRadius="lg"
                    />
                  </Box>
                </Box>
              )}

              {/* Details Section */}
              <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" shadow="lg">
                <Heading as="h2" size={{ base: 'md', md: 'lg' }} color="gray.800" mb={4}>
                  Offer Ashadhi Ekadashi Seva
                </Heading>
                <VStack spacing={4} align="start">
                  {config.details.split('\n\n').map((paragraph, index) => (
                    <Text key={index} color="gray.600" lineHeight="relaxed">
                      {paragraph}
                    </Text>
                  ))}
                </VStack>
              </Box>
            </VStack>
            </GridItem>
            </Flex>

          {/* Right Column */}
          <Flex justify={{ base: 'center', md: 'flex-start' }} w="100%">
          <GridItem width={{ base: '90%', md: '100%' }}>

            <VStack spacing={{ base: 6, md: 8 }} align="stretch">
              {/* Donation Form */}
              <DonationForm campaignId={campaignId} />

              {/* Contact Information */}
              <ContactInfo />
            </VStack>
            </GridItem>
            </Flex>
        </Grid>
      </Container>

      {/* Footer */}
      <Box as="footer" bg="gray.800" color="white" mt={16}>
        <Container maxW="7xl" py={8}>
          <VStack spacing={4}>
            <Flex justify="space-between" align="center" flexDirection={{ base: 'column', md: 'row' }} gap={4} w="100%">
              <Text textAlign="center">
                &copy; 2025 ISKCON Hubli-Dharwad. All rights reserved.
              </Text>
              <Text fontSize="sm" color="gray.400">
                Campaign ID: {campaignId}
              </Text>
            </Flex>
            
            <Flex justify="center" gap={6} flexWrap="wrap" pt={4} borderTop="1px" borderColor="gray.600" w="100%">
              <Link as={NextLink} href="/campaigns" color="gray.300" _hover={{ color: 'white' }} fontSize="sm">
                View All Campaigns
              </Link>
              <Link as={NextLink} href="/admin" color="gray.300" _hover={{ color: 'white' }} fontSize="sm">
                Admin Dashboard
              </Link>
              <Link href="tel:9342111008" color="gray.300" _hover={{ color: 'white' }} fontSize="sm">
                Contact: 9342111008
              </Link>
            </Flex>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default CampaignPage;
