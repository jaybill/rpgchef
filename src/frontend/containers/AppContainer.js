import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import Moment from 'moment';
import App from '../../components/App';
import { me } from '../actions/me';
import { updatePath } from 'redux-simple-router';
import urijs from 'urijs';
import _ from 'lodash';

class AppContainer extends Component {

  constructor() {
    super();
    this.dismissNag = this.dismissNag.bind(this);
    this.checkForNag = this.checkForNag.bind(this);
    this.state = {nagVisible: false,nagDismissed: false};
  }

  checkForNag(props){
    const {session,routing} = props;
    let onPageThatCanShowNag = true;
    const disallowedPaths = ['/app/module/','/app/subscribe'];

    disallowedPaths.forEach((path,i)=>{
      if(_.startsWith(routing.path,path)){
        onPageThatCanShowNag = false;
      }      
    });          
     
    if (session.isLoaded && session.isLoggedIn) {
      let nag;
      const oldEnoughToNag
            = new Moment(session.user.createdAt).isBefore(new Moment().subtract(2,'weeks'));
      if(oldEnoughToNag && !session.user.paid && onPageThatCanShowNag && !this.state.nagDismissed){
        this.setState({nagVisible: true});
      } else {
        this.setState({nagVisible: false});
      }
    }
  }
  
  componentWillMount() {
    const {dispatch, session} = this.props;
    if (!session.isLoaded) {
      dispatch(me());
    }
    this.checkForNag(this.props);
  }

  componentWillReceiveProps(props) {
    const {dispatch, session, routing} = props;
    if (session.isLoaded && !session.isLoggedIn) {
      const uri = new urijs('/login');
      uri.query({
        redirectTo: routing.path
      });
      dispatch(updatePath(uri.toString()));
    }
    this.checkForNag(props);
  }

  dismissNag(){
    this.setState({nagDismissed: true,nagVisible: false});
  }

  render() {
    const {dispatch, session} = this.props;
    var wtr = <div>
                Loading...
              </div>;
    if (session.isLoaded && session.isLoggedIn) {
      wtr = <App onDismissNag={this.dismissNag}
        nag={this.state.nagVisible}
        user={ session.user }>
              { this.props.children }
            </App>;
    }

    return wtr;
  }

}

function select(state) {
  return {
    routing: state.routing,
    session: state.app.session
  };
}

export default connect(select)(AppContainer);
