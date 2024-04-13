import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
//import { decode } from "google-polyline";

import "./Mapper.css";

// 9.019003155300735, 7.4034337963246895
const center = { lat: 9.019003155300735, lng: 7.4034337963246895 };

const Mapper = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  // const [isLocOnEdge, setIsLocOnEdge] = useState(false);
  let tripPath = "";
  let routePoly = "";
  let isLocOnEdge = false;

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        // eslint-disable-next-line no-undef
        if (status === google.maps.DirectionsStatus.OK) {
          // eslint-disable-next-line no-undef
          routePoly = new google.maps.Polyline({
            path: result.routes[0].overview_path,
          });
          tripPath = result.routes[0].overview_path;
          setDirectionsResponse(result);
          setDistance(result.routes[0].legs[0].distance.text);
          isLocOnEdge = checkLocationOnRoute(
            { lat: 9.000773817210234, lng: 7.4247825800350995 },
            result.routes[0].overview_path
          );
          let something = calculateDistance(
            result.routes[0].legs[0].start_location.lat(),
            result.routes[0].legs[0].start_location.lng(),
            9.000773817210234,
            7.4247825800350995
          );
          console.log(isLocOnEdge);
          console.log(something);
          makeSteps();
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
    tripPath = "";
    isLocOnEdge = false;
  }

  function checkLocationOnRoute(coord, poly) {
    poly = routePoly;
    //eslint-disable-next-line no-undef
    return google.maps.geometry.poly.isLocationOnEdge(coord, poly, 10e-4);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function makeSteps() {
    let stops = [
      {
        name: "galadima-park",
        location: { lat: 9.000773817210234, lng: 7.4247825800350995 },
        vehicles: ["car", "tricycle"],
      },
      {
        name: "coca-cola-junction",
        location: { lat: 9.025409820450733, lng: 7.411018588742447 },
        vehicles: ["car", "tricycle"],
      },
      {
        name: "airport-junction",
        location: { lat: 9.063944868849863, lng: 7.410415820146386 },
        vehicles: ["car", "tricycle"],
      },
      {
        name: "idu-junction",
        location: { lat: 9.036488220963722, lng: 7.411936998664936 },
        vehicles: ["car", "tricycle"],
      },
    ];
    let validStops = [];

    stops.forEach((stop) => {
      if (checkLocationOnRoute(stop.location, routePoly)) {
        validStops.push(stop);
      }
    });

    validStops.sort((a, b) => {
      let aDist = calculateDistance(
        a.location.lat,
        a.location.lng,
        9.000773817210234,
        7.4247825800350995
      );
      let bDist = calculateDistance(
        b.location.lat,
        b.location.lng,
        9.000773817210234,
        7.4247825800350995
      );
      return aDist - bDist;
    });

    console.log(validStops);
  }

  return (
    <Flex flexDirection="column" alignItems="flex-start" h="80vh" w="100%">
      <Box
        p={4}
        mb="10px"
        bgColor="white"
        shadow="base"
        minW="250px"
        zIndex="1"
      >
        <Flex
          spacing={2}
          gap="4px"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                focusBorderColor="#121212"
                type="text"
                placeholder="Origin"
                ref={originRef}
              />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                focusBorderColor="#121212"
                type="text"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button
              className="search-button"
              colorScheme="blackAlpha 500"
              type="submit"
              onClick={calculateRoute}
            >
              Get Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(12);
            }}
          />
        </Flex>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          {distance ? <Text>Distance: {distance}</Text> : null}
          {duration ? <Text>Duration: {duration}</Text> : null}
        </HStack>
      </Box>
      <Box h="100%" w="100%">
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            tilt: 45,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
    </Flex>
  );
};

export default Mapper;
