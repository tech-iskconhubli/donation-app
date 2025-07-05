'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  VStack,
  HStack,
  Button,
  Badge,
  Link,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon, CalendarIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { CampaignConfig } from '@/data/campaignConfig';
import { loadCampaignsFromStorage } from '@/utils/fileStorage';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<{[key: string]: CampaignConfig}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    loadCampaignsData();
  }, []);

  const loadCampaignsData = async () => {
    try {
      const loadedCampaigns = await loadCampaignsFromStorage();
      setCampaigns(loadedCampaigns);
      setError(null);
    } catch (err) {
      console.error('Error loading campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const CampaignCard = ({ campaign }: { campaign: CampaignConfig }) => {
    return (
      <Card
        bg={cardBg}
        shadow="lg"
        borderRadius="lg"
        overflow="hidden"
        border="1px"
        borderColor={borderColor}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-4px)',
          shadow: 'xl',
        }}
      >
        {/* Campaign Image */}
        {campaign.campaignImageUrl && (
          <Box position="relative" height="200px">
            <Image
              src={campaign.campaignImageUrl}
              alt={campaign.header}
              objectFit="cover"
              width="100%"
              height="100%"
            />
            <Box
              position="absolute"
              top={3}
              right={3}
              bg="white"
              px={2}
              py={1}
              borderRadius="md"
              shadow="sm"
            >
              <Badge colorScheme="green" fontSize="xs">
                Active
              </Badge>
            </Box>
          </Box>
        )}

        <CardBody p={{ base: 4, md: 6 }}>
          <VStack align="start" spacing={{ base: 3, md: 4 }}>
            {/* Campaign Header */}
            <Heading as="h3" size={{ base: 'sm', md: 'md' }} lineHeight="short" noOfLines={2}>
              {campaign.header || 'Untitled Campaign'}
            </Heading>

            {/* Campaign Details */}
            <Text color="gray.600" fontSize={{ base: 'xs', md: 'sm' }} noOfLines={3}>
              {truncateText(campaign.details.split('\n\n')[0])}
            </Text>

            {/* Campaign Metadata */}
            <VStack align="start" spacing={2} width="100%">
              <HStack spacing={2} fontSize="xs" color="gray.500">
                <CalendarIcon />
                <Text>Created: {formatDate(campaign.createdAt)}</Text>
              </HStack>
              
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                ID: {campaign.id}
              </Text>
            </VStack>

            {/* Action Buttons */}
            <HStack spacing={{ base: 2, md: 3 }} width="100%">
              <Button
                as={NextLink}
                href={`/campaign/${campaign.id}`}
                colorScheme="brand"
                size={{ base: 'xs', md: 'sm' }}
                flex={1}
                rightIcon={<ExternalLinkIcon />}
              >
                Donate Now
              </Button>
              
              <Button
                as={NextLink}
                href={`/campaign/${campaign.id}`}
                variant="outline"
                size={{ base: 'xs', md: 'sm' }}
                target="_blank"
              >
                View
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="7xl" py={8}>
          <Flex justify="center" align="center" minH="400px">
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" />
              <Text color="gray.600">Loading campaigns...</Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Container maxW="7xl" py={8}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Error Loading Campaigns</Text>
              <Text>{error}</Text>
              <Button size="sm" onClick={loadCampaignsData} colorScheme="red" variant="outline">
                Try Again
              </Button>
            </VStack>
          </Alert>
        </Container>
      </Box>
    );
  }

  const campaignList = Object.values(campaigns).filter(campaign => campaign.active !== false);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header Section */}
      <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 8 }}>
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} color="gray.800">
              All Donation Campaigns
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.600" maxW="2xl">
              Support meaningful causes and make a difference in the community. 
              Choose from our active campaigns and contribute to positive change.
            </Text>
            <HStack spacing={4} mt={4}>
              <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                {campaignList.length} Active Campaign{campaignList.length !== 1 ? 's' : ''}
              </Badge>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Campaigns Grid */}
      <Container maxW="7xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 8 }}>
        {campaignList.length === 0 ? (
          <Alert status="info" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">No Campaigns Available</Text>
              <Text>There are currently no active campaigns. Please check back later.</Text>
              <HStack spacing={4} mt={4}>
                <Button as={NextLink} href="/admin" colorScheme="brand" size="sm">
                  Create Campaign
                </Button>
                <Button as={NextLink} href="/" variant="outline" size="sm">
                  Go Home
                </Button>
              </HStack>
            </VStack>
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }}>
            {campaignList
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
          </SimpleGrid>
        )}
      </Container>

      {/* Footer Navigation */}
      <Box bg="white" borderTop="1px" borderColor="gray.200" py={6}>
        <Container maxW="7xl">
          <Flex justify="center" gap={6} flexWrap="wrap">
            <Link as={NextLink} href="/" color="brand.500" fontWeight="medium">
              Home
            </Link>
            {/* <Link as={NextLink} href="/admin" color="brand.500" fontWeight="medium">
              Admin Dashboard
            </Link> */}
            <Link href="mailto:dcc.iskconhubli@gmail.com" color="brand.500" fontWeight="medium">
              Email: dcc.iskconhubli@gmail.com
            </Link>
            <Link 
              href="tel:=919342111008" 
              color="brand.500" 
              fontWeight="medium"
            >
              Contact: +91 9342111008
            </Link>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default CampaignsList;
