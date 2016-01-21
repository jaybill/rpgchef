import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import { moduleReset, modulePostFailure, moduleGet as doModuleGet, modulePost as doModulePost } from '../actions/module';
import Module from '../../components/Module';
import urijs from 'urijs';

class ModuleContainer extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
  }

  componentWillMount() {
    const {dispatch, routing} = this.props;
    const uri = new urijs(routing.path);
    const id = parseInt(uri.segment(-1));
    this.setState({
      id: id
    });
    dispatch(doModuleGet(id));
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch(moduleReset());
  }

  onPost(formdata) {

    const {dispatch, module} = this.props;

    try {
      formdata.content = JSON.parse(formdata.content);
      // Dispatch action if everything is okay.
      dispatch(doModulePost(formdata));
    } catch ( err ) {
      dispatch(modulePostFailure({
        message: "Invalid JSON",
        payload: formdata
      }));
    }
  }

  render() {
    const self = this;
    const {dispatch, module} = this.props;
    let name;
    let content;


    if (module.post.failed && module.post.payload) {
      name = module.post.payload.name;
      content = module.post.payload.content;
    } else if (module.get.succeeded) {
      name = module.get.payload.name;
      content = JSON.stringify(module.get.payload.content);
    }

    return <Module onPost={ (formdata) => self.onPost(formdata) }
             id={ this.state.id }
             working={ module.post.working || module.get.working }
             name={ name }
             content={ content }
             post={ module.post } />;
  }
}

function select(state) {

  return {
    module: state.app.module,
    routing: state.routing
  };
}

export default connect(select)(ModuleContainer);
