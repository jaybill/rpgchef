import './SimplePage.less';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Well, Navbar, NavbarBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class SimplePage extends Component {
  render() {
    return (
      <div className="SimplePage">
        <div className="container">
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <div className="brand-logo">
                  <LinkContainer to="/">
                    <img src="/assets/logo.svg" />
                  </LinkContainer>
                </div>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem href="https://www.facebook.com/rpgchef" eventKey={ 0 }>
                  <i className="fa fa-facebook"></i>
                </NavItem>
                <NavItem href="https://twitter.com/rpgchef" eventKey={ 0.1 }>
                  <i className="fa fa-twitter"></i>
                </NavItem>
                <LinkContainer to="/register">
                  <NavItem eventKey={ 1 }>
                    Register
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/about">
                  <NavItem eventKey={ 2 }>
                    About
                  </NavItem>
                </LinkContainer>
                <NavDropdown eventKey={ 3 } title="Legal" id="legal">
                  <LinkContainer to="/legal">
                    <MenuItem eventKey={ 3.1 }> General
                    </MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/terms">
                    <MenuItem eventKey={ 3.2 }> Terms of Service
                    </MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/privacy">
                    <MenuItem eventKey={ 3.3 }> Privacy Policy
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
                <LinkContainer to="/login">
                  <NavItem eventKey={ 2 }>
                    Log in
                  </NavItem>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className="SimplePage-Holder">
            { this.props.children }
          </div>
        </div>
      </div>
      );
  }
}


