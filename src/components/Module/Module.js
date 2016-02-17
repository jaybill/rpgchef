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
    this.moveToTop = this.moveToTop.bind(this);
    this.moveToBottom = this.moveToBottom.bind(this);
    this.addSection = this.addSection.bind(this);
    this.makeEditable = this.makeEditable.bind(this);
    this.lazyUpdate = _.throttle((newstate, callback) => {
      this.setState(newstate, callback);
    }, 100);
    this.lazyUpdate = this.lazyUpdate.bind(this);
  }

  makePdf() {
    this.props.makePdf({
      id: this.state.id,
      name: this.state.name,
      content: this.state.content
    });
  }

  componentDidMount() {
    if (this.props.name && !this.props.content.length) {
      this.onClickHeading();
    }
  }

  onClickHeading(which) {
    this.setState({
      editHeading: which,
      skipUpdate: false,
      scrollToLast: false
    });
  }

  finishEditHeading() {
    this.setState({
      editHeading: null,
      skipUpdate: false,
      scrollToLast: false
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
      content: this.state.content,
      subtitle: this.state.subtitle
    });
    this.setState({
      scrollToLast: false
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

  componentWillReceiveProps(newProps) {
    const {message, succeeded, failed, working} = newProps.post;
    const delSuccceeded = newProps.del.succeeded;
    const delWorking = newProps.del.working;

    if (!delSuccceeded && !delWorking && (succeeded || failed)) {
      this._timer = window.setTimeout(function() {
        this.props.resetPost();
      }.bind(this), 1000);
    }
    const module = newProps.module || {};
    this.setState({
      id: newProps.id,
      name: module.name,
      subtitle: module.subtitle,
      content: module.content,
      succeeded: succeeded,
      failed: failed,
      skipUpdate: false
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

  showOrder(a) {
    const aa = [];

    _.forEach(a, (aaa, i) => {
      aa.push(aaa.content.title, i);
    });
    return aa;
  }

  moveSection(k, a) {
    const newContent = Object.assign([], this.state.content);
    [newContent[k], newContent[k + a]] = [newContent[k + a], newContent[k]];
    this.setState({
      content: newContent,
      scrollToLast: false,
      skipUpdate: false
    });
  }

  moveToTop(k) {
    const newContent = Object.assign([], this.state.content);
    [newContent[k], newContent[0]] = [newContent[0], newContent[k]];
    this.setState({
      content: newContent,
      scrollToLast: false,
      skipUpdate: false
    });
  }
  moveToBottom(k) {
    const newContent = Object.assign([], this.state.content);
    const end = newContent.length - 1;
    [newContent[k], newContent[end]] = [newContent[end], newContent[k]];
    this.setState({
      content: newContent,
      scrollToLast: false,
      skipUpdate: false
    });
  }

  removeSection(k) {


    const newContent = Object.assign([], this.state.content);
    newContent.splice(k, 1);
    this.setState({
      content: newContent,
      scrollToLast: false,
      skipUpdate: false
    });
  }


  addSection(type) {
    const self = this;
    const newSection = {};
    switch (type) {
      case "pagebreak":
        newSection.type = "pagebreak";
        break;
      case "columnbreak":
        newSection.type = "columnbreak";
        break;
      case "section":
        newSection.type = "section";
        newSection.content = {
          title: ""
        };
        break;
      case "image":
        newSection.type = "image";
        newSection.content = {};
        break;
      case "subsection":
        newSection.type = "subsection";
        newSection.content = {
          title: ""
        };
        break;
      case "table":
        newSection.type = "table";
        newSection.content = {
          data: []
        };
        break;
      case "monster":
        newSection.type = "monster";
        newSection.content = {
          "type": "monster",
          "content": {
            "xp": null,
            "CHA": 10,
            "CON": 10,
            "DEX": 10,
            "INT": 10,
            "STR": 10,
            "WIS": 10,
            "name": null,
            "size": "Tiny",
            "speed": null,
            "senses": null,
            "skills": null,
            "traits": [],
            "actions": [],
            "alignment": "Unaligined",
            "challenge": null,
            "hitpoints": null,
            "languages": null,
            "armorclass": null,
            "raceOrType": null,
            "savingThrows": null,
            "legendaryPoints": 0,
            "damageImmunities": null,
            "damageResistances": null,
            "legendaryActions": [],
            "conditionImmunities": null,
            "damageVulnerabilities": null
          }
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

    const newContent = Object.assign([], self.state.content);
    newContent[newContent.length] = newSection;
    this.setState({
      content: newContent,
      scrollToLast: true,
      skipUpdate: false
    }, () => {
      this.onPost();
    });
  }

  shouldComponentUpdate(newProps, newState) {
    return !!!newState.skipUpdate;
  }

  onFieldChange(name, newValue, skipUpdate = true, forceSave = false) {
    let newState = {};
    if (Array.isArray(name)) {
      newState = Object.assign({}, this.state);
      _.set(newState, name, newValue);
    } else {
      newState[name] = newValue;
    }
    if (!forceSave) {
      newState.skipUpdate = skipUpdate;
      this.lazyUpdate(newState);
    } else {
      newState.skipUpdate = false;
      this.lazyUpdate(newState, () => {
        log.debug("Forcing save!");
        this.onPost();
      });
    }
  }

  makeEditable(name, clickOn) {
    let eee;

    if (this.state.editHeading == name) {
      eee = <Grid className="edit-name">
              <Row className="no-gutter">
                <Col md={ 8 }>
                  <CtrldInputText type="text"
                    focusMe={ true }
                    className="form-control input-edit-name"
                    value={ this.state[name] }
                    name={ name }
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
      eee = (<div title="Click to edit" onClick={ this.onClickHeading.bind(this, name) }>
               { clickOn }
             </div>);
    }
    return eee;
  }

  render() {

    if (!this.props.module) {
      return <div></div>;
    }
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

    if (this.props.getPdf.failed) {
      displayMessage = <Label bsStyle="danger">
                         { this.props.getPdf.message }
                       </Label>;
    }

    let editor;
    if (this.state.content) {

      editor = <ContentEditor removeSection={ self.removeSection }
                 scrollToLast={ this.state.scrollToLast }
                 moveSection={ self.moveSection }
                 moveToTop={ self.moveToTop }
                 moveToBottom={ self.moveToBottom }
                 content={ this.state.content }
                 onUploadImage={ (k, file) => {
                                   this.props.onUploadImage(k, file);
                                 } }
                 uploadImage={ this.props.uploadImage }
                 uploadReset={ this.props.uploadReset }
                 onFieldChange={ this.onFieldChange } />;
    }

    const eh = <h2>{ this.state.name }</h2>;

    const heading = this.makeEditable("name", eh);
    let stw = this.state.subtitle;
    if (!stw) {
      stw = <em>(click to add subtitle)</em>;
    }
    const est = <h3 className="subtitle">{ stw }</h3>;
    const subtitleHeading = this.makeEditable("subtitle", est);
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
                    <NavItem onClick={ self.addSection.bind(this, "table") } title="Insert Table">
                      <i className="fa fa-table fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "pagebreak") } title="Insert Page Break">
                      <i className="icon icon-page-break"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "columnbreak") } title="Insert Column Break">
                      <i className="icon icon-column-break"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "monster") } title="Insert Monster">
                      <i className="icon icon-goblin"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "image") } title="Insert Image">
                      <i className="fa fa-picture-o fa-fw"></i>
                    </NavItem>
                  </Nav>
                  <Nav pullRight>
                    { displayMessage }
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              { heading }
              { subtitleHeading }
              { editor }
              { pdfLink }
            </div>);
  }
}
