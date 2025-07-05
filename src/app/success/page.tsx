'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
  Alert,
  AlertIcon,
  Badge,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('captured');

  useEffect(() => {
    const campaign = searchParams.get('campaign');
    const payment = searchParams.get('payment');
    const status = searchParams.get('status') || 'captured';
    
    setCampaignId(campaign);
    setPaymentId(payment);
    setPaymentStatus(status);
  }, [searchParams]);

  const getBackUrl = () => {
    return campaignId ? `/campaign/${campaignId}` : '/';
  };

  const getStatusInfo = () => {
    switch (paymentStatus) {
      case 'captured':
        return {
          icon: CheckCircleIcon,
          color: 'green.500',
          title: 'Payment Successful!',
          message: 'Your payment has been processed and captured successfully.',
          badge: { text: 'Captured', colorScheme: 'green' }
        };
      case 'authorized':
        return {
          icon: WarningIcon,
          color: 'orange.500',
          title: 'Payment Authorized',
          message: 'Your payment is authorized but capture failed. We will process it manually.',
          badge: { text: 'Authorized', colorScheme: 'orange' }
        };
      case 'error':
        return {
          icon: WarningIcon,
          color: 'red.500',
          title: 'Payment Processing Issue',
          message: 'There was an issue processing your payment. Please contact support.',
          badge: { text: 'Error', colorScheme: 'red' }
        };
      default:
        return {
          icon: CheckCircleIcon,
          color: 'green.500',
          title: 'Payment Received',
          message: 'Thank you for your donation.',
          badge: { text: 'Received', colorScheme: 'blue' }
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Box minH="100vh" bg="gray.100">
      <Flex align="center" justify="center" minH="100vh">
        <Container maxW="md">
          <Box bg="white" p={8} borderRadius="lg" shadow="lg">
            <VStack spacing={6} textAlign="center">
              <Icon as={statusInfo.icon} w={16} h={16} color={statusInfo.color} />
              
              <VStack spacing={2}>
                <Heading as="h1" size="lg" color="gray.800">
                  {statusInfo.title}
                </Heading>
                
                <Badge {...statusInfo.badge}>
                  {statusInfo.badge.text}
                </Badge>
              </VStack>
              
              <Text color="gray.600" lineHeight="tall">
                {statusInfo.message}
              </Text>
              
              {paymentId && (
                <Box p={3} bg="gray.50" borderRadius="md" w="100%">
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    Payment ID:
                  </Text>
                  <Text fontSize="sm" fontFamily="mono" color="gray.800" wordBreak="break-all">
                    {paymentId}
                  </Text>
                </Box>
              )}
              
              {campaignId && (
                <Text fontSize="sm" color="gray.500">
                  Campaign: {campaignId}
                </Text>
              )}
              
              {paymentStatus === 'authorized' && (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Your payment is secure. We will manually process the capture and notify you via email.
                  </Text>
                </Alert>
              )}
              
              <VStack spacing={4}>
                <Text fontSize="sm" color="gray.500">
                  You will receive a confirmation email shortly with your donation receipt.
                </Text>
                
                <HStack spacing={4} pt={4}>
                  <Button as={Link} href={getBackUrl()} size="lg">
                    Back to Campaign
                  </Button>
                  
                  <Button 
                    as={Link} 
                    href="/" 
                    variant="outline" 
                    size="lg"
                  >
                    Home
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Container>
      </Flex>
    </Box>
  );
}
