import './BottomNav.less';
import React, { Component } from 'react';
import { OverlayTrigger, Button, Nav, Popover, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';

export default class BottomNav extends Component {

  render() {
    const legalIcon = <i className="fa fa-legal"></i>;
    const photoPopover = <Popover id="image-credit" title="Image Credit">
                           <h5><a href="http://fav.me/d6sq6ee">Fantasy Landscape: Mountains</a></h5>
                           <h5><a href="http://fpesantez.deviantart.com">by Felipe Pesantez</a></h5>
                           <p>
                             <i className="fa fa-creative-commons"></i> Some rights reserved. This work is licensed under a <a href="http://creativecommons.org/licenses/by-nd/3.0/">Creative Commons Attribution-No Derivative Works 3.0 License.</a>
                           </p>
                         </Popover>;

    return <Navbar className="BottomNav" fixedBottom>
             <Navbar.Header>
               <Navbar.Toggle />
             </Navbar.Header>
             <Navbar.Collapse>
               <Nav pullRight>
                 <NavItem>
                   <OverlayTrigger rootClose={ true }
                     trigger="click"
                     placement="top"
                     overlay={ photoPopover }>
                     <i className="fa fa-camera"></i>
                   </OverlayTrigger>
                 </NavItem>
                 <LinkContainer to="/app/about">
                   <NavItem eventKey={ 2 }>
                     <i className="fa fa-info"></i>
                   </NavItem>
                 </LinkContainer>
                 <NavDropdown eventKey={ 3 } title={ legalIcon } id="legal">
                   <LinkContainer to="/app/terms">
                     <MenuItem eventKey={ 3.1 }>
                       Terms of Service
                     </MenuItem>
                   </LinkContainer>
                   <LinkContainer to="/app/privacy">
                     <MenuItem eventKey={ 3.2 }>
                       Privacy Policy
                     </MenuItem>
                   </LinkContainer>
                 </NavDropdown>
               </Nav>
             </Navbar.Collapse>
           </Navbar>;
  }
}
