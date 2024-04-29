import { Box } from "@chakra-ui/react";

const Car = () => {
    return (
        <Box>
           <i className="ri-car-fill"></i> 
        </Box>
    )
}


const Tricycle = () => {
    return (
        <Box>
           <i className="ri-e-bike-fill"></i> 
        </Box>
    )
}

const Walk = () => {
    return (
        <Box>
            <i className="ri-walk-fill"></i>
        </Box>
    )
}

export { Car, Tricycle, Walk }