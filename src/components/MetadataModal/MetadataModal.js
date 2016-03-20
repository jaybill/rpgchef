import './MetadataModal.less';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Modal, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import { CtrldInputText } from '../ControlledField';

export default class MetadataModal extends Component {

  constructor() {
    super();
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {};
  }

  onSave() {
    this.props.setState(this.state);
    this.props.onHide();
  }

  onHide() {
    this.setState(this.props.meta);
    this.props.onHide();
  }

  handleSelect(name, e) {
    const ns = {};
    ns[name] = e.target.value;
    this.setState(ns);
  }

  onFieldChange(name, value) {
    const p = {};
    p[name] = value;
    this.setState(p);
  }

  componentWillMount() {
    this.setState(this.props.meta);
  }

  render() {
    return (
      <Modal className="Metadata" show={ this.props.show } onHide={ this.onHide }>
        <Modal.Header closeButton>
          <Modal.Title>
            Module Metadata
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>
              Title
            </label>
            <CtrldInputText type="text"
              className="form-control"
              value={ this.state.name }
              name="name"
              placeholder="i.e. Storming The Castle"
              onFieldChange={ this.onFieldChange } />
          </div>
          <div className="form-group">
            <label>
              Subtitle
            </label>
            <CtrldInputText type="text"
              className="form-control"
              value={ this.state.subtitle }
              name="subtitle"
              placeholder="i.e. An adventure for 3-4 players Levels 3-5"
              onFieldChange={ this.onFieldChange } />
          </div>
          <div className="form-group">
            <label>
              Author
            </label>
            <CtrldInputText type="text"
              className="form-control"
              value={ this.state.author }
              name="author"
              placeholder="i.e. George R. R. Martin"
              onFieldChange={ this.onFieldChange } />
          </div>
          <div className="form-group">
            <label>
              Version
            </label>
            <CtrldInputText type="text"
              className="form-control"
              value={ this.state.version }
              name="version"
              placeholder="i.e. 1.0"
              onFieldChange={ this.onFieldChange } />
          </div>
          <Input value={ this.state.hasCover }
            onChange={ this.handleSelect.bind(this, "hasCover") }
            label="Has cover?"
            type="select">
          <option value={ false }>
            No
          </option>
          <option value={ true }>
            Yes
          </option>
          </Input>
          <Button onClick={ this.onSave } bsStyle="primary" block>
            Save
          </Button>
        </Modal.Body>
      </Modal>);
  }
}
