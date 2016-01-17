import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { login } from '../actions/login';
import { updatePath } from 'redux-simple-router';
import Login from '../../components/Login';
import SimplePage from '../../components/SimplePage';
import urijs from 'urijs';

class LoginContainer extends Component {

  constructor() {
    super();
    this.redirect = this.redirect.bind(this);
  }

  redirect(dispatch, session, routing) {

    if (session.isLoggedIn && session.isLoaded) {

      const uri = new urijs(routing.path);
      const params = uri.search(true);

      if (params.redirectTo) {
        dispatch(updatePath(params.redirectTo));
      } else {
        dispatch(updatePath('/app/home'));
      }

    }
  }

  componentWillMount() {
    const {dispatch, session, routing} = this.props;
    this.redirect(dispatch, session, routing);
  }

  componentWillReceiveProps(props) {
    const {dispatch, session, routing} = props;
    this.redirect(dispatch, session, routing);
  }

  render() {
    const {dispatch, session} = this.props;
    return <Login session={ session } login={ credentials => dispatch(login(credentials)) } />
  }
}

function select(state) {
  return {
    routing: state.routing,
    session: state.app.session
  };
}


export default connect(select)(LoginContainer);
