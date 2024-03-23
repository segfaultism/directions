import {
  useDisclosure,
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import './NavMenu.css'

const NavMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <Button mr="24px" ref={btnRef} colorScheme="gray" onClick={onOpen}>
        <i className="ri-menu-line"></i>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link to="/">P-Ransit</Link>
          </DrawerHeader>

          <DrawerBody px="0px">
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <Box py="10px" px="24px">Directions</Box>
            </NavLink>
            
            <NavLink
              to="/about"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <Box py="10px" px="24px">About</Box>
            </NavLink>

            <Link to="/settings">
              <Box py="10px" px="24px">Settings</Box>
            </Link>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
};

export default NavMenu;
