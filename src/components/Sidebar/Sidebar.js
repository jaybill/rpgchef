import './Sidebar.less';
import React, { Component, PropTypes } from 'react';
import { Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';



export default class Sidebar extends Component {

  render() {
    let wtr;

    if (this.props.open) {

      wtr = (<div className="Sidebar open">
               <div onClick={ this.props.onClose } className="button">
                 <i className="fa fa-chevron-left fa-fw"></i>
               </div>
               <h4>Outline</h4>
             </div>);
    } else {
      wtr = (<div className="Sidebar closed">
               <div onClick={ this.props.onOpen } className="button">
                 <i className="fa fa-chevron-right fa-fw"></i>
               </div>
             </div>);
    }



    return wtr;
  }
}
