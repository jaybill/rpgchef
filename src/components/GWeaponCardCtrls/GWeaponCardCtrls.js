import './GWeaponCardCtrls.less';
import React, { Component, PropTypes } from 'react';
import { Glyphicon, Input, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

export default class GWeaponCardCtrls extends Component {

  constructor() {
    super();
    this.saveFunc = this.saveFunc.bind(this);
  }

  saveFunc() {
    this.props.saveFunc(this.props.weapon);
  }

  render() {

    let displayMessage;

    const {message, succeeded, failed, working} = this.props;

    if (succeeded) {
      //displayMessage = <Alert bsStyle="success">{message}</Alert>
    }

    if (failed) {
      //displayMessage = <Alert bsStyle="danger">{message}</Alert>
    }

    return (<div className="GWeaponCardCtrls">

            {displayMessage}
            <ButtonToolbar>
            <ButtonGroup>
            <Button bsSize="xs" bsStyle="primary" onClick={this.saveFunc}>
            <Glyphicon glyph="floppy-disk"/> Save
            </Button>
            </ButtonGroup>
            </ButtonToolbar>
        </div>);
  }
}

GWeaponCardCtrls.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  weapon: PropTypes.object,
  saveFunc: PropTypes.func
}
