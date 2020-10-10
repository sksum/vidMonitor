import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import img from '../img/illuminati.png';

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
        <Navbar color = "dark" dark expand="md">
            <NavbarBrand href="/">
            <img
              src={img}
              width="30"
              height="30"
              className="d-inline-block align-top"  
            />
              &nbsp; iNVIGILATOR
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
                <NavItem>
                    <NavLink href="/New">New</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/Test">Test</NavLink>
                </NavItem>
            </Nav>
            </Collapse>
        </Navbar>
    </>
  );
}
export default Header
