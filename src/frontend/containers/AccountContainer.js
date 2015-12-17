import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { account as doAccount, failure } from '../actions/account';
import Account from '../../components/Account';
import RequireAuth from './RequireAuth';

class AccountContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const {dispatch, session} = this.props;
    if (session.isLoggedIn && !this.props.working) {
      this.setState({
        user: session.user
      });
    }
  }

  onSubmit(formdata) {

    const {dispatch} = this.props;
    // Local validation, if required.

    let updatedUser = {
      username: formdata.username
    };

    if (formdata.pass1.length > 0) {
      if ( (formdata.pass1 == formdata.pass2) ) {
        updatedUser.password = formdata.pass1;
      } else {
        dispatch(failure("Passwords do not match."));
        return;
      }
    }

    this.setState({
      user: updatedUser
    });

    dispatch(doAccount(updatedUser));

  }

  render() {
    const self = this;
    const {dispatch, account, session} = this.props;
    log.debug(session);

    return <RequireAuth><Account
      onSubmit={(formdata) => self.onSubmit(formdata)}
      working={account.working}
      message={account.message}
      failed={account.failed}
      user={this.state.user}
      succeeded={account.succeeded}
      /></RequireAuth>
  }
}

function select(state) {

  return {
    account: state.app.account,
    session: state.app.session
  };
}

export default connect(select)(AccountContainer);
