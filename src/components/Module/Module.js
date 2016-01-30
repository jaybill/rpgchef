import './Module.less';
import React, { Component, PropTypes } from 'react';
import { AutoAffix } from 'react-overlays';
import { NavItem, Navbar, Nav, Label, ButtonToolbar, ButtonGroup, Panel, Input, Button, Grid, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
import { CtrldInputText, CtrldTextarea } from '../ControlledField';
import Expire from '../Expire';
import ContentEditor from "../ContentEditor";
import log from 'loglevel';
import _ from 'lodash';

export default class Module extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onClickHeading = this.onClickHeading.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.finishEditHeading = this.finishEditHeading.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.makePdf = this.makePdf.bind(this);
    this.removeSection = this.removeSection.bind(this);
    this.moveSection = this.moveSection.bind(this);
    this.addSection = this.addSection.bind(this);
  }

  makePdf() {
    this.props.makePdf({
      id: this.state.id,
      name: this.state.name,
      content: this.state.content
    });
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
    const {message, succeeded, failed, working} = newProps.post;
    const delSuccceeded = newProps.del.succeeded;
    const delWorking = newProps.del.working;

    if (!delSuccceeded && !delWorking && (succeeded || failed)) {
      this._timer = window.setTimeout(function() {
        this.props.resetPost();
      }.bind(this), 1000);
    }
    this.setState({
      id: newProps.id,
      name: newProps.name,
      content: newProps.content,
      succeeded: succeeded,
      failed: failed
    });

    if (newProps.pdfUrl && !this._clickTimer) {
      this._clickTimer = window.setTimeout((self) => {
        window.clearTimeout(self._clickTimer);
        this._clickTimer = null;
        if (self.refs.pdfLink) {
          self.refs.pdfLink.click();
        }
      }, 1000, this);
    }
  }

  moveSection(k, a) {
    const newContent = Object.assign([], this.state.content);
    [newContent[k], newContent[k + a]] = [newContent[k + a], newContent[k]];
    this.setState({
      content: newContent,
      scrollToLast: false
    });
  }

  removeSection(k) {
    const newContent = Object.assign([], this.state.content);
    newContent.splice(k, 1);
    this.setState({
      content: newContent,
      scrollToLast: false
    });
  }

  addSection(type) {
    const newSection = {};
    switch (type) {

      case "section":
        newSection.type = "section";
        newSection.content = {
          title: ""
        };
        break;
      case "subsection":
        newSection.type = "subsection";
        newSection.content = {
          title: ""
        };
        break;
      case "monster":
        newSection.type = "monster";
        newSection.content = {
          name: ""
        };
        break;

      case "commentbox":
        newSection.type = "commentbox";
        newSection.content = {
          title: "",
          text: ""
        };
        break;
      default:
        newSection.type = "text";
        newSection.content = {
          text: ""
        };
        break;
    }

    const newContent = Object.assign([], this.state.content);
    newContent.push(newSection);
    this.setState({
      content: newContent,
      scrollToLast: true
    });
  }


  onFieldChange(name, newValue) {

    if (Array.isArray(name)) {
      const newStateObj = Object.assign({}, this.state);
      _.set(newStateObj, name, newValue);
      this.setState(newStateObj);
    } else {
      const newState = {};
      newState[name] = newValue;
      this.setState(newState);
    }
  }

  render() {
    const self = this;
    let displayMessage;
    let pdfLink;
    let pdfClass = "fa fa-file-pdf-o fa-fw";
    const {message, succeeded, failed, working} = this.props.post;

    if (this.state.succeeded) {
      displayMessage = <Label bsStyle="success">
                         Module saved.
                       </Label>;

    }

    if (this.props.pdfWorking) {
      pdfClass = "fa fa-file-pdf-o fa-fw fa-spin";
    }

    if (this.props.pdfUrl) {


      pdfLink = <a className="text-hide"
                  ref="pdfLink"
                  href={ this.props.pdfUrl }
                  download>PDF</a>;

    }

    if (this.state.failed) {
      displayMessage = <Label bsStyle="danger">
                         { message }
                       </Label>;

    }

    let editor;
    if (this.state.content) {
      editor = <ContentEditor removeSection={ self.removeSection }
                 scrollToLast={ this.state.scrollToLast }
                 moveSection={ self.moveSection }
                 content={ this.state.content }
                 onFieldChange={ this.onFieldChange } />;
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
              <Navbar fixedTop>
                <Navbar.Header>
                  <Navbar.Brand>
                    Module Editor
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav>
                    <NavItem title="Save" onClick={ this.onPost }>
                      <i className="fa fa-floppy-o fa-fw"></i>
                    </NavItem>
                    <OverlayTrigger rootClose={ true }
                      trigger="click"
                      placement="right"
                      overlay={ deletePopover }>
                      <NavItem title="Delete">
                        <i className="fa fa-trash-o fa-fw"></i>
                      </NavItem>
                    </OverlayTrigger>
                    <NavItem disabled={ this.props.pdfWorking || !this.props.canMakePdf } onClick={ self.makePdf } title="Create PDF">
                      <i className={ pdfClass }></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "section") } title="Insert Section Heading">
                      <i className="fa fa-header fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "subsection") } title="Insert Subsection Heading">
                      <i className="fa fa-h-square fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection } title="Insert Text">
                      <i className="fa fa-paragraph fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "commentbox") } title="Insert Text Box">
                      <i className="fa fa-list-alt fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "monster") } title="Insert Monster">
                      <i className="icon icon-goblin"></i>
                    </NavItem>
                  </Nav>
                  <Nav pullRight>
                    { displayMessage }
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              { heading }
              { editor }
              { pdfLink }
            </div>);
  }
}
