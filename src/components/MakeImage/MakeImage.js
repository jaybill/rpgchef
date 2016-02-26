import './MakeImage.less';
import React, { Component, PropTypes } from 'react';
import { Well, Row, Col, Panel, Input, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import DropZone from 'react-dropzone';
import log from 'loglevel';

export default class MakeImage extends Component {

  constructor() {
    super();
    this.state = {
      uploadingImage: null
    };

    this.onDrop = this.onDrop.bind(this);
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
  }

  // Utility Methods

  onDrop(k, files) {
    log.debug(this.props);
    this.props.onUploadImage(k, files[0]);
    this.setState({
      uploadingImage: k
    });
  }

  render() {

    const h = this.props.content;
    const k = this.props.k;
    const ref = this.props.refName;

    let dropContent;

    if (this.state.uploadingImage == k) {
      dropContent = <div>
                      <i className="fa fa-cog fa-spin fa-5x"></i>
                    </div>;
    } else {
      dropContent = (
        <div>
          <p>
            Drop Image File Here
          </p>
          <p>
            (or click to choose a file)
          </p>
        </div>);
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

    return (<section key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { tb }
              <Panel>
                <h4>Image</h4>
                <Row>
                  <Col md={ 3 }>
                    <DropZone onDrop={ this.onDrop.bind(this, k) } multiple={ false } className="drop-target">
                      <Well bsSize="large">
                        { dropContent }
                      </Well>
                    </DropZone>
                  </Col>
                  <Col md={ 9 }>
                    { h.content.filename || "no file" }
                  </Col>
                </Row>
              </Panel>
            </section>);
  }
}
