import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { account as doAccount } from '../actions/account';
import Account from '../../components/Account';

class AccountContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(formdata) {

    const {dispatch, account} = this.props;

    // Local validation, if required.

      
    // Dispatch action if everything is okay.
    dispatch(doAccount(formdata));

  }

  render() {
    const self = this;
    const {dispatch, account} = this.props;

    return <Account
      onSubmit={(formdata) => self.onSubmit(formdata)}
      working={account.working}
      message={account.message}
      failed={account.failed}
      succeeded={account.succeeded}
      />
  }
}

function select(state) {

  return {
    account: state.app.account
  };
}

export default connect(select)(AccountContainer);
