import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import App from '../../components/App';
import { me } from '../actions';

class AppContainer extends Component {

  componentWillMount() {
    const {dispatch, session} = this.props;
    dispatch(me());
  }

  render() {
    const {dispatch, session} = this.props;
    var wtr = <div>Loading...</div>;
    if (session.isLoaded) {
      wtr = <App>{this.props.children}</App>;
    }

    return wtr;
  }

}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(AppContainer);
