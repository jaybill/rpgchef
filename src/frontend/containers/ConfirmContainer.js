import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import Confirm from '../../components/Confirm';
import { updatePath } from 'redux-simple-router';
import { confirm } from '../actions/confirm';
import urijs from 'urijs';
import SimplePage from '../../components/SimplePage';

class ConfirmContainer extends Component {

  componentWillMount() {
    const {dispatch, routing} = this.props;
    const uri = new urijs(routing.path);
    const params = uri.search(true);
    log.debug(params);
    dispatch(confirm({
      username: params.username,
      hash: params.hash
    }));
  }


  render() {
    log.debug(this.props);
    const {confirm} = this.props;
    if (confirm.confirming) {
      return <div>
               Confirming...
             </div>;

    } else {

      let msg = 'Email confirmed.';
      let success = true;
      if (confirm.error) {
        msg = confirm.error;
        success = false;
      }

      return <Confirm success={ success } message={ msg } />;

    }
  }

}

function select(state) {
  return {
    routing: state.routing,
    confirm: state.app.confirm
  };
}


export default connect(select)(ConfirmContainer);
