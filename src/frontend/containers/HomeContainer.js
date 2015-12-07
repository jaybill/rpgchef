import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { updatePath } from 'redux-simple-router';

import Home from '../../components/Home';
import RequireAuth from './RequireAuth';


class HomeContainer extends Component {
  render() {
    const {dispatch, session} = this.props;
    return <RequireAuth><Home/></RequireAuth>
  }
}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(HomeContainer);
