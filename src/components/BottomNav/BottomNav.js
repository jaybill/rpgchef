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
                           <h5>Icon Credits: Noun Project</h5>
                           <p>
                             Page Break by Garrett Knoll
                             <br/> Layout by The Impekables
                             <br/>right by Muneer A.Safiah
                           </p>
                         </Popover>;

    return <Navbar className="BottomNav" fixedBottom>
             <Navbar.Header>
               <Navbar.Toggle />
             </Navbar.Header>
             <Navbar.Collapse>
               <Nav>
                 <NavItem>
                   <span className="dim">{ "v. " + (process.env.RPGCHEF_VERSION || "Local") }</span>
                 </NavItem>
               </Nav>
               <Nav pullRight>
                 <NavItem href="https://www.facebook.com/rpgchef" eventKey={ 0 }>
                   <i className="fa fa-facebook"></i>
                 </NavItem>
                 <NavItem href="https://twitter.com/rpgchef" eventKey={ 0.1 }>
                   <i className="fa fa-twitter"></i>
                 </NavItem>
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
                   <LinkContainer to="/app/legal">
                     <MenuItem eventKey={ 3.1 }> Legal Information
                     </MenuItem>
                   </LinkContainer>
                   <LinkContainer to="/app/terms">
                     <MenuItem eventKey={ 3.2 }> Terms of Service
                     </MenuItem>
                   </LinkContainer>
                   <LinkContainer to="/app/privacy">
                     <MenuItem eventKey={ 3.3 }> Privacy Policy
                     </MenuItem>
                   </LinkContainer>
                 </NavDropdown>
               </Nav>
             </Navbar.Collapse>
           </Navbar>;
  }
}
