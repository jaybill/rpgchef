import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { weapons as doWeapons } from '../actions/weapons';
import Weapons from '../../components/Weapons';
import { Button } from 'react-bootstrap';

class WeaponsContainer extends Component {

  constructor() {
    super();

  }

  componentWillMount() {
    const {dispatch, weapons} = this.props;
    dispatch(doWeapons());
  }

  render() {
    const self = this;
    const {dispatch, weapons} = this.props;

    return <Weapons
      working={weapons.working}
      message={weapons.message}
      failed={weapons.failed}
      succeeded={weapons.succeeded}
      payload={weapons.payload}
      />
  }
}

function select(state) {

  return {
    weapons: state.app.weapons
  };
}

export default connect(select)(WeaponsContainer);
