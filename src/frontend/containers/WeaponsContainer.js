import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { weapons as doWeapons, defaultWeapons } from '../actions/weapons';
import { userweaponUpsert } from '../actions/userweapon';

import Weapons from '../../components/Weapons';
import { Button } from 'react-bootstrap';

class WeaponsContainer extends Component {

  constructor() {
    super();
    this.loadRandomWeapons = this.loadRandomWeapons.bind(this);
    this.saveWeapon = this.saveWeapon.bind(this);
  }

  saveWeapon(saveable) {
    const {dispatch} = this.props;
    dispatch(userweaponUpsert(saveable));
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
    const {dispatch, weapons, defaultWeapons, userweapon} = this.props;

    if (defaultWeapons) {
      return <Weapons working={ weapons.working || userweapon.post.working }
               message={ weapons.message }
               failed={ weapons.failed }
               succeeded={ weapons.succeeded }
               randomWeapons={ weapons.weapons }
               loadWeapons={ this.loadRandomWeapons }
               saveWeapon={ this.saveWeapon } />
    }
    return <div>
             Loading...
           </div>
  }
}

function select(state) {

  return {
    weapons: state.app.weapons.post,
    userweapon: state.app.userweapon,
    defaultWeapons: state.app.weapons.defaultWeaponsLoaded
  };
}

export default connect(select)(WeaponsContainer);
