import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import Navbar from 'react-bootstrap/lib/Navbar';

import './App.less';
import React, { Component } from 'react';

import log from 'loglevel';
import BottomNav from '../BottomNav';

class App extends Component {

  render() {

    return (
      <div className="App">
        <div className="container">
          <Navbar fixedTop>
            <Navbar.Header>
              <LinkContainer to="/app/home">
                <Navbar.Brand>
                  RPG Chef
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavDropdown eventKey={ 1 } title="Generate" id="basic-nav-dropdown">
                  <LinkContainer to="/app/weapons">
                    <MenuItem eventKey={ 1.1 }>
                      Weapons
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </Nav>
              <Nav>
                <NavDropdown eventKey={ 2 } title="My Stuff" id="basic-nav-dropdown">
                  <LinkContainer to="/app/myweapons">
                    <MenuItem eventKey={ 2.1 }>
                      Weapons
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
                <LinkContainer to="/app/modules">
                  <NavItem eventKey={ 3 }>
                    Modules
                  </NavItem>
                </LinkContainer>
              </Nav>
              <Nav pullRight>
                <NavDropdown eventKey={ 9 } title={ this.props.user.username } id="account-nav-dropdown">
                  <LinkContainer to="/app/account">
                    <MenuItem eventKey={ 9.1 }>
                      Account
                    </MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/app/subscribe">
                    <MenuItem eventKey={ 9.2 }>
                      Billing
                    </MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/logout">
                    <MenuItem eventKey={ 9.5 }>
                      Log out
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className="App-Holder">
            { this.props.children }
          </div>
          <BottomNav/>
        </div>
      </div>

      );
  }

}

export default App;
