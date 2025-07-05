import {
  Box,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Divider,
} from '@chakra-ui/react';

const ContactInfo = () => {
  return (
    <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="lg" shadow="lg">
      <Heading as="h2" size={{ base: 'md', md: 'lg' }} color="gray.800" mb={{ base: 4, md: 6 }}>
        Contact Information
      </Heading>
      
      <VStack spacing={6} align="stretch">
        {/* Address */}
        <Box>
          <Heading as="h3" size={{ base: 'sm', md: 'md' }} color="gray.700" mb={2}>
            Address
          </Heading>
          <Text color="gray.600" lineHeight="tall" fontSize={{ base: 'sm', md: 'md' }}>
            KSFC, Hubballi-Dharwad Road, Besides,<br />
            Rayapur, Hubballi, Karnataka 580009
          </Text>
        </Box>

        {/* Phone */}
        <Box>
          <Heading as="h3" size={{ base: 'sm', md: 'md' }} color="gray.700" mb={2}>
            Phone
          </Heading>
          <Link 
            href="tel:+919342111008" 
            color="brand.500" 
            _hover={{ color: 'brand.600' }}
            fontWeight="medium"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            +91 9342111008
          </Link>
        </Box>

        {/* Email */}
        <Box>
          <Heading as="h3" size={{ base: 'sm', md: 'md' }} color="gray.700" mb={2}>
            Email
          </Heading>
          <Link 
            href="mailto:dcc.iskconhubli@gmail.com" 
            color="brand.500" 
            _hover={{ color: 'brand.600' }}
            fontWeight="medium"
            fontSize={{ base: 'sm', md: 'md' }}
          >
            dcc.iskconhubli@gmail.com
          </Link>
        </Box>

        {/* Timings */}
        <Box>
          <Heading as="h3" size={{ base: 'sm', md: 'md' }} color="gray.700" mb={2}>
            Timings
          </Heading>
          <TableContainer>
            <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
              <Thead bg="gray.50">
                <Tr>
                  <Th>Time</Th>
                  <Th>Weekdays</Th>
                  <Th>Sundays</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td fontWeight="medium">Morning</Td>
                  <Td>9:30am to 1pm</Td>
                  <Td>9:30am to 1:30pm</Td>
                </Tr>
                <Tr>
                  <Td fontWeight="medium">Evening</Td>
                  <Td>4:15pm to 8pm</Td>
                  <Td>4:15pm to 8pm</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        {/* Additional Info */}
        <Box pt={4}>
          <Divider mb={4} />
          <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500">
            For any queries or assistance, please feel free to contact us during our working hours.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContactInfo;
