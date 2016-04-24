import './MetadataModal.less';
import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Well, Modal, Input, Button, Row, Col } from 'react-bootstrap';
import { CtrldInputText } from '../ControlledField';
import DropZone from 'react-dropzone';
import log from 'loglevel';
import { stringToBoolean } from '../../lib/util';
export default class MetadataModal extends Component {

  constructor() {
    super();
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMetaSelect = this.handleMetaSelect.bind(this);
    this.onChangeMeta = this.onChangeMeta.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.state = {};
  }

  componentWillReceiveProps(newProps) {
    if (newProps.uploadImage.succeeded && newProps.uploadImage.payload.filename) {
      const ni = newProps.uploadImage.payload;
      if (ni.k == "cover") {
        this.setState({
          coverUrl: ni.filename,
          uploadingImage: null
        });
        this.props.uploadReset();
      }
    }

    if (newProps.uploadImage.failed && newProps.uploadImage.payload && newProps.uploadImage.payload.k == "cover") {
      this.props.uploadReset();
      this.setState({
        uploadingImage: null,
        failed: newProps.uploadImage.message
      });
    }

    if (newProps.metaReset) {
      this.setState(this.props.meta, this.props.onMetaResetDone);
    }
  }

  onSave() {
    this.props.setState(_.omit(this.state, ["uploadingImage", "failed"]));
    this.props.onHide(true);
  }

  onHide() {
    this.props.onHide();
  }

  handleSelect(name, e) {
    const ns = {};
    let val = e.target.value;
    if (val == "false" || val == "true") {
      val = stringToBoolean(val);
    }
    ns[name] = val;
    log.debug(ns);
    this.setState(ns);
  }

  onFieldChange(name, value) {
    const p = {};
    p[name] = value;
    this.setState(p);
  }

  handleMetaSelect(name, e) {
    const m = Object.assign({}, this.state.metadata);
    let val = e.target.value;
    if (val == "false" || val == "true") {
      val = stringToBoolean(val);
    }
    m[name] = val;
    this.setState({
      metadata: m
    });
  }
  onChangeMeta(name, val) {
    const m = Object.assign({}, this.state.metadata);
    m[name] = val;
    this.setState({
      metadata: m
    });
  }


  componentWillMount() {
    this.setState(this.props.meta);
    if (!this.props.meta.hasCover) {
      this.setState({
        coverUrl: null
      });
    }
  }

  onDrop(files) {

    this.props.onUploadImage("cover", files[0]);
    this.setState({
      failed: null,
      uploadingImage: "cover"
    });
  }

  render() {
    let imageUrl;

    let dropDiv;
    let imagestyle;

    if (this.state.hasCover) {
      let dropContent;
      if (this.state.coverUrl) {
        imageUrl = process.env.SERVER_URL +
          "/api/upload/display/" + this.props.moduleId +
          "/" + this.state.coverUrl + '_thumb';
        imagestyle = {
          backgroundImage: 'url( ' + imageUrl + ')'
        };
      }


      if (this.state.uploadingImage == "cover") {
        dropContent = <div className="cover-target">
                        <Well bsSize="large">
                          <div>
                            <p>
                              <i className="fa fa-cog fa-spin fa-5x"></i>
                            </p>
                          </div>
                        </Well>
                      </div>;
      } else {
        if (!this.state.coverUrl || !this.state.hasCover) {
          dropContent = ( (
            <DropZone onDrop={ this.onDrop } multiple={ false } className="cover-target">
              <Well bsSize="large">
                <div>
                  <p>
                    Drop Image File Here
                  </p>
                  <p>
                    (or click to choose a file)
                  </p>
                </div>
              </Well>
            </DropZone>)
          );
        } else {
          dropContent = (
            <div className="cover-target">
              <Well className="holding" bsSize="large" style={ imagestyle }>
                <DropZone onDrop={ this.onDrop } multiple={ false } className="drop-button">
                  <Button title="upload new image" bsSize="xs">
                    <i className="fa fa-upload fa-fw"></i>
                  </Button>
                </DropZone>
              </Well>
            </div>);
        }
      }
      dropDiv = (<Row>
                   <Col md={ 4 }>
                   { dropContent }
                   </Col>
                   <Col md={ 8 }>
                   <h4>Cover Image</h4>
                   <p>
                     Cover images should be:
                   </p>
                   <ul>
                     <li>
                       PNG or JPG
                     </li>
                     <li>
                       1275 pixels wide by 1650 pixels high
                     </li>
                     <li>
                       150 DPI
                     </li>
                   </ul>
                   </Col>
                 </Row>);
    }

    return (
      <Modal className="MetadataModal" show={ this.props.show } onHide={ this.onHide }>
        <Modal.Header closeButton={ this.state.uploadingImage != "cover" }>
          <Modal.Title>
            Module Metadata
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={ 6 }>
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
                Copyright Holder
              </label>
              <CtrldInputText type="text"
                className="form-control"
                value={ this.state.metadata.copyrightHolder }
                name="copyrightHolder"
                placeholder="i.e. Author or Organization"
                onFieldChange={ this.onChangeMeta } />
            </div>
            <div className="form-group">
              <label>
                Copyright Year
              </label>
              <CtrldInputText type="text"
                className="form-control"
                value={ this.state.metadata.copyrightYear }
                name="copyrightYear"
                placeholder="i.e. 2016"
                onFieldChange={ this.onChangeMeta } />
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
            <Input value={ this.state.metadata.dmsguild }
              onChange={ this.handleMetaSelect.bind(this, "dmsguild") }
              label="Will this be DMs Guild content?"
              type="select">
            <option value={ false }>
              No
            </option>
            <option value={ true }>
              Yes
            </option>
            </Input>
            </Col>
            <Col md={ 6 }>
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
            <div className="drop-holder">
              { dropDiv }
            </div>
            </Col>
          </Row>
          <Row>
            <Col md={ 2 } mdOffset={ 10 }>
            <Button block
              disabled={ this.state.uploadingImage == "cover" }
              onClick={ this.onSave }
              bsStyle="primary">
              Save
            </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>);
  }
}
