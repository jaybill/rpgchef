'use strict';

import './Welcome.less';

import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Jumbotron } from 'react-bootstrap';
import SimplePage from '../SimplePage'
export default class Welcome extends Component {

  render() {
    return (
      <SimplePage>
      <div className="Welcome">
                <Jumbotron>
                    <h1>RPG Chef</h1>
                    <p>RPG Chef is a tool for creating and maintaining assets for table top role-playing games.</p>
                    <p>We&apos;re currently in very limited beta testing.</p>
                   
                </Jumbotron>
            </div>
      </SimplePage>
      );
  }

}

