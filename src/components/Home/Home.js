import './Home.less';
import React from 'react';
import log from 'loglevel';
import { RouteHandler } from 'react-router';
import { Link } from 'react-router';
import { Alert, Well,Button, Jumbotron, Grid, Col, Row } from 'react-bootstrap';



export var componentDef = {

  componentWillMount() {},

  render() {

    return (
            <div className="Home">
            <Alert bsStyle="info">
            Have you found a bug? Want to request a feature? <strong><a href="https://rpgchef.lighthouseapp.com/projects/132376-rpg-chef/tickets" target="new">Open a ticket!</a></strong>
        </Alert>
            <Well>
            <h2>RPG Chef Beta</h2>
            <p>Thanks for helping out with our beta test!</p>
            <p>We&apos;re just getting started over here, but there are already a number of useful features.</p>
            
            </Well>

        </div>
      );
  }

}
export default React.createClass(componentDef);
