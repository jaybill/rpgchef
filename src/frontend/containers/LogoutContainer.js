import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import Logout from '../../components/Logout';
import { updatePath } from 'redux-simple-router';
import { logout } from '../actions';

class LogoutContainer extends Component {

  componentWillMount() {
    const {dispatch, session} = this.props;

    if (session.isLoggedIn) {
      dispatch(logout());
    }

    dispatch(updatePath("/"));
  }


  render() {
    return <Logout/>;
  }

}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(LogoutContainer);
