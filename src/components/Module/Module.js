import './Module.less';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { NavDropdown, MenuItem, NavItem, Navbar, Nav, Label, Input, Button, Grid, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
import { CtrldInputText, CtrldTextarea } from '../ControlledField';
import log from 'loglevel';
import _ from 'lodash';
import MakeMonster from '../MakeMonster';
import MakeText from '../MakeText';
import MakeSection from '../MakeSection';
import MakeCommentBox from '../MakeCommentBox';
import MakeBreak from '../MakeBreak';
import MakeTable from '../MakeTable';
import MakeImage from '../MakeImage';
import { getPosition } from '../../frontend/domutils';
import SectionToolbar from '../SectionToolbar';
import MonstersContainer from '../../frontend/containers/MonstersContainer';
import PdfPreview from '../PdfPreview';
import ScrollToElement from 'scroll-to-element';
import MetadataModal from '../MetadataModal';
import ConfirmDelete from '../ConfirmDelete';
import Sidebar from '../Sidebar';
import OutlineCard from '../OutlineCard';
import update from 'react/lib/update';


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
    this.save = this.save.bind(this);
    this.openMonsterModal = this.openMonsterModal.bind(this);
    this.closeMonsterModal = this.closeMonsterModal.bind(this);
    this.onGetMonster = this.onGetMonster.bind(this);
    this.openSection = this.openSection.bind(this);
    this.openPreviewModal = this.openPreviewModal.bind(this);
    this.closePreviewModal = this.closePreviewModal.bind(this);
    this.openMetaModal = this.openMetaModal.bind(this);
    this.closeMetaModal = this.closeMetaModal.bind(this);
    this.resetMetaDone = this.resetMetaDone.bind(this);
    this.getSaveable = this.getSaveable.bind(this);
    this.toggleSectionMark = this.toggleSectionMark.bind(this);
    this.removeMarked = this.removeMarked.bind(this);
    this.removeSections = this.removeSections.bind(this);
    this.unmarkAll = this.unmarkAll.bind(this);
    this.swapSections = this.swapSections.bind(this);

    this.lazyUpdate = _.throttle((newstate, callback) => {
      this.setState(newstate, callback);
    }, 100);
    this.lazyUpdate = this.lazyUpdate.bind(this);

    this.state = {
      previewModalOpen: false,
      marked: [],
      openSidebar: false
    };
  }

  openSidebar(open) {
    this.setState({
      openSidebar: !!open
    });
  }

  resetMetaDone() {
    this.setState({
      metaReset: false
    });
  }

  openSection(k) {
    let o;
    if (typeof k != "undefined" && typeof k != "null") {
      o = true;
    } else {
      o = false;
    }
    this.setState({
      openSection: k,
      scrollToOpen: o
    });
  }

  openPreviewModal() {
    this.props.makePdf(this.getSaveable(), true);
    this.setState({
      previewModalOpen: true
    });
  }

  closePreviewModal() {
    this.setState({
      previewModalOpen: false
    });
    this.props.resetPreview();
  }

  openMetaModal() {
    this.setState({
      metaModalOpen: true,
      metaReset: true
    });
  }

  closeMetaModal(save) {
    this.setState({
      metaModalOpen: false
    }, () => {
      if (save) {
        if (!this.state.hasCover) {
          if (this.state.coverUrl) {
            this.props.onDeleteImage(this.state.coverUrl);
          }
          const w = this.getSaveable();
          w.coverUrl = null;
          w.hasCover = false;
          this.save(w);
        } else {
          this.onPost();
        }
      }
    });
  }

  openMonsterModal() {
    this.setState({
      monsterModalOpen: true
    });
  }

  closeMonsterModal() {
    const self = this;
    this.setState({
      monsterModalOpen: false
    }, this.props.monsterReset);
  }

  onGetMonster(newMonster) {
    const newContent = Object.assign([], this.state.content);
    newMonster.displaySize = "normal";
    newContent[newContent.length] = {
      "type": "monster",
      content: newMonster
    };
    this.setState({
      content: newContent,
      scrollToLast: true,
      skipUpdate: false
    }, () => {
      this.onPost();
    });
  }

  makePdf() {
    this.props.makePdf(this.getSaveable());
  }

  componentDidUpdate() {

    const keys = _.chain(this.refs)
      .keys()
      .filter((ff) => {
        return _.startsWith(ff, "section-");
      }).value();

    keys.sort((a, b) => {
      const aNum = parseInt(a.substr(a.indexOf("-") + 1));
      const bNum = parseInt(b.substr(b.indexOf("-") + 1));
      if (aNum < bNum) {
        return -1;
      }
      if (aNum > bNum) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
    const scrollToOptions = {
      offset: -150
    };
    if (this.state.scrollToLast) {
      const lastNode = ReactDOM.findDOMNode(this.refs[keys[keys.length - 1]]);

      ScrollToElement(lastNode, scrollToOptions);

      this.setState({
        scrollToLast: false
      });

    }

    if (this.state.scrollToOpen) {
      this.setState({
        scrollToOpen: false
      });
      const s = "section-" + this.state.openSection;
      const openNode = ReactDOM.findDOMNode(this.refs[s]);
      ScrollToElement(openNode, scrollToOptions);

    }
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

  getSaveable() {
    const willSave = {
      id: this.state.id,
      name: this.state.name,
      content: this.state.content,
      subtitle: this.state.subtitle,
      author: this.state.author,
      hasCover: this.state.hasCover,
      coverUrl: this.state.coverUrl,
      version: this.state.version,
      metadata: this.state.metadata
    };
    return willSave;
  }

  save(w) {
    this.props.onPost(w || this.getSaveable());
  }

  onPost() {
    this.save();
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
    const deleteImage = newProps.deleteImage;

    if (deleteImage.succeeded && deleteImage.payload.k == "cover") {
      this.setState({
        hasCover: false,
        coverUrl: null,
        resetMeta: true
      }, this.props.onDeleteImageReset);
    }

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
      author: module.author,
      hasCover: module.hasCover,
      version: module.version,
      metadata: module.metadata || {},
      coverUrl: module.coverUrl,
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

  removeMarked() {
    if (this.state.marked.length) {
      this.removeSections(this.state.marked);
      this.setState({
        marked: []
      });
    }
  }

  unmarkAll() {
    this.setState({
      marked: []
    });
  }

  toggleSectionMark(k) {
    let marks = Object.assign([], this.state.marked);
    if (this.state.marked.indexOf(k) == -1) {
      marks.push(k);
    } else {
      _.pull(marks, k);
    }
    this.setState({
      marked: marks
    });
  }

  swapSections(k, n) {

    const {content} = this.state;
    const movingItem = content[k];

    this.setState(update(this.state, {
      content: {
        $splice: [
          [k, 1],
          [n, 0, movingItem]
        ]
      }
    }), this.onPost);
  }

  moveSection(k, a) {
    const newContent = Object.assign([], this.state.content);
    [newContent[k], newContent[k + a]] = [newContent[k + a], newContent[k]];
    this.setState({
      content: newContent,
      skipUpdate: false
    }, () => {
      this.onPost(); this.openSection(null);
    });
  }

  moveToTop(k) {
    const newContent = Object.assign([], this.state.content);
    const removed = newContent.splice(k, 1);
    newContent.unshift(removed[0]);
    this.setState({
      content: newContent,
      skipUpdate: false
    }, () => {
      this.onPost(); this.openSection(null);
    });
  }
  moveToBottom(k) {
    const newContent = Object.assign([], this.state.content);
    const removed = newContent.splice(k, 1);
    newContent.push(removed[0]);
    this.setState({
      content: newContent,
      skipUpdate: false
    }, () => {
      this.onPost(); this.openSection(null);
    });
  }

  removeSection(k) {

    const newContent = Object.assign([], this.state.content);
    let filename;
    if (newContent[k].type == "image"
      && newContent[k].content
      && newContent[k].content.filename) {
      filename = newContent[k].content.filename;
    }

    newContent.splice(k, 1);

    this.setState({
      content: newContent,
      scrollToLast: false,
      skipUpdate: false
    }, () => {
      if (filename) {
        this.props.onDeleteImage(filename);
      }
      this.onPost();
      this.openSection(null);
    });
  }

  removeSections(ks) {
    let newContent = Object.assign([], this.state.content);

    for (let i = ks.length - 1; i >= 0; i--) {
      let filename;
      if (newContent[i].type == "image"
        && newContent[i].content
        && newContent[i].content.filename) {
        filename = newContent[i].content.filename;
      }
      if (filename) {
        this.props.onDeleteImage(filename);
      }
      newContent.splice(ks[i], 1);
    }

    this.setState({
      content: newContent,
      scrollToLast: false,
      skipUpdate: false
    }, () => {
      this.onPost();
      this.openSection(null);
    });
  }


  addSection(type) {
    const self = this;
    let newSection = {};
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

      case "subsubsection":
        newSection.type = "subsubsection";
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
            "damageVulnerabilities": null,
            "displaySize": "normal"
          }
        };
        break;

      case "commentbox":
        newSection.type = "commentbox";
        newSection.content = {
          title: "",
          text: "",
          displayFormat: "paper"
        };
        break;

      case "racequote":
        newSection.type = "racequote";
        newSection.content = {
          text: ""
        };
        break;

      case "quote":
        newSection.type = "quote";
        newSection.content = {
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
      skipUpdate: false,
      openSection: newContent.length
    }, () => {
      this.onPost();
    });
  }

  shouldComponentUpdate(newProps, newState) {
    return !!!newState.skipUpdate;
  }

  onFieldChange(name, newValue, skipUpdate = true, forceSave = false) {

    const newState = Object.assign({}, this.state);
    if (Array.isArray(name)) {
      _.set(newState, name, newValue);
    } else {
      newState[name] = newValue;
    }

    if (!forceSave) {
      newState.skipUpdate = skipUpdate;
      this.lazyUpdate(newState);
    } else {
      newState.skipUpdate = false;

      this.setState(newState, () => {
        this.onPost();
      });
    }
    this.props.changed();
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
                  onFieldChange={ (name, value) => {
                                    const nnn = {};
                                    nnn[name] = value;
                                    this.setState(nnn);
                                  } } />
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

    if (!this.props.module || !this.state) {
      return <div></div>;
    }
    const self = this;
    let displayMessage;
    let pdfLink;
    let pdfClass = "fa fa-file-pdf-o fa-fw";
    let editor;
    const {message, succeeded, failed, working} = this.props.post;

    if (this.state && this.state.succeeded) {
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

    if (this.state && this.state.failed) {
      displayMessage = <Label bsStyle="danger">
                         { message }
                       </Label>;

    }

    if (this.props.getPdf.failed) {
      displayMessage = <Label bsStyle="danger">
                         { this.props.getPdf.message }
                       </Label>;
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

    const deleteMarkedPopover = <Popover id="confirm-delete" rootClose={ true } title="Confirm Delete">
                                  <p>
                                    Are you sure you want to delete all marked items? This cannot be undone.
                                  </p>
                                  <Button onClick={ this.removeMarked }
                                    block
                                    bsSize="small"
                                    bsStyle="danger">
                                    Delete Marked
                                  </Button>
                                </Popover>;


    const {content} = this.props;
    const sections = [];
    const outline = [];


    if (this.state.content) {
      _.forEach(this.state.content, (s, key) => {
        let sec;
        const outlineItem = {
          id: key
        };
        const st = (
        <SectionToolbar keyName={ key }
          last={ this.state.content.length - 1 }
          moveToTop={ this.moveToTop }
          moveToBottom={ this.moveToBottom }
          moveSection={ this.moveSection }
          removeSection={ this.removeSection }
          marked={ this.state.marked.indexOf(key) != -1 }
          toggleSectionMark={ this.toggleSectionMark } />
        );
        const commonProps = {
          refName: ref,
          ref: "section-" + key,
          key: key,
          k: key,
          onFieldChange: self.onFieldChange,
          toolbar: st,
          content: s,
          open: this.state.openSection == key,
          onOpenSection: this.openSection.bind(this, key),
          onCloseSection: this.openSection.bind(this, null)
        };

        const ref = 'section-' + key;
        switch (s.type) {
          case "pagebreak":
            sec = <MakeBreak {...commonProps} breakType="page" />;
            outlineItem.text = <OutlineCard iconClass="icon icon-page-break" text="Page Break" />;
            break;
          case "columnbreak":
            sec = <MakeBreak {...commonProps} />;
            outlineItem.text = <OutlineCard iconClass="icon icon-column-break" text="Column Break" />;
            break;
          case "table":
            sec = <MakeTable {...commonProps} />;
            outlineItem.text = <OutlineCard iconClass="fa fa-table fa-fw" text="Table" />;
            break;
          case "image":
            sec = <MakeImage {...commonProps}
                    onUploadImage={ self.props.onUploadImage }
                    uploadImage={ this.props.uploadImage }
                    uploadReset={ this.props.uploadReset }
                    uploadProgress={ this.props.uploadProgress }
                    moduleId={ this.state.id } />;
            outlineItem.text = <OutlineCard iconClass="fa fa-picture-o fa-fw" text="Image" />;
            break;
          case "section":
            sec = <MakeSection {...commonProps} />;
            outlineItem.text = <OutlineCard iconClass="fa fa-header fa-fw" text={ _.trunc(s.content.title) } />;
            break;
          case "subsection":
            sec = <MakeSection {...commonProps} sub={ 2 } />;
            outlineItem.text = <OutlineCard iconClass="fa fa-header fa-fw" text={ _.trunc(s.content.title) } />;

            break;
          case "subsubsection":
            sec = <MakeSection {...commonProps} sub={ 3 } />;
            outlineItem.text = <OutlineCard iconClass="fa fa-header fa-fw" text={ _.trunc(s.content.title) } />;
            break;
          case "quote":
            sec = <MakeText {...commonProps} quoteType="quote" />;
            outlineItem.text = <OutlineCard iconClass="fa fa-comment fa-fw" text={ _.trunc(s.content.text) } />;

            break;
          case "racequote":
            sec = <MakeText {...commonProps} quoteType="racequote" />;
            outlineItem.text = <OutlineCard iconClass="fa fa-quote-left fa-fw" text={ _.trunc(s.content.text) } />;
            break;
          case "text":
            sec = <MakeText {...commonProps} />;
            outlineItem.text = <OutlineCard iconClass="fa fa-paragraph fa-fw" text={ _.trunc(s.content.text) } />;
            break;
          case "commentbox":
            sec = <MakeCommentBox {...commonProps} />;
            outlineItem.text = <OutlineCard iconClass="fa fa-list-alt fa-fw" text={ _.trunc(s.content.title) } />;
            break;
          case "monster":
            sec = <MakeMonster {...commonProps} />;
            outlineItem.text = <OutlineCard iconClass="icon icon-goblin" text={ _.trunc(s.content.name) } />;
            break;
        }
        sections.push(sec);
        if (!outlineItem.text) {
          outlineItem.text = "- empty -";
        }
        outline.push(outlineItem);
      });


      editor = (<div className="ContentEditor">
                  { sections }
                </div>);
    }

    const monsterTitle = <i title="Insert Stat Block" className="icon icon-goblin"></i>;
    const sectionTitle = <i title="Insert Heading" className="fa fa-header fa-fw"></i>;
    const markedTitle = <i title="Marked Operations" className="fa fa-check fa-fw"></i>;

    const meta = {
      author: this.state.author,
      hasCover: this.state.hasCover,
      version: this.state.version,
      coverUrl: this.state.coverUrl,
      metadata: this.state.metadata
    };

    let markedMenu;


    if (this.state.marked.length) {
      markedMenu = (
        <NavDropdown eventKey={ 7 } title={ markedTitle } id="nav-dropdown">
          <OverlayTrigger rootClose={ true }
            trigger="click"
            placement="left"
            overlay={ deleteMarkedPopover }>
            <MenuItem title="Delete">
            <i className="fa fa-trash-o fa-fw"></i> Delete Marked
            </MenuItem>
          </OverlayTrigger>
          <MenuItem onClick={ this.unmarkAll }> Unmark All
          </MenuItem>
        </NavDropdown>);

    }





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
                    <NavItem onClick={ self.openPreviewModal } title="Preview PDF">
                      <i className="fa fa-binoculars"></i>
                    </NavItem>
                    <NavDropdown eventKey={ 2 } title={ sectionTitle } id="nav-dropdown">
                      <MenuItem onClick={ self.addSection.bind(this, "section") } title="Insert Section Heading"> H1
                      </MenuItem>
                      <MenuItem onClick={ self.addSection.bind(this, "subsection") } title="Insert Subsection Heading"> H2
                      </MenuItem>
                      <MenuItem onClick={ self.addSection.bind(this, "subsubsection") } title="Insert Subsubsection Heading"> H3
                      </MenuItem>
                    </NavDropdown>
                    <NavItem onClick={ self.addSection } title="Insert Text">
                      <i className="fa fa-paragraph fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "racequote") } title="Insert Quote">
                      <i className="fa fa-quote-left fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ self.addSection.bind(this, "quote") } title="Insert Read Aloud Text">
                      <i className="fa fa-comment fa-fw"></i>
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
                    <NavDropdown eventKey={ 4 } title={ monsterTitle } id="nav-dropdown">
                      <MenuItem onClick={ self.addSection.bind(this, "monster") } eventKey="4.1"> Empty Stat Block
                      </MenuItem>
                      <MenuItem onClick={ this.openMonsterModal } eventKey="4.2"> 5e Monster
                      </MenuItem>
                    </NavDropdown>
                    <NavItem onClick={ self.addSection.bind(this, "image") } title="Insert Image">
                      <i className="fa fa-picture-o fa-fw"></i>
                    </NavItem>
                    <NavItem onClick={ this.openMetaModal } title="Edit Metadata">
                      <i className="fa fa-book fa-fw"></i>
                    </NavItem>
                    { markedMenu }
                  </Nav>
                  <Nav pullRight>
                    { displayMessage }
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <PdfPreview pdfUrl={ this.props.previewUrl } modalOpen={ this.state.previewModalOpen } onHide={ this.closePreviewModal } />
              <MonstersContainer onGetMonster={ this.onGetMonster } show={ this.state.monsterModalOpen } onHide={ this.closeMonsterModal } />
              <MetadataModal onFieldChange={ this.onFieldChange }
                setState={ (ns) => {
                           
                             this.setState(ns);
                           } }
                meta={ meta }
                onMetaResetDone={ this.resetMetaDone }
                metaReset={ this.state.metaReset }
                show={ this.state.metaModalOpen }
                onHide={ this.closeMetaModal }
                onUploadImage={ self.props.onUploadImage }
                deleteImage={ this.props.deleteImage }
                deleteImageReset={ this.props.deleteImageReset }
                uploadImage={ this.props.uploadImage }
                uploadReset={ this.props.uploadReset }
                uploadProgress={ this.props.uploadProgress }
                moduleId={ this.state.id } />
              <Sidebar cards={ outline }
                clickOn={ this.openSection }
                onMoveSection={ this.swapSections }
                onOpen={ this.openSidebar.bind(this, true) }
                onClose={ this.openSidebar.bind(this, false) }
                open={ this.state.openSidebar } />
              { heading }
              { subtitleHeading }
              { editor }
              { pdfLink }
            </div>);
  }
}
