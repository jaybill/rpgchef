import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { userweaponlist as doUserweaponlist } from '../actions/userweaponlist';
import UserWeaponList from '../../components/UserWeaponList';

class UserWeaponListContainer extends Component {

  constructor() {
    super();
  }

  componentWillMount() {
    const {dispatch, userweaponlist} = this.props;
    dispatch(doUserweaponlist());
  }

  render() {
    const self = this;
    const {dispatch, userweaponlist} = this.props;

    let wtr;

    if (userweaponlist) {
      wtr = <UserWeaponList
      onSubmit={(formdata) => self.onSubmit(formdata)}
      working={userweaponlist.working}
      message={userweaponlist.message}
      failed={userweaponlist.failed}
      succeeded={userweaponlist.succeeded}
      weapons={userweaponlist.payload}
      />
    } else {
      wtr = <div>Loading...</div>
    }

    return wtr;

  }
}

function select(state) {

  return {
    userweaponlist: state.app.userweaponlist
  };
}

export default connect(select)(UserWeaponListContainer);
