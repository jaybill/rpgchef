import './Module.less';
import React, { Component, PropTypes } from 'react';
import { Label, ButtonToolbar, ButtonGroup, Panel, Input, Button, Grid, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
import { CtrldInputText, CtrldTextarea } from '../ControlledField';
import Expire from '../Expire';

export default class Module extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onClickHeading = this.onClickHeading.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.finishEditHeading = this.finishEditHeading.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    if (this.props.isNew) {
      this.onClickHeading();
    }
  }

  onClickHeading() {
    this.setState({
      editHeading: true
    });
  }

  finishEditHeading() {
    this.setState({
      editHeading: false
    });
    this.onPost();
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.finishEditHeading();
    }
  }

  onPost() {
    this.props.onPost({
      id: this.state.id,
      name: this.state.name,
      content: this.state.content
    });
  }

  onDelete() {
    this.props.onDelete(this.props.id);
  }


  componentWillUnmount() {
    if (this._timer) {
      window.clearTimeout(this._timer);
    }
  }
  componentWillMount() {

    this.setState({
      id: this.props.id,
      name: this.props.name,
      content: this.props.content
    });
  }

  componentWillReceiveProps(newProps) {
    const {message, succeeded, failed, working} = this.props.post;
    const delSuccceeded = this.props.del.succeeded;
    const delWorking = this.props.del.working;

    if (!delSuccceeded && !delWorking && (succeeded || failed)) {
      this._timer = window.setTimeout(function() {
        this.setState({
          succeeded: false,
          failed: false
        });

      }.bind(this), 1000);
    }
    this.setState({
      id: newProps.id,
      name: newProps.name,
      content: newProps.content,
      succeeded: succeeded,
      failed: failed
    });
  }

  onFieldChange(name, newValue) {
    const newState = {};
    newState[name] = newValue;
    this.setState(newState);
  }

  render() {
    const self = this;
    let displayMessage;
    const {message, succeeded, failed, working} = this.props.post;

    if (this.state.succeeded) {
      displayMessage = <Label bsStyle="success">
                         Module saved.
                       </Label>;

    }

    if (this.state.failed) {
      displayMessage = <Label bsStyle="danger">
                         { message }
                       </Label>;

    }

    let heading;

    if (this.state.editHeading) {
      heading = <Grid className="edit-name">
                  <Row className="no-gutter">
                    <Col md={ 8 }>
                      <CtrldInputText type="text"
                        focusMe={ true }
                        className="form-control input-edit-name"
                        value={ this.state.name }
                        name="name"
                        disabled={ working }
                        onKeyUp={ this.handleKeyUp }
                        onFieldChange={ this.onFieldChange } />
                    </Col>
                    <Col md={ 1 }>
                      <Button onClick={ this.finishEditHeading }>
                        <i className="fa fa-floppy-o fa-fw"></i>
                      </Button>
                    </Col>
                  </Row>
                </Grid>
      ;
    } else {
      heading = <h2 title="Click to edit" onClick={ this.onClickHeading }>{ this.state.name }</h2>;
    }

    const deletePopover = <Popover id="confirm-delete" rootClose={ true } title="Confirm Delete">
                            <p>
                              Are you sure you want to delete this module? This cannot be undone.
                            </p>
                            <Button onClick={ self.onDelete }
                              block
                              bsSize="small"
                              bsStyle="danger">
                              Delete Module
                            </Button>
                          </Popover>;

    return (<div className="Module">
              { heading }
              <Panel bsStyle="primary">
                <Grid>
                  <Row className="no-gutter">
                    <Col md={ 10 }>
                      <ButtonToolbar>
                        <ButtonGroup>
                          <Button title="Save" onClick={ this.onPost }>
                            <i className="fa fa-floppy-o fa-fw"></i>
                          </Button>
                          <OverlayTrigger trigger="click" placement="right" overlay={ deletePopover }>
                            <Button title="Delete">
                              <i className="fa fa-trash-o fa-fw"></i>
                            </Button>
                          </OverlayTrigger>
                          <Button title="Create PDF">
                            <i className="fa fa-file-pdf-o fa-fw"></i>
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                          <Button title="Insert Section Heading">
                            <i className="fa fa-header fa-fw"></i>
                          </Button>
                          <Button title="Insert Subsection Heading">
                            <i className="fa fa-h-square fa-fw"></i>
                          </Button>
                          <Button title="Insert Text Box">
                            <i className="fa fa-list-alt fa-fw"></i>
                          </Button>
                          <Button title="Insert Monster">
                            <i className="icon icon-goblin"></i>
                          </Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                    </Col>
                    <Col md={ 2 }>
                      { displayMessage }
                    </Col>
                  </Row>
                </Grid>
              </Panel>
              <Grid>
                <Row className="no-gutter">
                  <Col md={ 6 }>
                    <Panel bsStyle="primary">
                      <div className="form-group">
                        <label>
                          Content
                        </label>
                        <CtrldTextarea className="form-control"
                          value={ this.state.content }
                          name="content"
                          disabled={ working }
                          onFieldChange={ this.onFieldChange } />
                      </div>
                    </Panel>
                  </Col>
                </Row>
              </Grid>
            </div>);
  }
}
