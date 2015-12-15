import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import ResetPassword from '../../components/ResetPassword';
import { verifyReset, resetPassword as doReset, resetPasswordFailure } from '../actions/resetpassword';
import urijs from 'urijs';
import SimplePage from '../../components/SimplePage';

class ResetPasswordContainer extends Component {

  constructor() {
    super();
    this.onReset = this.onReset.bind(this);
  }

  componentWillMount() {
    const {dispatch, routing, resetPassword} = this.props;
    const uri = new urijs(routing.path);
    const params = uri.search(true);

    dispatch(verifyReset({
      username: params.username,
      hash: params.hash
    }));
  }

  onReset(formdata) {
    const {dispatch, routing, resetPassword} = this.props;
    const uri = new urijs(routing.path);
    const params = uri.search(true);
    if (formdata.pass1 != formdata.pass2) {
      dispatch(resetPasswordFailure(["Passwords do not match."]));
      return;
    }

    dispatch(doReset({
      username: params.username,
      hash: params.hash,
      password: formdata.pass1
    }));

  }

  render() {

    const {resetPassword} = this.props;
    log.debug(resetPassword);
    if (resetPassword.verifying) {
      return <SimplePage><div>Verifying...</div></SimplePage>
    } else {

      let verified = false;
      let reset = false;
      if (!resetPassword.error) {
        verified = true;
      }


      return <SimplePage><ResetPassword
        onReset={this.onReset}
        verified={verified}
        resetError={resetPassword.resetError}
        reset={resetPassword.reset} /></SimplePage>

    }
  }

}

function select(state) {
  return {
    routing: state.routing,
    resetPassword: state.app.resetPassword
  };
}


export default connect(select)(ResetPasswordContainer);
