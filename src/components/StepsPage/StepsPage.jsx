import { Select, Flex, Box, Button, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, DrawerFooter } from "@chakra-ui/react"
import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { useDisclosure } from "@chakra-ui/react"
import Steps from "../Steps/Steps"
import { Car, Tricycle, Walk } from "../vehicles/Vehicles"

const StepsPage = ({ start, end, renderedSteps, setRenderedSteps, isLoading }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedOption, setSelectedOption] = useState(1);
    // const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
    const btnRef = useRef();

    function assignNewVehicles(vehicleCombinations) {
        const newRenderedSteps = renderedSteps.map((step, index) => ({
            ...step,
            vehicles: vehicleCombinations[selectedOption][index],
        }));
        (`new Rendered Steps`, newRenderedSteps)
        setRenderedSteps(newRenderedSteps);
    }

    function getVehicleCombinations(renderedSteps) {
        const permute = (arr) => {
            if (arr.length <= 1) return [arr];
            const output = [];
            const swapInPlace = (arrayToSwap, indexA, indexB) => {
                const temp = arrayToSwap[indexA];
                arrayToSwap[indexA] = arrayToSwap[indexB];
                arrayToSwap[indexB] = temp;
            };
            const generate = (n, heapArray) => {
                if (n === 1) {
                    output.push(heapArray.slice());
                    return;
                }
                generate(n - 1, heapArray);
                for (let i = 0; i < n - 1; i++) {
                    if (n % 2 === 0) {
                        swapInPlace(heapArray, i, n - 1);
                    } else {
                        swapInPlace(heapArray, 0, n - 1);
                    }
                    generate(n - 1, heapArray);
                }
            };
            generate(arr.length, arr.slice());
            return output;
        };

        const combinations = [];
        const helper = (current, remaining) => {
            if (remaining.length === 0) {
                combinations.push(current);
            } else {
                const [first, ...rest] = remaining;
                for (const permutation of permute(first.vehicles)) {
                    helper([...current, permutation], rest);
                }
            }
        };
        helper([], renderedSteps);

        return combinations;
    }

    if (isLoading) {
        return;
    }

    const vehicleCombinations = getVehicleCombinations(renderedSteps);

    // const renderedVehicles = renderedSteps.map((step) => step.vehicles);
    // const matchIndex = vehicleCombinations.findIndex(
    //     (combination) =>
    //         combination.length === renderedVehicles.length &&
    //         combination.every((value, i) => value === renderedVehicles[i])
    // );

    return (
        <>
            <Button ref={btnRef} colorScheme='blackAlpha 500' bgColor='#121212' onClick={onOpen}>
                Open Detailed View
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
                size={'full'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader paddingTop='30px'>Directions: </DrawerHeader>

                    <DrawerBody>
                        <Flex flexDirection='column' gap='20px' justifyContent='center' margin='30px 0'>
                            {/* {write the logic to show the steps how it appears in the mockup here} */}
                            <Flex gap='30px' alignItems='center' bgColor='gray.100' minHeight='100px' borderRadius='15px' padding='30px'>
                                <Box><Walk /></Box>
                                <Box>
                                    <Box fontSize='14px'>Walk to</Box>
                                    <Box fontWeight='bold'>{renderedSteps[0] ? renderedSteps[0].name : null}</Box>
                                    <Box fontSize='12px' color='#9a9a9a'>{start}</Box>
                                </Box>
                            </Flex>
                            {renderedSteps.length > 0 ? renderedSteps.map((stopover, index) => (
                                <Flex key={index} alignItems='center' bgColor='gray.100' gap='30px' minHeight='100px' borderRadius='15px' padding='30px'>
                                    <Box>{stopover.vehicles[0] === 'car' ? <Car /> : stopover.vehicles[0] === 'tricycle' ? <Tricycle /> : null}</Box>
                                    <Box>
                                        <Box fontSize='14px'>{stopover.vehicles[0] === 'car' ? 'Take car to ' : stopover.vehicles[0] === 'tricycle' ? 'Take tricycle to ' : null}</Box>
                                        <Box fontWeight='bold'>{renderedSteps[index + 1] ? renderedSteps[index + 1].name : end}</Box>
                                        <Box fontSize='12px' color='#9a9a9a'>{stopover.name}</Box>
                                    </Box>
                                </Flex>
                            )) : null}
                            <Flex gap='30px' alignItems='center' bgColor='gray.100' minHeight='100px' borderRadius='15px' padding='30px'>
                                <Box><Walk /></Box>
                                <Box>
                                    <Box fontSize='14px'>Walk to</Box>
                                    <Box fontWeight='bold'>{end}</Box>
                                    <Box fontSize='12px' color='#9a9a9a'>{renderedSteps ? renderedSteps[renderedSteps.length - 1] ? renderedSteps[renderedSteps.length - 1].name : null : null}</Box>
                                </Box>
                            </Flex>
                        </Flex>

                    </DrawerBody>

                    <DrawerFooter>
                        <Box padding='20px' borderRadius='15px' width='100%'>
                            <Flex width='100%' flexDirection='column' alignItems='center'>
                                {renderedSteps.length > 0 ? <Steps renderedSteps={renderedSteps} isLoading={isLoading} /> : null}
                                <Button width='100%' colorScheme='blackAlpha 500' bgColor='#121212' onClick={() => { assignNewVehicles(vehicleCombinations); setSelectedOption(0); }}>Change Route</Button>
                            </Flex>
                            <Select paddingTop='10px' value={selectedOption} onChange={(event) => setSelectedOption(event.target.value)}>
                                {vehicleCombinations.map((combination, index) => (
                                    <option key={index} value={index}>walk&nbsp;-&gt;&nbsp;{
                                        combination.map((vehicle, index) => (
                                            <span key={index} >
                                                    {
                                                        vehicle[0] === 'car' ? 'car' : vehicle[0] === 'tricycle' ? 'tricycle' : 'walk'
                                                    }
                                                    {" -> "}
                                            </span>
                                        ))
                                    }walk</option>
                                ))}
                            </Select>
                        </Box>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

StepsPage.propTypes = {
    renderedSteps: PropTypes.array.isRequired,
    setRenderedSteps: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
}

export default StepsPage