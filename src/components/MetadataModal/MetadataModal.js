import './MetadataModal.less';
import React, { Component, PropTypes } from 'react';
import { Modal, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';

export default class MetadataModal extends Component {

  constructor() {
    super();
  }

  render() {

    return (
      <Modal className="Metadata" show={ this.props.show } onHide={ this.props.onHide }>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>Module Metadata</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
      </Modal>);
  }
}
