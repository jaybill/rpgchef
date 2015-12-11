import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { login } from '../actions';
import { updatePath } from 'redux-simple-router';
import Login from '../../components/Login';
import SimplePage from '../../components/SimplePage';

class LoginContainer extends Component {

  constructor() {
    super();
    this.redirect = this.redirect.bind(this);
  }

  redirect(dispatch, session) {
    if (session.isLoggedIn && session.isLoaded) {
      dispatch(updatePath('/home'));
    }
  }

  componentWillMount() {
    const {dispatch, session} = this.props;
    this.redirect(dispatch, session);
  }

  componentWillReceiveProps(props) {
    const {dispatch, session} = props;
    this.redirect(dispatch, session);
  }

  render() {
    const {dispatch, session} = this.props;
    return <SimplePage><Login
      session={session}
      login={credentials => dispatch(login(credentials))}
      /></SimplePage>
  }
}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(LoginContainer);
