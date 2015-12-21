import './Weapons.less';
import React, { Component, PropTypes } from 'react';
import { Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';

export default class Weapons extends Component {

  constructor() {
    super();
  }


  render() {

    let displayMessage;
    const allWeapons = [];

    const {message, succeeded, failed, working, payload} = this.props;
    log.debug(payload);

    if (failed) {
      displayMessage = <Alert bsStyle="danger">{message}</Alert>
    }

    let i = 0;
    _.forIn(payload, (weapon) => {
      allWeapons.push(<Row key={i++}><Col md={6}>{weapon.name}</Col></Row>);
    });

    return (<div className="Weapons">
        <Grid>
            <Row>
            <Col md={6} mdOffset={3}>
            <h2>Weapons</h2>
            </Col>
            </Row>
            {allWeapons}
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
