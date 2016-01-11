import './Home.less';
import React from 'react';
import log from 'loglevel';
import { RouteHandler } from 'react-router';
import { Link } from 'react-router';
import { Button, Jumbotron, Grid, Col, Row } from 'react-bootstrap';



export var componentDef = {

  componentWillMount() {},

  render() {

    return (
        <div className="Home">
        <Jumbotron>
            <h2>RPG Chef Beta</h2>
            <p>Thanks for helping out with our beta test!</p>
            <p>We&apos;re just getting started over here, but there are already a number of useful features.</p>
        
        </Jumbotron>
        </div>
      );
  }

}
export default React.createClass(componentDef);
