import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import { moduleReset, modulesGet as doModulesGet, modulePost as doModulePost } from '../actions/module';
import ModuleList from '../../components/ModuleList';
import { updatePath } from 'redux-simple-router';


class ModuleListContainer extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
  }

  componentWillMount() {
    const {dispatch, list} = this.props;
    dispatch(doModulesGet());
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(moduleReset());
  }

  componentWillReceiveProps(newProps) {
    const {dispatch, post} = newProps;

    if (post.succeeded && post.payload && post.payload.id) {
      dispatch(updatePath('/app/module/' + post.payload.id + '?new=true'));
    }
  }

  onPost() {
    const {dispatch} = this.props;

    dispatch(doModulePost({
      name: "Untitled Adventure",
      content: {}
    }));
  }

  render() {
    const self = this;
    const {dispatch, list} = this.props;

    return <ModuleList onPost={ self.onPost } list={ list } />;
  }
}

function select(state) {

  return {
    list: state.app.module.list,
    post: state.app.module.post
  };
}

export default connect(select)(ModuleListContainer);
