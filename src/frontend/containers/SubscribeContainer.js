import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { subscribePost as doSubscribePost, subscribeGet as doSubscribeGet } from '../actions/subscribe';
import Subscribe from '../../components/Subscribe';

class SubscribeContainer extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const {dispatch, subscribe} = this.props;
    dispatch(doSubscribeGet());
  }

  onSubmit(formdata) {
    const {dispatch, subscribe} = this.props;
    dispatch(doSubscribePost(formdata));
  }

  render() {
    const self = this;
    const {dispatch, subscribePost, subscribeGet} = this.props;

    return <Subscribe onSubmit={ (formdata) => self.onSubmit(formdata) } subscribePost={ subscribePost } subscribeGet={ subscribeGet } />
  }
}

function select(state) {

  return {
    subscribePost: state.app.subscribe.post,
    subscribeGet: state.app.subscribe.get
  };
}

export default connect(select)(SubscribeContainer);
