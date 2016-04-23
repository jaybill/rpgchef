import './OutlineCard.less';
import React, { Component } from 'react';


export default class OutlineCard extends Component {


  render() {
    return (
      <div className="OutlineCard">
        <i className={ this.props.iconClass }></i>&nbsp;
        { this.props.text }
      </div>
      );
  }
}
;
