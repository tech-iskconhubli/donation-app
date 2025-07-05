'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { processPayment, DonationFormData } from '@/lib/razorpay';

interface DonationFormProps {
  campaignId?: string;
}

const DonationForm = ({ campaignId }: DonationFormProps) => {
  const [formData, setFormData] = useState<DonationFormData>({
    fullName: '',
    email: '',
    phone: '',
    seva: '',
    donationAmount: 0,
    customAmount: undefined,
    taxExemption: false,
    panNumber: '',
    prasadam: false,
    address: '',
    pinCode: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const sevaOptions = [
    'Special Festival',
    'Annadanam',
    'Temple Construction',
    'Educational Framework',
    'Other'
  ];

  const donationAmounts = [500, 1000, 2500, 5000];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Indian mobile number';
    }

    if (!formData.seva) {
      newErrors.seva = 'Please select a seva option';
    }

    // Check if either custom amount or predefined amount is selected
    if (formData.customAmount !== undefined && formData.customAmount > 0) {
      // Custom amount is provided, validate it
      if (formData.customAmount <= 0) {
        newErrors.customAmount = 'Please enter a valid donation amount';
      } else if (formData.customAmount < 500) {
        newErrors.customAmount = 'Minimum donation amount is ₹500';
      }
    } else if (!formData.donationAmount || formData.donationAmount <= 0) {
      // No custom amount, check if predefined amount is selected
      newErrors.donationAmount = 'Please select or enter a donation amount';
    }

    // Validate PAN number if tax exemption is selected
    if (formData.taxExemption) {
      if (!formData.panNumber?.trim()) {
        newErrors.panNumber = 'PAN number is required for tax exemption';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim().toUpperCase())) {
        newErrors.panNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
      }
    }

    // Validate address and pin code if prasadam is selected
    if (formData.prasadam) {
      if (!formData.address?.trim()) {
        newErrors.address = 'Address is required for prasadam delivery';
      }
      if (!formData.pinCode?.trim()) {
        newErrors.pinCode = 'Pin code is required for prasadam delivery';
      } else if (!/^[1-9][0-9]{5}$/.test(formData.pinCode.trim())) {
        newErrors.pinCode = 'Please enter a valid 6-digit pin code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Include campaign ID in the payment data
      await processPayment({ ...formData, campaignId });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Payment failed. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear conditional field errors when unchecking checkboxes
    if (type === 'checkbox') {
      if (name === 'taxExemption' && !checked) {
        setFormData(prev => ({ ...prev, panNumber: '' }));
        setErrors(prev => ({ ...prev, panNumber: '' }));
      }
      if (name === 'prasadam' && !checked) {
        setFormData(prev => ({ ...prev, address: '', pinCode: '' }));
        setErrors(prev => ({ ...prev, address: '', pinCode: '' }));
      }
    }
  };

  const handleCustomAmountChange = (value: string) => {
    const numericValue = value ? parseInt(value) : undefined;
    
    setFormData(prev => ({
      ...prev,
      customAmount: numericValue,
      // Clear the predefined donation amount when custom amount is entered
      donationAmount: numericValue ? 0 : prev.donationAmount
    }));

    // Clear custom amount error when user starts typing
    if (errors.customAmount) {
      setErrors(prev => ({
        ...prev,
        customAmount: ''
      }));
    }
  };

  const handleDonationAmountChange = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      donationAmount: amount,
      customAmount: undefined // Clear custom amount when predefined amount is selected
    }));
    
    // Clear errors when a predefined amount is selected
    if (errors.donationAmount || errors.customAmount) {
      setErrors(prev => ({
        ...prev,
        donationAmount: '',
        customAmount: ''
      }));
    }
  };

  return (
    <Box 
      bg="white" 
      p={{ base: 4, md: 6 }} 
      borderRadius="lg" 
      shadow="lg"
      border="2px solid"
      borderColor="blue.200"
      _hover={{ borderColor: "blue.300" }}
      transition="border-color 0.2s"
    >
      <Heading as="h2" size={{ base: 'md', md: 'lg' }} color="gray.800" mb={{ base: 4, md: 6 }}>
        Make a Donation
      </Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {/* Full Name */}
          <FormControl isRequired isInvalid={!!errors.fullName}>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
            <FormErrorMessage>{errors.fullName}</FormErrorMessage>
          </FormControl>

          {/* Email */}
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          {/* Phone */}
          <FormControl isRequired isInvalid={!!errors.phone}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your 10-digit mobile number"
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          {/* Seva */}
          <FormControl isRequired isInvalid={!!errors.seva}>
            <FormLabel>Seva</FormLabel>
            <Select
              name="seva"
              value={formData.seva}
              onChange={handleInputChange}
              placeholder="Select a seva option"
            >
              {sevaOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
            <FormErrorMessage>{errors.seva}</FormErrorMessage>
          </FormControl>

          {/* Donation Amount */}
          <FormControl isRequired isInvalid={!!errors.donationAmount || !!errors.customAmount}>
            <FormLabel>Donation Amount</FormLabel>
            
            {/* Predefined Amount Buttons */}
            <Grid templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} gap={2} mb={3}>
              {donationAmounts.map(amount => (
                <GridItem key={amount}>
                  <Button
                    w="100%"
                    variant={formData.donationAmount === amount && (!formData.customAmount || formData.customAmount === 0) ? 'solid' : 'outline'}
                    onClick={() => handleDonationAmountChange(amount)}
                    size={{ base: 'sm', md: 'md' }}
                  >
                    ₹{amount}
                  </Button>
                </GridItem>
              ))}
            </Grid>
            
            {/* Custom Amount Input */}
            <NumberInput 
              min={500} 
              value={formData.customAmount || ''} 
              onChange={handleCustomAmountChange}
            >
              <NumberInputField placeholder="Custom Amount (Min: ₹500)" />
            </NumberInput>
            
            <FormErrorMessage>
              {errors.donationAmount || errors.customAmount}
            </FormErrorMessage>
          </FormControl>

          {/* Tax Exemption */}
          <VStack align="stretch" spacing={3}>
            <Checkbox
              name="taxExemption"
              isChecked={formData.taxExemption}
              onChange={handleInputChange}
            >
              I want 80G Tax Exemption
            </Checkbox>
            
            {/* PAN Number - Conditional Field */}
            {formData.taxExemption && (
              <FormControl isRequired isInvalid={!!errors.panNumber}>
                <FormLabel fontSize="sm">PAN Number</FormLabel>
                <Input
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your PAN number (e.g., ABCDE1234F)"
                  textTransform="uppercase"
                />
                <FormErrorMessage>{errors.panNumber}</FormErrorMessage>
              </FormControl>
            )}
          </VStack>

          {/* Prasadam */}
          <VStack align="stretch" spacing={3}>
            <Checkbox
              name="prasadam"
              isChecked={formData.prasadam}
              onChange={handleInputChange}
            >
              I want home-delivered Prasadam
            </Checkbox>
            
            {/* Address and Pin Code - Conditional Fields */}
            {formData.prasadam && (
              <VStack spacing={3} align="stretch">
                <FormControl isRequired isInvalid={!!errors.address}>
                  <FormLabel fontSize="sm">Delivery Address</FormLabel>
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete delivery address"
                    rows={2}
                    resize="vertical"
                  />
                  <FormErrorMessage>{errors.address}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.pinCode}>
                  <FormLabel fontSize="sm">Pin Code</FormLabel>
                  <Input
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit pin code"
                    maxLength={6}
                  />
                  <FormErrorMessage>{errors.pinCode}</FormErrorMessage>
                </FormControl>
              </VStack>
            )}
          </VStack>

          {/* Submit Button */}
          <Button
            type="submit"
            size={{ base: 'md', md: 'lg' }}
            w="100%"
            isLoading={isLoading}
            loadingText="Processing..."
          >
            Donate Now
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default DonationForm;
