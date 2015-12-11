import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import Logout from '../../components/Logout';
import { updatePath } from 'redux-simple-router';
import { logout } from '../actions';
import SimplePage from '../../components/SimplePage';

class LogoutContainer extends Component {

  componentWillMount() {
    const {dispatch, session} = this.props;
    dispatch(logout());
    dispatch(updatePath("/"));
  }


  render() {
    return <SimplePage><Logout/></SimplePage>;
  }

}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(LogoutContainer);
