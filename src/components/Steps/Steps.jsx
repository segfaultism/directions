import PropTypes from 'prop-types';
import { Flex, Box, Spinner } from '@chakra-ui/react';
import { Car, Tricycle, Walk } from "../vehicles/Vehicles";
import { useEffect } from 'react';

const Steps = ({ renderedSteps, isLoading }) => {
    console.log(renderedSteps);

    useEffect(() => {
        //
    }, [renderedSteps]);

    if (isLoading) return (<Box display='flex' justifyContent='center'><Spinner color='blue.500' size='xl' /></Box>)
    // return (renderedSteps.length > 1 ? renderedSteps[1].name : 'Loading...');
    // return (renderedSteps.map((stop, index) => (<div key={index}>{stop.name}</div>)))
    return (
        <Flex fontSize='3vw' alignItems='center' marginBottom='10px' justifyContent='center'>
            <Box padding='10px' bgColor='gray.100' borderRadius='md' marginRight='10px' >
                <Walk />
            </Box>
            <i className="ri-arrow-right-line" style={{ marginRight: '10px' }}></i>
            {renderedSteps ? renderedSteps.map((stopover, index) => (
                <Box key={index} display='flex' alignItems='center'>
                    <Box display='flex' borderRadius='md' margin='10px 10px 10px 0' bgColor='gray.100' padding='10px'>
                        {
                            stopover.vehicles[0] === 'car' ? <Car /> : stopover.vehicles[0] === 'tricycle' ? <Tricycle /> : <Walk />
                        }
                    </Box>
                    <i className="ri-arrow-right-line" style={{ marginRight: '10px' }}></i>
                </Box>
            )) : null}
            <Box padding='10px' bgColor='gray.100' borderRadius='md'>
                <Walk />
            </Box>
        </Flex>
    );
};

Steps.propTypes = {
    renderedSteps: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default Steps;