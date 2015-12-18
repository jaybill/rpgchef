import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import App from '../../components/App';
import { me } from '../actions/me';
import { updatePath } from 'redux-simple-router';
import urijs from 'urijs';

class AppContainer extends Component {

  constructor() {
    super();
  }

  componentWillMount() {

    const {dispatch, session} = this.props;
    if (!session.isLoaded) {
      dispatch(me());
    }
  }

  componentWillReceiveProps(props) {
    const {dispatch, session, routing} = props;
    if (session.isLoaded && !session.isLoggedIn) {
      const uri = new urijs('/login');
      uri.query({
        redirectTo: routing.path
      });
      dispatch(updatePath(uri.toString()));
    }


  }

  render() {
    const {dispatch, session} = this.props;
    var wtr = <div>Loading...</div>;
    if (session.isLoaded & session.isLoggedIn) {

      wtr = <App user={session.user}>{this.props.children}</App>;

    }

    return wtr;
  }

}

function select(state) {
  return {
    routing: state.routing,
    session: state.app.session
  };
}

export default connect(select)(AppContainer);
