import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';

class PathKnower extends Component {

  constructor() {
    super();
    this.tell = this.tell.bind(this);
  }

  componentWillMount() {
    const {routing} = this.props;
    this.tell(routing.path);
  }

  componentWillReceiveProps(newprops) {
    const {routing} = newprops;
    this.tell(routing.path);
  }

  tell(path) {
    if (this.props.tell) {
      this.props.tell(path);
    }
  }

  render() {
    return <script/>;
  }

}

function select(state) {
  return {
    routing: state.routing
  };
}


export default connect(select)(PathKnower);
