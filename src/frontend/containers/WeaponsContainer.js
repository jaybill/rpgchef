import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { weapons as doWeapons, defaultWeapons } from '../actions/weapons';
import Weapons from '../../components/Weapons';
import { Button } from 'react-bootstrap';

class WeaponsContainer extends Component {

  constructor() {
    super();
    this.loadRandomWeapons = this.loadRandomWeapons.bind(this);
  }

  componentWillMount() {
    const {dispatch, weapons} = this.props;
    dispatch(defaultWeapons());

  }

  loadRandomWeapons(effectCount, weaponCount) {
    const {dispatch, weapons} = this.props;
    dispatch(doWeapons(effectCount, weaponCount));
  }

  render() {
    const self = this;
    const {dispatch, weapons} = this.props;

    return <Weapons
      working={weapons.working}
      message={weapons.message}
      failed={weapons.failed}
      succeeded={weapons.succeeded}
      randomWeapons={weapons.weapons}
      loadWeapons={this.loadRandomWeapons}
      />
  }
}

function select(state) {

  return {
    weapons: state.app.weapons
  };
}

export default connect(select)(WeaponsContainer);
