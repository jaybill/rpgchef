import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { backgrounds as doBackgrounds } from '../actions/backgrounds';
import Backgrounds from '../../components/Backgrounds';

class BackgroundsContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(formdata) {

    const {dispatch, backgrounds} = this.props;

    // Local validation, if required.

      
    // Dispatch action if everything is okay.
    dispatch(doBackgrounds(formdata));

  }

  render() {
    const self = this;
    const {dispatch, backgrounds} = this.props;

    return <Backgrounds
      onSubmit={(formdata) => self.onSubmit(formdata)}
      working={backgrounds.working}
      message={backgrounds.message}
      failed={backgrounds.failed}
      succeeded={backgrounds.succeeded}
      />
  }
}

function select(state) {

  return {
    backgrounds: state.app.backgrounds
  };
}

export default connect(select)(BackgroundsContainer);
