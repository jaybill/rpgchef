import './ContentEditor.less';
import React, { Component, PropTypes } from 'react';
import { Popover, OverlayTrigger, ButtonGroup, ButtonToolbar, Panel, Input, Button, Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';
import { CtrldInputText, CtrldTextarea } from '../ControlledField';
export default class ContentEditor extends Component {

  constructor() {
    super();
    this.makeSection = this.makeSection.bind(this);
    this.makeText = this.makeText.bind(this);
    this.makeToolBar = this.makeToolBar.bind(this);
    this.makeCommentbox = this.makeCommentbox.bind(this);
    this.state = {
      sections: []
    };
  }

  makeToolBar(k) {

    const deletePopover = <Popover id="confirm-delete" rootClose={ true } title="Confirm Delete">
                            <p>
                              Are you sure?
                            </p>
                            <Button onClick={ this.props.removeSection.bind(this, k) }
                              block
                              bsSize="small"
                              bsStyle="danger">
                              Delete
                            </Button>
                          </Popover>;

    return <ButtonToolbar>
             <ButtonGroup className="pull-right">
               <OverlayTrigger rootClose={ true }
                 trigger="click"
                 placement="left"
                 overlay={ deletePopover }>
                 <Button bsSize="xs">
                   <i className="fa fa-trash-o fa-fw"></i>
                 </Button>
               </OverlayTrigger>
               <Button onClick={ this.props.moveSection.bind(this, k, -1) } disabled={ k == 0 } bsSize="xs">
                 <i className="fa fa-arrow-up fa-fw"></i>
               </Button>
               <Button onClick={ this.props.moveSection.bind(this, k, 1) } disabled={ k == this.props.content.sections.length - 1 } bsSize="xs">
                 <i className="fa fa-arrow-down fa-fw"></i>
               </Button>
             </ButtonGroup>
           </ButtonToolbar>;
  }

  makeSection(h, k, sub) {

    let icon = "fa fa-header fa-fw";
    if (sub) {
      icon = "fa fa-h-square fa-fw";
    }

    return <section key={ k }>
             { this.makeToolBar(k) }
             <div className="input-group">
               <span className="input-group-addon"><i className={ icon }></i></span>
               <CtrldInputText type="text"
                 className="form-control input-lg"
                 value={ h.content.title }
                 name={ ["content", "sections", k, "content", "title"] }
                 onFieldChange={ this.props.onFieldChange } />
             </div>
           </section>;
  }

  makeCommentbox(c, k) {
    return <section key={ k }>
             { this.makeToolBar(k) }
             <Panel>
               <div className="form">
                 <div className="form-group">
                   <div className="input-group">
                     <span className="input-group-addon"><i className="fa fa-list-alt fa-fw"></i></span>
                     <CtrldInputText type="text"
                       className="form-control input-lg"
                       value={ c.content.title }
                       name={ ["content", "sections", k, "content", "title"] }
                       onFieldChange={ this.props.onFieldChange } />
                   </div>
                 </div>
                 <div className="form-group">
                   <CtrldTextarea className="form-control"
                     value={ c.content.text }
                     name={ ["content", "sections", k, "content", "text"] }
                     rows={ 6 }
                     onFieldChange={ this.props.onFieldChange } />
                 </div>
               </div>
             </Panel>
           </section>;
  }

  makeText(t, k) {
    return <section key={ k }>
             { this.makeToolBar(k) }
             <CtrldTextarea className="form-control"
               value={ t.content.text }
               name={ ["content", "sections", k, "content", "text"] }
               rows={ 6 }
               onFieldChange={ this.props.onFieldChange } />
           </section>;
  }


  render() {
    const {content} = this.props;
    const self = this;
    const sections = [];
    if (content && content.sections) {

      _.forEach(content.sections, (s, key) => {

        switch (s.type) {
          case "section":
            sections.push(self.makeSection(s, key));
            break;
          case "subsection":
            sections.push(self.makeSection(s, key, true));
            break;
          case "text":
            sections.push(self.makeText(s, key));
            break;
          case "commentbox":
            sections.push(self.makeCommentbox(s, key));
            break;
        }

      });
    }

    return (<div className="ContentEditor">
              { sections }
            </div>);
  }
}
