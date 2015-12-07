import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';

class RequireAuth extends Component {

  componentWillMount() {
    const {dispatch, session} = this.props;
    if (!session.isLoggedIn) {
      dispatch(updatePath('/login'));
    }

  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(RequireAuth);
