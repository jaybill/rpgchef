import './Home.less';
import React from 'react';
import log from 'loglevel';
import { RouteHandler } from 'react-router';



export var componentDef = {

  componentWillMount() {},

  render() {

    return (
      <div className="Home-Container"> {this.props.children}</div>
      );
  }

}
export default React.createClass(componentDef);
