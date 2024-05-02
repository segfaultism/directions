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
  //eslint-disable-next-line no-unused-vars
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import Steps from "../Steps/Steps";
import StepsPage from "../StepsPage/StepsPage";

import "./Mapper.css";

// 9.019003155300735, 7.4034337963246895
const center = { lat: 9.019003155300735, lng: 7.4034337963246895 };

const Mapper = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */(null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stopovers, setStopovers] = useState([]);
  const [renderedSteps, setRenderedSteps] = useState([]);
  // let tripPath = ""
  //let transit = [];
  let routePoly = "";
  let stops = [
    {
      name: "Galadima Park",
      location: { lat: 9.000773817210234, lng: 7.4247825800350995 },
      vehicles: ["car", "tricycle"],
      coverage: [
        { lat: 9.063944868849863, lng: 7.410415820146386 }, // airport-junction
        { lat: 8.97364163497078, lng: 7.495721998664707 }, // apo
      ],
      // TODO: ADD POLYGON FOR CARS IF POSSIBLE
    },
    {
      name: "Coca-Cola Junction",
      location: { lat: 9.025409820450733, lng: 7.411018588742447 },
      vehicles: ["tricycle", "car"],
      coverage: [
        { lat: 9.063944868849863, lng: 7.410415820146386 }, // airport-junction
        { lat: 9.000773817210234, lng: 7.4247825800350995 }, // galadima
      ],
    },
    {
      name: "Airport Junction",
      location: { lat: 9.063944868849863, lng: 7.410415820146386 },
      vehicles: ["tricycle", "car"],
      coverage: [
        { lat: 9.072910884447833, lng: 7.410329304700747 }, // jabi
        { lat: 9.000773817210234, lng: 7.4247825800350995 }, // galadima
      ],
    },
    {
      name: "Idu Junction",
      location: { lat: 9.036460760344085, lng: 7.4119189771769 },
      vehicles: ["tricycle"],
      coverage: [
        { lat: 9.063944868849863, lng: 7.410415820146386 }, // airport-junction
        { lat: 9.000773817210234, lng: 7.4247825800350995 } // galadima
      ],
    },
  ];

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

  useEffect(() => {
    setRenderedSteps(stopovers);
  }, [stopovers])

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
          setDirectionsResponse(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setIsLoading(true);
          makeSteps(result.routes[0].legs[0].start_location, result.routes[0].legs[0].end_location)
            .then(() => {
              setIsLoading(false);
            })
            .catch(error => {
              console.log(`no stopovers bro: ${error}`);
              setIsLoading(false);
            });
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
    setStopovers([]);
    setRenderedSteps([]);
    originRef.current.value = "";
    destinationRef.current.value = "";
    //tripPath = "";
  }

  function checkLocationOnRoute(coord, poly) {
    poly = routePoly;
    //eslint-disable-next-line no-undef
    return google.maps.geometry.poly.isLocationOnEdge(coord, poly, 10e-4);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    //eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    //eslint-disable-next-line no-undef
    const start = new google.maps.LatLng(lat1, lon1);
    //eslint-disable-next-line no-undef
    const end = new google.maps.LatLng(lat2, lon2);

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin: start,
          destination: end,
          //eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          //eslint-disable-next-line no-undef
          if (status === google.maps.DirectionsStatus.OK) {
            const distance = result.routes[0].legs[0].distance.value;
            resolve(distance);
          } else {
            reject(`Error calculating distance: ${status}`);
          }
        }
      );
    });
  }

  async function makeSteps(origin, dest) { // add dest to check if dest is on current stop range
    let validStops = [];
    stops.forEach((stop) => {
      if (checkLocationOnRoute(stop.location, routePoly)) {
        validStops.push(stop);
      }
    });
    // Map the array to an array of Promises
    const distancePromises = validStops.map(async (stop) => {
      const distance = await calculateDistance(
        stop.location.lat,
        stop.location.lng,
        // Replace these with the coordinates you're calculating distance to
        origin.lat(),
        origin.lng()
      );
      return { stop, distance };
    });

    // Wait for all Promises to resolve
    const stopsWithDistances = await Promise.all(distancePromises);

    // Sort the array based on the distances
    const sortedStops = stopsWithDistances.sort(
      (a, b) => a.distance - b.distance
    );

    // Map the array back to an array of stops
    let sortedValidStops = sortedStops.map(({ stop }) => stop);

    // Generate the final steps and return them in stopovers
    let stopovers = [sortedValidStops[0]];
    let checkedStops = [sortedValidStops[0].name];

    for (let i = 0; i < sortedValidStops.length; i++) {
      let furthestStop = null;
      let maxDistance = 0;

      for (let j = 0; j < sortedValidStops.length; j++) {
        if (checkedStops.includes(sortedValidStops[j].name)) {
          continue;
        }
        checkedStops.push(sortedValidStops[j].name);
        let poly = await getPolyline(...sortedValidStops[i].coverage);

        if (checkLocationOnRoute(sortedValidStops[j].location, poly)) {
          console.log(sortedValidStops[j].name, sortedValidStops[i].name);
          console.log(checkLocationOnRoute(dest, poly))
          let distance = await calculateDistance(
            stopovers[stopovers.length - 1].location.lat,
            stopovers[stopovers.length - 1].location.lng,
            sortedValidStops[j].location.lat,
            sortedValidStops[j].location.lng
          );

          if (distance > maxDistance) {
            maxDistance = distance;
            furthestStop = sortedValidStops[j];
            if (furthestStop !== null) {
              stopovers[i + 1] = furthestStop;
            }
          }
        }
      }
    }

    // Update the state only once, after all calculations are done
    setStopovers(stopovers);
  }

  function getPolyline(...args) {
    //eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    const start = args[0];
    const end = args[args.length - 1];
    const waypoints = args.slice(1, -1).map((location) => ({
      location: location,
      stopover: true,
    }));

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin: start,
          destination: end,
          waypoints: waypoints,
          optimizeWaypoints: true,
          //eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          //eslint-disable-next-line no-undef
          if (status === google.maps.DirectionsStatus.OK) {
            const polylinePath = result.routes[0].overview_path;
            //eslint-disable-next-line no-undef
            const polyline = new google.maps.Polyline({
              path: polylinePath,
              geodesic: true,
              strokeColor: "#000000",
            });
            resolve(polyline);
          } else {
            reject(`Error: ${status}`);
          }
        }
      );
    });
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
      <Box minH="420px" maxH="100%" w="100%">
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
        <Box
          p={4}
          bgColor="white"
          shadow="base"
          w="100%"
          flexDirection="column"
          className="confirm-steps"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {stopovers.length > 0 ? <Steps renderedSteps={renderedSteps} isLoading={isLoading} /> : null}
          {/* {!(isLoading) ? renderedSteps.map((stop, index) => <div key={index}>{stop.name}</div>) : null} */}
          {(stopovers.length > 0) ? <StepsPage renderedSteps={renderedSteps} setRenderedSteps={setRenderedSteps} isLoading={isLoading} start={originRef.current.value} end={destinationRef.current.value}/> : null}
        </Box>
      </Box>
    </Flex>
  );
};

export default Mapper;
