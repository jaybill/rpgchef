import './Module.less';
import React, { Component, PropTypes } from 'react';
import { Label, ButtonToolbar, ButtonGroup, Panel, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import { CtrldInputText, CtrldTextarea } from '../ControlledField';
import Expire from '../Expire';

export default class Module extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onClickHeading = this.onClickHeading.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  onClickHeading() {
    this.setState({
      editHeading: true
    });
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.setState({
        editHeading: false
      });
    }
  }

  onPost() {
    this.props.onPost({
      id: this.state.id,
      name: this.state.name,
      content: this.state.content
    });
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

    window.setTimeout(function() {
      this.setState({
        succeeded: false,
        failed: false
      });
    }.bind(this), 1000);

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
      heading = <h2><CtrldInputText type="text"
                      focusMe={ true }
                      className="form-control"
                      value={ this.state.name }
                      name="name"
                      disabled={ working }
                      onKeyUp={ this.handleKeyUp }
                      onFieldChange={ this.onFieldChange } /></h2>;
    } else {
      heading = <h2 title="Click to edit" onClick={ this.onClickHeading }>{ this.state.name }</h2>;
    }

    return (<div className="Module">
              { heading }
              <Panel bsStyle="primary">
                <Grid>
                  <Row className="no-gutter">
                    <Col md={ 10 }>
                      <ButtonToolbar>
                        <ButtonGroup>
                          <Button title="Save" onClick={ this.onPost } bsStyle="primary">
                            <i className="fa fa-floppy-o fa-fw"></i>
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                          <Button title="Delete" bsStyle="danger">
                            <i className="fa fa-trash-o fa-fw"></i>
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                          <Button title="Print" bsStyle="info">
                            <i className="fa fa-print fa-fw"></i>
                          </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                          <Button title="Insert Section Heading">
                            <i className="fa fa-header fa-fw"></i>
                          </Button>
                          <Button title="Insert Subsection Heading">
                            <i className="fa fa-h-square fa-fw"></i>
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
