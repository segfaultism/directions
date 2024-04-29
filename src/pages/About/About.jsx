import TopBar from "../../components/TopBar/TopBar";
import PropTypes from 'prop-types';
import {
  Box,
  Heading,
  Grid,
  Text,
} from "@chakra-ui/react";

const About = () => {
  return (
    <div>
      <TopBar />
      <Box ml="10px" p={4}>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          <Box>
          </Box>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Goal
            </Text>
            <Box borderWidth={1} borderRadius="lg" p="10px" mt={4}>
              To make it easier for commuters to obtain accurate directions and navigate public transportation options.
            </Box>
          </Box>
        </Grid>
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

TeamMember.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default About;