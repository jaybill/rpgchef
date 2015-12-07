import './Home.less';
import React from 'react';
import { Link } from 'react-router';

import { Button, Navbar, NavBrand, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import log from 'loglevel';
import { RouteHandler } from 'react-router';



export var componentDef = {

  componentWillMount() {},

  render() {

    return (

      <div className="Home">
                <div className="container">
                    <Navbar fixedTop><NavBrand><a href="#">RPG Chef</a></NavBrand>
            <Nav>
                        <NavDropdown id="generate" title="Generate">

                            <MenuItem href="/generate/weapon">Weapon</MenuItem>

                        </NavDropdown>
                        <NavDropdown id="sources" title="Sources">
                            <MenuItem href="/sources/effects">Weapon Effects</MenuItem>
                        </NavDropdown>
</Nav>
                    </Navbar>
                    <div className="Home-Holder">{this.props.children}</div>
                </div>
            </div>

      );
  }

}
export default React.createClass(componentDef);
