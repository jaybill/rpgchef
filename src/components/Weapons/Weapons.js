import './Weapons.less';
import React, { Component, PropTypes } from 'react';
import { Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import _ from 'lodash';
import WeaponCard from '../WeaponCard';

export default class Weapons extends Component {

  constructor() {
    super();
  }


  render() {

    let displayMessage;
    const allWeapons = [];

    const {message, succeeded, failed, working, randomWeapons} = this.props;

    if (failed) {
      displayMessage = <Alert bsStyle="danger">{message}</Alert>
    }

    let i = 0;
    _.forIn(randomWeapons, (weapon) => {
      allWeapons.push(<WeaponCard weapon={weapon} key={i++}/>);
    });

    return (<div className="Weapons">
        <Grid>
            <Row>
            <Col md={6} mdOffset={3}>
            <h2>Weapons</h2>
            </Col>
            </Row>
            <Row>
            <Col md={6}>
            <div className="controls">
            <Button bsStyle="primary" onClick={this.props.onLoadButton}>Generate Weapons</Button>
            </div>
            </Col>
            </Row>
            <Row><Col md={12}>
            {allWeapons}
            </Col></Row>
        </Grid>
        </div>);
  }
}

Weapons.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  payload: PropTypes.array
}
