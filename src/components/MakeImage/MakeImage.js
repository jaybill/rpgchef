import './MakeImage.less';
import React, { Component, PropTypes } from 'react';
import { Alert, Image, Modal, Well, Row, Col, Panel, Input, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import DropZone from 'react-dropzone';
import log from 'loglevel';

export default class MakeImage extends Component {

  constructor() {
    super();
    this.state = {
      uploadingImage: null,
      modalOpen: false,
      failed: null
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.getKeyName = this.getKeyName.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleSelect(name, e) {
    let nnn;
    if (Array.isArray(name)) {
      nnn = this.getKeyName(name);
    }
    const ns = {};
    ns[nnn] = e.target.value;
    this.setState(ns);
    this.props.onFieldChange(name, e.target.value);
  }

  getKeyName(nameArray) {
    return nameArray.join("___");
  }


  openModal() {
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.uploadImage.succeeded) {
      const ni = newProps.uploadImage.payload;
      const name = ["content", ni.k, "content", "filename"];
      this.props.onFieldChange(name, ni.filename, false, true);
      this.props.uploadReset();
      this.setState({
        uploadingImage: null
      });
    }
    if (newProps.uploadImage.failed) {
      this.props.uploadReset();
      this.setState({
        uploadingImage: null,
        failed: newProps.uploadImage.message
      });
    }
  }

  // Utility Methods

  onDrop(k, files) {
    log.debug(this.props);
    this.props.onUploadImage(k, files[0]);
    this.setState({
      failed: null,
      uploadingImage: k
    });
  }

  render() {

    const h = this.props.content;
    const k = this.props.k;
    const ref = this.props.refName;

    let dropContent;
    let imagestyle;
    let imageUrl;
    if (h.content.filename) {
      imageUrl = process.env.SERVER_URL +
        "/api/upload/display/" + this.props.moduleId +
        "/" + h.content.filename + '_thumb';
      imagestyle = {
        backgroundImage: 'url( ' + imageUrl + ')'
      };
    }


    if (this.state.uploadingImage == k) {
      dropContent = <div className="drop-target">
                      <Well bsSize="large">
                        <div>
                          <p>
                            <i className="fa fa-cog fa-spin fa-5x"></i>
                          </p>
                        </div>
                      </Well>
                    </div>;
    } else {
      if (!h.content.filename) {
        dropContent = (
          <DropZone onDrop={ this.onDrop.bind(this, k) } multiple={ false } className="drop-target">
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
          </DropZone>
        );
      } else {
        dropContent = (
          <div className="drop-target">
            <Button onClick={ this.openModal } className="image-zoom" bsSize="xs">
              <i className="fa fa-search fa-fw"></i>
            </Button>
            <Well className="holding" bsSize="large" style={ imagestyle }>
              <DropZone onDrop={ this.onDrop.bind(this, k) } multiple={ false } className="drop-button">
                <Button title="upload new image" bsSize="xs">
                  <i className="fa fa-upload fa-fw"></i>
                </Button>
              </DropZone>
            </Well>
            <Modal show={ this.state.modalOpen } onHide={ this.closeModal }>
              <Modal.Header closeButton>
                <Modal.Title>
                  Image Preview
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="image-preview">
                  <Image src={ imageUrl } responsive/>
                </div>
              </Modal.Body>
            </Modal>
          </div>);
      }
    }

    let tb;
    if (this.state.uploadingImage == k) {
      tb = (<ButtonToolbar>
              <ButtonGroup className="pull-right">
                <Button disabled={ true } bsSize="xs">
                  <i className="fa fa-cog fa-spin"></i>
                </Button>
              </ButtonGroup>
            </ButtonToolbar>);

    } else {
      tb = this.props.toolbar;
    }
    let message;
    if (this.state.failed) {
      message = <Alert bsStyle="danger">
                  <h4>Error</h4>
                  <p>
                    { this.state.failed }
                  </p>
                </Alert>;
    }

    let wtr;
    if (this.props.open) {
      wtr = (
        <section key={ k }
          ref={ ref }
          className={ ref }
          id={ k }>
          { tb }
          <Panel>
            <h4><i onClick={ this.props.onCloseSection } className="fa fa-picture-o"/> Image</h4>
            <Row>
              <Col md={ 3 }>
              { dropContent }
              </Col>
              <Col md={ 9 }>
              { message }
              <Input value={ h.content.displaySize }
                onChange={ this.handleSelect.bind(this, ["content", k, "content", "displaySize"]) }
                addonBefore="Display Format"
                type="select">
              <option value="normal">
                Normal (1 column)
              </option>
              <option value="large">
                Large (2 column)
              </option>
              </Input>
              </Col>
            </Row>
          </Panel>
        </section>);
    } else {
      wtr = <section key={ k } ref={ ref } className={ ref }>
              { this.props.toolbar }
              <Panel onClick={ this.props.onOpenSection }>
                <h4><i className="fa fa-picture-o"/> Image</h4>
              </Panel>
            </section>;

    }
    return wtr;
  }
}
