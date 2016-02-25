import './ContentEditor.less';
import React, { Component, PropTypes } from 'react';
import { Well, Popover, OverlayTrigger, ButtonGroup, ButtonToolbar, Panel, Input, Button, Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';
import CtrldInputText from '../ControlledField';
import ConfirmDelete from '../ConfirmDelete';
import MakeMonster from '../MakeMonster';
import MakeText from '../MakeText';
import MakeSection from '../MakeSection';
import MakeCommentBox from '../MakeCommentBox';
import MakeBreak from '../MakeBreak';
import MakeTable from '../MakeTable';
import MakeImage from '../MakeImage';
import DropZone from 'react-dropzone';
import { getPosition } from '../../frontend/domutils';
import SectionToolbar from '../SectionToolbar';

import DnD5e from '../../lib/dnd5e';

export default class ContentEditor extends Component {

  constructor() {
    super();
    this.makeToolBar = this.makeToolBar.bind(this);


    this.state = {
      sections: [],
      uploadingImage: null
    };
    this.onDrop = this.onDrop.bind(this);
  }

  // Lifecycle Methods

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

  componentDidUpdate() {
    if (this.props.scrollToLast) {
      const sections = _.filter(_.keys(this.refs), (r) => {
        return _.startsWith(r, 'section-');
      });

      const node = this.refs[sections[sections.length - 1]];
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const o = getPosition(node);
      document.documentElement.scrollTop = o.y;
      document.body.scrollTop = o.y - 150;
    }
  }


  makeToolBar(k, disabled) {

    return <ButtonToolbar>
             <ButtonGroup className="pull-right">
               <Button title="Move to top"
                 onClick={ this.props.moveToTop.bind(this, k) }
                 disabled={ k == 0 || disabled }
                 bsSize="xs">
                 <i className="icon icon-top"></i>
               </Button>
               <Button title="Move to bottom"
                 onClick={ this.props.moveToBottom.bind(this, k) }
                 disabled={ k == this.props.content.length - 1 || disabled }
                 bsSize="xs">
                 <i className="icon icon-bottom"></i>
               </Button>
               <Button title="Move up"
                 onClick={ this.props.moveSection.bind(this, k, -1) }
                 disabled={ k == 0 || disabled }
                 bsSize="xs">
                 <i className="fa fa-arrow-up fa-fw"></i>
               </Button>
               <Button title="Move down"
                 onClick={ this.props.moveSection.bind(this, k, 1) }
                 disabled={ k == this.props.content.length - 1 || disabled }
                 bsSize="xs">
                 <i className="fa fa-arrow-down fa-fw"></i>
               </Button>
             </ButtonGroup>
             <ConfirmDelete disabled={ disabled }
               className="pull-right"
               onConfirm={ this.props.removeSection.bind(this, k) }
               bsSize="xs" />
           </ButtonToolbar>;
  }

  render() {
    const {content} = this.props;
    const self = this;
    const sections = [];

    if (content) {

      _.forEach(content, (s, key) => {
        let sec;
        const st = (
        <SectionToolbar keyName={ key }
          last={ this.props.content.length - 1 }
          moveToTop={ this.props.moveToTop }
          moveToBottom={ this.props.moveToBottom }
          moveSection={ this.props.moveSection }
          removeSection={ this.props.removeSection } />);

        const ref = 'section-' + key;
        switch (s.type) {
          case "pagebreak":
            sec = <MakeBreak toolbar={ st }
                    breakType="page"
                    refName={ ref }
                    key={ key }
                    k={ key }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "columnbreak":
            sec = <MakeBreak toolbar={ st }
                    refName={ ref }
                    key={ key }
                    k={ key }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "table":
            sec = <MakeTable toolbar={ st }
                    content={ s }
                    refName={ ref }
                    key={ key }
                    k={ key }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "image":
            sec = self.makeImage(s, key, ref);
            break;
          case "section":
            sec = <MakeSection toolbar={ st }
                    content={ s }
                    sub={ false }
                    refName={ ref }
                    key={ key }
                    k={ key }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "subsection":
            sec = <MakeSection toolbar={ st }
                    content={ s }
                    sub={ true }
                    refName={ ref }
                    key={ key }
                    k={ key }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "text":
            sec = <MakeText toolbar={ st }
                    key={ key }
                    k={ key }
                    refName={ ref }
                    content={ s }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "commentbox":
            sec = <MakeCommentBox toolbar={ st }
                    content={ s }
                    sub={ false }
                    refName={ ref }
                    key={ key }
                    k={ key }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
          case "monster":
            sec = <MakeMonster content={ s }
                    toolbar={ st }
                    key={ key }
                    k={ key }
                    refName={ ref }
                    onFieldChange={ self.props.onFieldChange } />;
            break;
        }
        sections.push(sec);
      });
    }

    return (<div className="ContentEditor">
              { sections }
            </div>);
  }
}
