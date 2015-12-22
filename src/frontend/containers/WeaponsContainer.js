import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { weapons as doWeapons, randomWeapons as doRandomWeapons } from '../actions/weapons';
import Weapons from '../../components/Weapons';
import { Button } from 'react-bootstrap';

class WeaponsContainer extends Component {

  constructor() {
    super();
    this.loadRandomWeapons = this.loadRandomWeapons.bind(this);
  }

  loadRandomWeapons() {
    const {dispatch, weapons} = this.props;
    dispatch(doRandomWeapons());
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
      randomWeapons={weapons.randomWeapons}
      onLoadButton={this.loadRandomWeapons}
      />
  }
}

function select(state) {

  return {
    weapons: state.app.weapons
  };
}

export default connect(select)(WeaponsContainer);
