'use strict';

import './Confirm.less';
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { Link } from 'react-router';
import log from 'loglevel';

class Confirm extends Component {


  render() {
    let style = "success";
    let link = <Link to="/home">Log in</Link>;

    const {success, message} = this.props;

    if (!success) {
      style = "danger";
      link = <Link to="/register">Register again</Link>;
    }

    return (
      <div className="Confirm">
            <Alert bsStyle={style} >{this.props.message}</Alert>
            <p>{link}</p>
      </div>
      );
  }

}

export default Confirm;
