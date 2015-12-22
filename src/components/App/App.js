import { Link } from 'react-router';
import { Button, Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

import './App.less';
import React, { Component } from 'react';

import log from 'loglevel';

class App extends Component {

  render() {

    return (
      <div className="App">

                <div className="container">
                    <Navbar fixedTop><NavBrand><a href="#">RPG Chef</a></NavBrand>
            <Nav>
                        <NavDropdown id="generate" title="Generate">

                            <MenuItem href="/app/weapons">Weapon</MenuItem>

                        </NavDropdown>
                        <NavDropdown id="sources" title="Sources">
                            <MenuItem href="/sources/effects">Weapon Effects</MenuItem>
                        </NavDropdown>
            </Nav>
            <Nav pullRight>
                  <NavDropdown id="user" title={this.props.user.username}>

                            <MenuItem href="/app/account">Account</MenuItem>
                            <MenuItem href="/logout">Log out</MenuItem>

                        </NavDropdown>
</Nav>
                    </Navbar>
                    <div className="App-Holder">{this.props.children}</div>
                </div>
        </div>

      );
  }

}

export default App;
