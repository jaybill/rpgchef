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
                    
                    <h1>RPG Chef</h1>
                    <p>A tool for creating and maintaining assets for table top role-playing games.<br/>
                    We&apos;re currently in very limited beta testing.</p>
                    <Button href="/mailinglist.html" bsSize="large" bsStyle="primary">Request Beta Invitation</Button>
                </Jumbotron>
            </div>
      </SimplePage>
      );
  }

}

