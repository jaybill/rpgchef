import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { cancel as doCancel } from '../actions/cancel';
import Cancel from '../../components/Cancel';

class CancelContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(formdata) {

    const {dispatch, cancel} = this.props;

    // Local validation, if required.


    // Dispatch action if everything is okay.
    dispatch(doCancel(formdata));
  }

  render() {
    const self = this;
    const {dispatch, cancel} = this.props;

    return <Cancel onSubmit={ (formdata) => self.onSubmit(formdata) }
             working={ cancel.working }
             message={ cancel.message }
             failed={ cancel.failed }
             succeeded={ cancel.succeeded } />
  }
}

function select(state) {

  return {
    cancel: state.app.subscribe.del
  };
}

export default connect(select)(CancelContainer);
