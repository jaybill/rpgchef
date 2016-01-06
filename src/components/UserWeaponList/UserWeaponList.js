import './UserWeaponList.less';
import React, { Component, PropTypes } from 'react';
import { Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import WeaponCard from '../WeaponCard';
import MWeaponCardCtrls from '../MWeaponCardCtrls';
import log from 'loglevel';


export default class UserWeaponList extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onSubmit() {
    this.props.onSubmit({
      name: this.refs.name.getValue()
    });
  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  }

  render() {

    let displayMessage;
    const allWeapons = [];
    const {message, succeeded, failed, working, weapons, delFunc} = this.props;

    if (failed) {
      displayMessage = <Alert bsStyle="danger">Unable to load your weapons.</Alert>
    }

    let i = 0;
    _.forIn(weapons, (weapon) => {

      const tDelFunc = (id) => {
        delFunc(id);
      };
      const control = <MWeaponCardCtrls weapon={weapon} delFunc={tDelFunc}/>;
      allWeapons.push(<WeaponCard weapon={weapon} controls={control} key={i++}/>);

    });



    return (<div className="UserWeaponList">
     <Grid>
            <Row>
            <Col md={6}>
            <h3>My Weapons</h3>
            </Col>
            </Row>
            <Row><Col md={12}>
            <hr/>
            {allWeapons}
            </Col></Row>
        </Grid>
        </div>);
  }
}

UserWeaponList.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  onSubmit: PropTypes.func
}
