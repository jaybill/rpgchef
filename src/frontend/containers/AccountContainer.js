import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { account as doAccount, update } from '../actions/account';
import Account from '../../components/Account';

class AccountContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const {dispatch, session} = this.props;
    dispatch(update({
      username: session.user.username
    }));

  }

  onSubmit(user) {

    const {dispatch} = this.props;
    // Local validation, if required.

    // Dispatch action if everything is okay.
    log.debug("account", user);
    dispatch(doAccount(user));

  }

  render() {
    const self = this;
    const {dispatch, account, session} = this.props;
    log.debug(session);

    return <Account
      onSubmit={(formdata) => self.onSubmit(formdata)}
      working={account.working}
      message={account.message}
      failed={account.failed}
      user={account.user}
      succeeded={account.succeeded}
      />
  }
}

function select(state) {

  return {
    account: state.app.account,
    session: state.app.session
  };
}

export default connect(select)(AccountContainer);
