import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Alert,Button, Nav, NavItem, NavDropdown, MenuItem,Row,Col } from 'react-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';

import './App.less';
import React, { Component } from 'react';

import log from 'loglevel';
import BottomNav from '../BottomNav';

class App extends Component {

  constructor(){
    super();
  }
  
  render() {
    let nag;
    if(this.props.nag){
      nag = (<div className="nag">
             <Alert>
             <Row>
             <Col md={6}>
             <h4>It&apos;s your time to shine!</h4>
             <p>Help us keep the lights on and make more awesome stuff by purchasing a subscription! They start at just $1.99 a month!</p>
             </Col>
             <Col md={3}>
             <LinkContainer to="/app/subscribe">
             <Button title="Yes! :)" block bsStyle="primary"><i className="fa fa-smile-o"/> Let&apos;s do this!</Button>
             </LinkContainer>
             <p className="hidden-md hidden-lg">&nbsp;</p>
             </Col>
             <Col md={3}>
             <Button title="Okay. *sigh* :(" block bsStyle="default" onClick={this.props.onDismissNag}>
             <i className="fa fa-frown-o"/> Ignore Reasonable Plea
             </Button>
             </Col>
             </Row>
             </Alert>             
             </div>);
    }
    
    return (
      <div className="App">
        <div className="container">
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <div className="brand-logo">
                  <LinkContainer to="/app/home">
                    <img src="/assets/logo.svg" />
                  </LinkContainer>
                </div>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <LinkContainer to="/app/modules">
                  <NavItem eventKey={ 3 }>
                    Modules
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/app/subscribe">
                  <NavItem eventKey={ 3 }>
                    Subscribe
                  </NavItem>
                </LinkContainer>
              </Nav>
              <Nav pullRight>
                <NavDropdown eventKey={ 9 } title={ this.props.user.username } id="account-nav-dropdown">
                  <LinkContainer to="/app/account">
                    <MenuItem eventKey={ 9.1 }> Account
                    </MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/app/subscribe">
                    <MenuItem eventKey={ 9.2 }> Billing
                    </MenuItem>
                  </LinkContainer>
                  <LinkContainer to="/logout">
                    <MenuItem eventKey={ 9.5 }> Log out
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        <div className="App-Holder">
        {nag}
        { this.props.children }
          </div>
          <BottomNav/>
        </div>
      </div>

      );
  }

}

export default App;
