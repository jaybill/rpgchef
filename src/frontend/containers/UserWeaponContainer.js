import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { userweaponUpsert } from '../actions/userweapon';
import UserWeapon from '../../components/UserWeapon';

class UserWeaponContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(formdata) {

    const {dispatch, userweapon} = this.props;

    // Local validation, if required.


    // Dispatch action if everything is okay.
    dispatch(userweaponUpsert(formdata));

  }

  render() {
    const self = this;
    const {dispatch, userweapon} = this.props;

    return <UserWeapon
      onSubmit={(formdata) => self.onSubmit(formdata)}
      working={userweapon.working}
      message={userweapon.message}
      failed={userweapon.failed}
      succeeded={userweapon.succeeded}
      />
  }
}

function select(state) {

  return {
    userweapon: state.app.userweapon
  };
}

export default connect(select)(UserWeaponContainer);
