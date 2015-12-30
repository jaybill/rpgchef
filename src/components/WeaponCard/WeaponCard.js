'use strict';

import './WeaponCard.less';
import React, { Component } from 'react';
import { Panel, Row, Col, Label } from 'react-bootstrap';
import log from 'loglevel';
import DnD5e from '../../lib/dnd5e';

export default class WeaponCard extends Component {

  render() {

    const {weapon} = this.props;

    const d = new DnD5e();
    const priceStr = d.getCurrencyString(weapon.priceInCp);


    return (<div className="WeaponCard"><Panel bsStyle='primary' bsSize="large">
        <h3>{this.props.weapon.name}</h3>
        <hr/>
            <Row>
                <Col md={4}><b>Weight:</b> {weapon.weightInLb} pounds</Col>
                <Col md={5}><b>Damage:</b> {weapon.damage}</Col>
                <Col md={3}><b>Price:</b> {priceStr}</Col>
            </Row>
            <hr/>
            
            <Row>
                <Col md={12}>
                        {weapon.properties}
                </Col>
            </Row>
        </Panel></div>);

  }

}

WeaponCard.propTypes = {
  weapon: React.PropTypes.object.isRequired
};
