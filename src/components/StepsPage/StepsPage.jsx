import { Flex, Box, Button, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, DrawerFooter } from "@chakra-ui/react"
import PropTypes from "prop-types"
import { useRef } from "react"
import { useDisclosure } from "@chakra-ui/react"
import Steps from "../Steps/Steps"
import { Car, Tricycle, Walk } from "../vehicles/Vehicles"

const StepsPage = ({ start, end, renderedSteps, isLoading }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    if (isLoading) {
        return;
    }

    return (
        <>
            <Button ref={btnRef} colorScheme='gray' onClick={onOpen}>
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
                            <Flex gap='30px' alignItems='center' bgColor='#efefef' minHeight='100px' borderRadius='15px' padding='30px'>
                                <Box><Walk /></Box>
                                <Box>
                                    <Box fontSize='14px'>Walk to</Box>
                                    <Box fontWeight='bold'>{renderedSteps[0] ? renderedSteps[0].name : null}</Box>
                                    <Box fontSize='12px' color='#9a9a9a'>{start}</Box>
                                </Box>
                            </Flex>
                            {renderedSteps.length > 0 ? renderedSteps.map((stopover, index) => (
                                <Flex key={index} alignItems='center' bgColor='#efefef' gap='30px' minHeight='100px' borderRadius='15px' padding='30px'>
                                    <Box>{stopover.vehicles[0] === 'car' ? <Car /> : stopover.vehicles[0] === 'tricycle' ? <Tricycle /> : null}</Box>
                                    <Box>
                                        <Box fontSize='14px'>{stopover.vehicles[0] === 'car' ? 'Take car to ' : stopover.vehicles[0] === 'tricycle' ? 'Take tricycle to ' : null}</Box>
                                        <Box fontWeight='bold'>{renderedSteps[index + 1] ? renderedSteps[index + 1].name : end}</Box>
                                        <Box fontSize='12px' color='#9a9a9a'>{stopover.name}</Box>
                                    </Box>
                                </Flex>
                            )) : null}
                            <Flex gap='30px' alignItems='center' bgColor='#efefef' minHeight='100px' borderRadius='15px' padding='30px'>
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
                        <Flex width='100%' flexDirection='column' alignItems='center'>
                            {renderedSteps.length > 0 ? <Steps renderedSteps={renderedSteps} isLoading={isLoading} /> : null}
                            <Button width='100%'>Change Route</Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

StepsPage.propTypes = {
    renderedSteps: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
}

export default StepsPage