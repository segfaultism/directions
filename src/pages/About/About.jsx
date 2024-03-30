import React from "react";
import TopBar from "../../components/TopBar/TopBar";
import {
  Box,
  Heading,
  VStack,
  Grid,
  Text,
  Image,
  Flex,
} from "@chakra-ui/react";

const About = () => {
  return (
    <div>
      <TopBar />
      <Box ml="10px" p={4}>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Our Story
            </Text>
            <Box borderWidth={1} borderRadius="lg" p="10px" mt={4}>
              Describe your company's origin story here. Briefly explain how it
              came to be and what inspired its creation. You can mention the
              founding team, core values, or any significant milestones.
            </Box>
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              What We Do
            </Text>
            <Box borderWidth={1} borderRadius="lg" p="10px" mt={4}>
              Outline the core services or products your company offers. Briefly
              explain how they solve problems or add value to your customers'
              lives. You can mention your target audience and unique selling
              points here.
            </Box>
          </Box>
        </Grid>
        <Flex mt={8} justifyContent="flex-start">
          <Text fontSize="lg" fontWeight="bold">
            Meet Our Team (Optional)
          </Text>
        </Flex>
        <Flex flexDirection="column" alignItems="flex-start" gap="10px"  mt={4} spacing={4}>
          {/* Add Team Member Components Here */}
          <TeamMember name="Haniel Onoja" title="CEO" />
          <TeamMember name="Stephen Adebambo" title="CTO" />
        </Flex>
      </Box>
    </div>
  );
};

const TeamMember = ({ name, title }) => (
  <Box as="section" borderWidth={1} borderRadius="lg" p={4}>
    <Heading as="h3" fontSize="md">
      {name}
    </Heading>
    <Text>{title}</Text>
  </Box>
);

export default About;
