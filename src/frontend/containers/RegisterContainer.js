import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { register as doRegister, registerFailure } from '../actions/register';
import { updatePath } from 'redux-simple-router';

import Register from '../../components/Register';
import SimplePage from '../../components/SimplePage';

class RegisterContainer extends Component {

  constructor() {
    super();
    this.onRegister = this.onRegister.bind(this);
  }

  onRegister(formdata) {

    const {dispatch, register} = this.props;
    log.debug("formdata", formdata);

    if (formdata.pass1 != formdata.pass2) {
      dispatch(registerFailure(["Passwords do not match."]));
      return;
    }

    dispatch(doRegister({
      username: formdata.username,
      password: formdata.pass1
    }));
  }

  render() {
    const self = this;
    const {dispatch, register} = this.props;
    log.debug(register);
    return <SimplePage>
             <Register onRegister={ formdata => self.onRegister(formdata) }
               emailSentTo={ register.emailSentTo }
               errors={ register.errors }
               registering={ register.registering }
               complete={ register.complete } />
           </SimplePage>
  }
}

function select(state) {

  return {
    register: state.app.register
  };
}

export default connect(select)(RegisterContainer);
