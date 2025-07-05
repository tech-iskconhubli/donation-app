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
} from '@chakra-ui/react';
import DonationForm from '@/components/DonationForm';
import ContactInfo from '@/components/ContactInfo';
import { getCampaignConfig, CampaignConfig } from '@/data/campaignConfig';

const MainLayout = () => {
  const [config, setConfig] = useState<CampaignConfig>({
    header: '',
    imageUrl: '',
    details: ''
  });

  useEffect(() => {
    const campaignConfig = getCampaignConfig();
    setConfig(campaignConfig);
  }, []);

  return (
    <Box minH="100vh" bg="gray.100">
      {/* Header Section */}
      <Box as="header" bg="white" shadow="sm">
        <Container maxW="7xl" py={6}>
          <Flex justify="center">
            <Image
              src={config.imageUrl}
              alt="Campaign Header"
              maxW="800px"
              maxH="300px"
              objectFit="cover"
              borderRadius="lg"
              shadow="md"
              priority
            />
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container as="main" maxW="7xl" py={8}>
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
          {/* Left Column */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Header Section */}
              <Box bg="white" p={6} borderRadius="lg" shadow="lg">
                <Heading as="h1" size="xl" color="gray.800" mb={4}>
                  {config.header}
                </Heading>
              </Box>

              {/* Image Section */}
              <Box bg="white" p={6} borderRadius="lg" shadow="lg">
                <Box position="relative" aspectRatio="16/9">
                  <Image
                    src={config.imageUrl}
                    alt="Campaign Image"
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    borderRadius="lg"
                  />
                </Box>
              </Box>

              {/* Details Section */}
              <Box bg="white" p={6} borderRadius="lg" shadow="lg">
                <Heading as="h2" size="lg" color="gray.800" mb={4}>
                  Details about the campaign
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

          {/* Right Column */}
          <GridItem>
            <VStack spacing={8} align="stretch">
              {/* Donation Form */}
              <DonationForm />

              {/* Contact Information */}
              <ContactInfo />
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      {/* Footer */}
      <Box as="footer" bg="gray.800" color="white" mt={16}>
        <Container maxW="7xl" py={8}>
          <Text textAlign="center">
            &copy; 2024 Donation Campaign. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
