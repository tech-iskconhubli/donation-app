'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  Textarea,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  Link,
  Image,
  Text,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Card,
  CardBody,
  IconButton,
  Badge,
  useClipboard,
  Switch,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ExternalLinkIcon, CopyIcon, AddIcon } from '@chakra-ui/icons';
import {
  CampaignConfig
} from '@/data/campaignConfig';
import { loadCampaignsFromStorage, saveCampaignsToStorage } from '@/utils/fileStorage';
import NextLink from 'next/link';

const AdminPage = () => {
  const [campaigns, setCampaigns] = useState<{[key: string]: CampaignConfig}>({});
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [config, setConfig] = useState<Omit<CampaignConfig, 'id' | 'createdAt' | 'updatedAt'>>({
    header: '',
    bannerImageUrl: '',
    campaignImageUrl: '',
    details: '',
    active: true
  });
  const [customCampaignId, setCustomCampaignId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [campaignToDelete, setCampaignToDelete] = useState<string>('');

  useEffect(() => {
    loadCampaignsData();
  }, []);

  const loadCampaignsData = async () => {
    try {
      const loadedCampaigns = await loadCampaignsFromStorage();
      setCampaigns(loadedCampaigns);
      
      // Select first campaign if none selected
      if (!selectedCampaignId && Object.keys(loadedCampaigns).length > 0) {
        const firstCampaignId = Object.keys(loadedCampaigns)[0];
        setSelectedCampaignId(firstCampaignId);
        loadCampaignConfig(loadedCampaigns[firstCampaignId]);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: 'Error',
        description: 'Failed to load campaigns',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadCampaignConfig = (campaign: CampaignConfig) => {
    setConfig({
      header: campaign.header,
      bannerImageUrl: campaign.bannerImageUrl,
      campaignImageUrl: campaign.campaignImageUrl,
      details: campaign.details,
      active: campaign.active ?? true // Default to true for backward compatibility
    });
  };

  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSwitchChange = (checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      active: checked
    }));
    setSaved(false);
  };

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    const campaign = campaigns[campaignId];
    if (campaign) {
      loadCampaignConfig(campaign);
      setCustomCampaignId(campaign.id); // Pre-fill the custom ID field
      setIsEditing(false);
      setSaved(false);
    }
  };

  const handleEditMode = () => {
    // When entering edit mode, ensure the campaign ID field is populated
    if (selectedCampaignId && campaigns[selectedCampaignId]) {
      setCustomCampaignId(campaigns[selectedCampaignId].id);
    }
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    // Reset form
    setConfig({
      header: 'New Campaign',
      bannerImageUrl: '',
      campaignImageUrl: '',
      details: 'Enter campaign details here...',
      active: true
    });
    setCustomCampaignId('');
    setIsEditing(true);
    setSelectedCampaignId(''); // Clear selection to indicate new campaign

    toast({
      title: 'New Campaign',
      description: 'Fill in the details and save to create a new campaign.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSave = async () => {
    // Validate campaign ID if provided
    const campaignId = customCampaignId.trim() || generateUUID();
    
    // Check if campaign ID already exists (only for new campaigns or when changing ID)
    if (!selectedCampaignId || (selectedCampaignId !== campaignId)) {
      if (campaigns[campaignId]) {
        toast({
          title: 'Error',
          description: 'Campaign ID already exists. Please choose a different ID.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    const now = new Date().toISOString();
    
    try {
      if (selectedCampaignId && selectedCampaignId === campaignId) {
        // Updating existing campaign
        const updatedCampaign: CampaignConfig = {
          ...campaigns[selectedCampaignId],
          ...config,
          updatedAt: now
        };

        const updatedCampaigns = {
          ...campaigns,
          [selectedCampaignId]: updatedCampaign
        };

        setCampaigns(updatedCampaigns);
        await saveCampaignsToStorage(updatedCampaigns);
      } else {
        // Creating new campaign or updating with new ID
        const newCampaign: CampaignConfig = {
          id: campaignId,
          ...config,
          createdAt: selectedCampaignId ? campaigns[selectedCampaignId].createdAt : now,
          updatedAt: now
        };

        const updatedCampaigns = { ...campaigns };
        
        // Remove old campaign if ID changed
        if (selectedCampaignId && selectedCampaignId !== campaignId) {
          delete updatedCampaigns[selectedCampaignId];
        }
        
        updatedCampaigns[campaignId] = newCampaign;

        setCampaigns(updatedCampaigns);
        await saveCampaignsToStorage(updatedCampaigns);
        setSelectedCampaignId(campaignId);
      }

      setSaved(true);
      setIsEditing(false);
      // Keep the campaign ID in the field after saving
      setCustomCampaignId(campaignId);

      toast({
        title: 'Campaign Saved',
        description: `Campaign saved with ID: ${campaignId}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to save campaign. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (campaignId: string) => {
    setCampaignToDelete(campaignId);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    const updatedCampaigns = { ...campaigns };
    delete updatedCampaigns[campaignToDelete];
    
    setCampaigns(updatedCampaigns);
    saveCampaignsToStorage(updatedCampaigns);

    // Select another campaign if the deleted one was selected
    if (selectedCampaignId === campaignToDelete) {
      const remainingIds = Object.keys(updatedCampaigns);
      if (remainingIds.length > 0) {
        setSelectedCampaignId(remainingIds[0]);
        loadCampaignConfig(updatedCampaigns[remainingIds[0]]);
      } else {
        setSelectedCampaignId('');
        setConfig({
          header: '',
          bannerImageUrl: '',
          campaignImageUrl: '',
          details: '',
          active: '',        
          id: '',
          createdAt: '',
          updatedAt: ''
        });
      }
    }

    onDeleteClose();
    setCampaignToDelete('');

    toast({
      title: 'Campaign Deleted',
      description: 'Campaign has been deleted successfully.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const CampaignCard = ({ campaign }: { campaign: CampaignConfig }) => {
    const { onCopy } = useClipboard(`${window.location.origin}/campaign/${campaign.id}`);
    
    return (
      <Card>
        <CardBody>
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="100%">
              <Heading size="sm" noOfLines={1}>
                {campaign.header || 'Untitled Campaign'}
              </Heading>
              <Badge colorScheme={campaign.active ? (selectedCampaignId === campaign.id ? 'blue' : 'green') : 'red'}>
                {campaign.active ? 
                  (selectedCampaignId === campaign.id ? 'Selected' : 'Active') : 
                  'Inactive'
                }
              </Badge>
            </HStack>
            
            {campaign.bannerImageUrl && (
              <Image
                src={campaign.bannerImageUrl}
                alt="Banner"
                maxH="80px"
                w="100%"
                objectFit="cover"
                borderRadius="md"
              />
            )}
            
            <Text fontSize="xs" color="gray.500" noOfLines={2}>
              ID: {campaign.id}
            </Text>
            
            <Text fontSize="xs" color="gray.500">
              Updated: {new Date(campaign.updatedAt).toLocaleDateString()}
            </Text>
            
            <HStack spacing={2} w="100%">
              <Button
                size="xs"
                onClick={() => handleCampaignSelect(campaign.id)}
                variant={selectedCampaignId === campaign.id ? 'solid' : 'outline'}
                flex={1}
              >
                {selectedCampaignId === campaign.id ? 'Selected' : 'Select'}
              </Button>
              
              <IconButton
                size="xs"
                aria-label="Copy URL"
                icon={<CopyIcon />}
                onClick={onCopy}
              />
              
              <IconButton
                size="xs"
                aria-label="View Campaign"
                icon={<ExternalLinkIcon />}
                as={NextLink}
                href={`/campaign/${campaign.id}`}
                target="_blank"
              />
              
              <IconButton
                size="xs"
                aria-label="Delete Campaign"
                icon={<DeleteIcon />}
                colorScheme="red"
                onClick={() => handleDelete(campaign.id)}
              />
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Box minH="100vh" bg="gray.100">
      {/* Header */}
      <Box as="header" bg="white" shadow="sm">
        <Container maxW="7xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 8 }}>
          <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={{ base: 4, md: 0 }}>
            <Heading as="h1" size={{ base: 'lg', md: 'xl' }} color="gray.800" textAlign={{ base: 'center', md: 'left' }}>
              Campaign Admin Dashboard
            </Heading>
            <HStack spacing={4}>
              <Link as={NextLink} href="/campaigns" color="brand.500" _hover={{ color: 'brand.600' }} fontWeight="medium">
                View All Campaigns
              </Link>
              <Link as={NextLink} href="/" color="brand.500" _hover={{ color: 'brand.600' }} fontWeight="medium">
                ← Back to Home
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container as="main" maxW="7xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Campaigns List */}
          <Box>
            <HStack justify="space-between" mb={4} direction={{ base: 'column', sm: 'row' }} align={{ base: 'stretch', sm: 'center' }} gap={{ base: 4, sm: 0 }}>
              <Heading as="h2" size={{ base: 'md', md: 'lg' }} color="gray.800">
                All Campaigns
              </Heading>
              <Button leftIcon={<AddIcon />} onClick={handleCreateNew} size={{ base: 'sm', md: 'md' }}>
                Create New Campaign
              </Button>
            </HStack>
            
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 3, md: 4 }}>
              {Object.values(campaigns).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </SimpleGrid>
          </Box>

          {/* Campaign Editor */}
          {(selectedCampaignId || isEditing) && (
            <Box bg="white" p={6} borderRadius="lg" shadow="lg">
              <HStack justify="space-between" mb={6}>
                <Heading as="h2" size="lg" color="gray.800">
                  {selectedCampaignId 
                    ? `Edit Campaign: ${campaigns[selectedCampaignId]?.header || 'Untitled'}` 
                    : 'Create New Campaign'
                  }
                </Heading>
                <HStack>
                  {!isEditing && selectedCampaignId && (
                    <Button leftIcon={<EditIcon />} onClick={handleEditMode}>
                      Edit
                    </Button>
                  )}
                  {selectedCampaignId && (
                    <Button
                      as={NextLink}
                      href={`/campaign/${selectedCampaignId}`}
                      target="_blank"
                      leftIcon={<ExternalLinkIcon />}
                      variant="outline"
                    >
                      Preview
                    </Button>
                  )}
                </HStack>
              </HStack>

              {saved && (
                <Alert status="success" mb={6} borderRadius="md">
                  <AlertIcon />
                  Campaign saved successfully!
                </Alert>
              )}

              <VStack spacing={6} align="stretch">
                {/* Campaign ID Configuration */}
                <FormControl>
                  <FormLabel>Campaign ID</FormLabel>
                  <Input
                    value={customCampaignId}
                    onChange={(e) => setCustomCampaignId(e.target.value)}
                    placeholder="Enter custom campaign ID (leave blank for auto-generated UUID)"
                    isReadOnly={!isEditing}
                  />
                  <FormHelperText>
                    {customCampaignId.trim() ? 
                      `Campaign URL will be: /campaign/${customCampaignId.trim()}` : 
                      'Leave blank to auto-generate a UUID'
                    }
                  </FormHelperText>
                </FormControl>

                {/* Header Configuration */}
                <FormControl>
                  <FormLabel>Campaign Header</FormLabel>
                  <Input
                    name="header"
                    value={config.header}
                    onChange={handleInputChange}
                    placeholder="Enter campaign header"
                    isReadOnly={!isEditing}
                  />
                </FormControl>

                {/* Active Status Toggle */}
                <FormControl>
                  <FormLabel>Campaign Status</FormLabel>
                  <HStack spacing={3}>
                    <Switch
                      id="campaign-active"
                      isChecked={config.active}
                      onChange={(e) => handleSwitchChange(e.target.checked)}
                      isDisabled={!isEditing}
                      colorScheme="green"
                      size="lg"
                    />
                    <Text fontSize="sm" color={config.active ? 'green.600' : 'red.500'} fontWeight="medium">
                      {config.active ? 'Active - Visible to donors' : 'Inactive - Hidden from public'}
                    </Text>
                  </HStack>
                  <FormHelperText>
                    Only active campaigns will be displayed on the campaigns listing page and available for donations.
                  </FormHelperText>
                </FormControl>

                {/* Banner Image URL Configuration */}
                <FormControl>
                  <FormLabel>Banner Image URL</FormLabel>
                  <Input
                    type="url"
                    name="bannerImageUrl"
                    value={config.bannerImageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter banner image URL"
                    isReadOnly={!isEditing}
                  />
                  {config.bannerImageUrl && (
                    <Box mt={3}>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Banner Preview:
                      </Text>
                      <Image
                        src={config.bannerImageUrl}
                        alt="Banner Preview"
                        maxW="100%"
                        maxH="150px"
                        objectFit="cover"
                        borderRadius="lg"
                        shadow="md"
                      />
                    </Box>
                  )}
                </FormControl>

                {/* Campaign Image URL Configuration */}
                <FormControl>
                  <FormLabel>Campaign Image URL</FormLabel>
                  <Input
                    type="url"
                    name="campaignImageUrl"
                    value={config.campaignImageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter campaign image URL"
                    isReadOnly={!isEditing}
                  />
                  {config.campaignImageUrl && (
                    <Box mt={3}>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Campaign Image Preview:
                      </Text>
                      <Image
                        src={config.campaignImageUrl}
                        alt="Campaign Preview"
                        maxW="100%"
                        maxH="150px"
                        objectFit="cover"
                        borderRadius="lg"
                        shadow="md"
                      />
                    </Box>
                  )}
                </FormControl>

                {/* Details Configuration */}
                <FormControl>
                  <FormLabel>Campaign Details</FormLabel>
                  <Textarea
                    name="details"
                    value={config.details}
                    onChange={handleInputChange}
                    rows={12}
                    placeholder="Enter campaign details"
                    isReadOnly={!isEditing}
                  />
                  <FormHelperText>
                    Use double line breaks (\n\n) to separate paragraphs
                  </FormHelperText>
                </FormControl>

                {/* Campaign URL Info */}
                {selectedCampaignId && (
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" fontWeight="bold" mb={2}>Campaign URL:</Text>
                    <Text fontSize="sm" color="blue.600" wordBreak="break-all">
                      {typeof window !== 'undefined' ? `${window.location.origin}/campaign/${selectedCampaignId}` : `/campaign/${selectedCampaignId}`}
                    </Text>
                  </Box>
                )}
              </VStack>

              {/* Action Buttons */}
              {isEditing && (
                <HStack spacing={4} mt={8}>
                  <Button onClick={handleSave} size="lg">
                    Save Configuration
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      if (selectedCampaignId) {
                        loadCampaignConfig(campaigns[selectedCampaignId]);
                        setCustomCampaignId(campaigns[selectedCampaignId].id);
                      } else {
                        setConfig({
                          header: '',
                          bannerImageUrl: '',
                          campaignImageUrl: '',
                          details: '',
                          active: true
                        });
                        setCustomCampaignId('');
                      }
                    }}
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                  >
                    Cancel
                  </Button>
                </HStack>
              )}
            </Box>
          )}
        </VStack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this campaign? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDelete} mr={3}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onDeleteClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminPage;
