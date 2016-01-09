'use strict';

import './Welcome.less';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Jumbotron, Grid, Col, Row } from 'react-bootstrap';
import SimplePage from '../SimplePage'
export default class Welcome extends Component {

  render() {
    return (
      <SimplePage>
      <div className="Welcome">
                <Jumbotron>
                    <Grid>
                    <Row>
                    <Col xs={1} sm={1} md={2}>
                    <img className="img-responsive" src="/assets/logo.gif"/>
                    </Col>
                    <Col md={10}>
                    <h1>RPG Chef</h1>
                    <p>RPG Chef is a tool for creating and maintaining assets for table top role-playing games.<br/>
                    We&apos;re currently in very limited beta testing.</p>
                    <Button href="/mailinglist.html" bsSize="large" bsStyle="primary">Request Beta Invitation</Button>

                    </Col>
                    </Row>
                   </Grid>
                </Jumbotron>
            </div>
      </SimplePage>
      );
  }

}

