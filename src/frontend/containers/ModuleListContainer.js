import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import { moduleReset, modulesGet as doModulesGet } from '../actions/module';
import ModuleList from '../../components/ModuleList';

class ModuleListContainer extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
    log.debug(this.props);
  }

  componentWillMount() {
    const {dispatch, list} = this.props;
    dispatch(doModulesGet());
  }
  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(moduleReset());
  }


  onPost(formdata) {
    const {dispatch, list} = this.props;
    // Local validation, if required.
    // Dispatch action if everything is okay.
  }

  render() {
    const self = this;
    const {dispatch, list} = this.props;

    return <ModuleList list={ list } />;
  }
}

function select(state) {

  return {
    list: state.app.module.list
  };
}

export default connect(select)(ModuleListContainer);
