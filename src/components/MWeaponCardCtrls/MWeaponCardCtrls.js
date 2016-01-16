import './MWeaponCardCtrls.less';
import React, { Component, PropTypes } from 'react';
import { Glyphicon, Input, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

export default class MWeaponCardCtrls extends Component {

  constructor() {
    super();
    this.delFunc = this.delFunc.bind(this);
  }

  delFunc() {
    this.props.delFunc(this.props.weapon.id);
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

    return (<div className="MWeaponCardCtrls">
              { displayMessage }
              <ButtonToolbar>
                <ButtonGroup>
                  <Button disabled={ working } bsSize="xs" bsStyle="danger" onClick={ this.delFunc }>
                    <Glyphicon glyph="trash" /> Delete
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
            </div>);
  }
}

MWeaponCardCtrls.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  weapon: PropTypes.object,
  saveFunc: PropTypes.func
}
