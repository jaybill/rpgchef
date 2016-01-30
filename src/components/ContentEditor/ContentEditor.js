import './ContentEditor.less';
import React, { Component, PropTypes } from 'react';
import { Popover, OverlayTrigger, ButtonGroup, ButtonToolbar, Panel, Input, Button, Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';
import { CtrldInputText, CtrldTextarea } from '../ControlledField';
import { getPosition } from '../../frontend/domutils';

import DnD5e from '../../lib/dnd5e';

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
    this.handleSelect = this.handleSelect.bind(this);
    this.makeCoreStat = this.makeCoreStat.bind(this);
  }

  componentWillReceiveProps(newProps) {
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
      document.body.scrollTop = o.y;
    }
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
               <Button onClick={ this.props.moveSection.bind(this, k, 1) } disabled={ k == this.props.content.length - 1 } bsSize="xs">
                 <i className="fa fa-arrow-down fa-fw"></i>
               </Button>
             </ButtonGroup>
           </ButtonToolbar>;
  }

  makeSection(h, k, sub, ref) {

    let icon = "fa fa-header fa-fw";
    let hint = "Section Header";
    if (sub) {
      icon = "fa fa-h-square fa-fw";
      hint = "Subsection Header";
    }

    return <section key={ k } ref={ ref } className={ ref }>
             { this.makeToolBar(k) }
             <div className="input-group">
               <span title={ hint } className="input-group-addon"><i className={ icon }></i></span>
               <CtrldInputText type="text"
                 className="form-control input-lg"
                 value={ h.content.title }
                 name={ ["content", k, "content", "title"] }
                 onFieldChange={ this.props.onFieldChange } />
             </div>
           </section>;
  }

  makeCommentbox(c, k, ref) {
    return <section key={ k } ref={ ref } className={ ref }>
             { this.makeToolBar(k) }
             <Panel>
               <div className="form">
                 <div className="form-group">
                   <div className="input-group">
                     <span title="Text Box" className="input-group-addon"><i className="fa fa-list-alt fa-fw"></i></span>
                     <CtrldInputText type="text"
                       placeholder="Text Box title. (Optional)"
                       className="form-control"
                       value={ c.content.title }
                       name={ ["content", k, "content", "title"] }
                       onFieldChange={ this.props.onFieldChange } />
                   </div>
                 </div>
                 <div className="form-group">
                   <CtrldTextarea className="form-control"
                     value={ c.content.text }
                     name={ ["content", k, "content", "text"] }
                     rows={ 6 }
                     onFieldChange={ this.props.onFieldChange } />
                 </div>
               </div>
             </Panel>
           </section>;
  }

  handleSelect(name, e) {
    this.props.onFieldChange(name, e.target.value);
  }

  makeCoreStat(k, s, n) {

    return (<Col md={ 2 }>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon input-sm">STR</span>
                  <CtrldInputText type="text"
                    className="form-control input-sm"
                    value={ n }
                    name={ ["content", k, "content", s] }
                    onFieldChange={ this.props.onFieldChange } />
                  <span className="input-group-addon input-sm">+0</span>
                </div>
              </div>
            </Col>);
  }

  makeMonster(c, k, ref) {
    const self = this;
    const dd = new DnD5e();
    const aaa = dd.getAlignments();
    const alignments = [];
    let i = 0;
    _.forEach(aaa, (a) => {
      alignments.push(<option value={ a } key={ i++ }>
                        { a }
                      </option>);
    });

    const sss = dd.getSizes();
    const sizes = [];
    let j = 0;

    _.forEach(sss, (s) => {
      sizes.push(<option value={ s } key={ i++ }>
                   { s }
                 </option>);
    });

    const corestats = [
      'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'
    ];

    const statblocks = [];
    let jj = 0;
    _.forEach(corestats, cs => {
      const modifier = dd.calcModifier(c.content[cs] || 10);
      statblocks.push(
        <Col key={ jj++ } md={ 2 }>
          <div className="form-group">
            <div className="input-group">
              <span className="input-group-addon input-sm">{ cs }</span>
              <CtrldInputText type="text"
                className="form-control input-sm"
                value={ c.content[cs] }
                name={ ["content", k, "content", cs] }
                onFieldChange={ self.props.onFieldChange } />
              <span className="input-group-addon input-sm">{ modifier }</span>
            </div>
          </div>
        </Col>);
    });


    return <section key={ k } ref={ ref } className={ ref }>
             { this.makeToolBar(k) }
             <Panel>
               <div className="form">
                 <div className="form-group">
                   <div className="input-group">
                     <span title="Monster" className="input-group-addon"><i className="icon icon-goblin"></i></span>
                     <CtrldInputText type="text"
                       placeholder="i.e.'Goblin'"
                       className="form-control"
                       value={ c.content.name }
                       name={ ["content", k, "content", "name"] }
                       onFieldChange={ this.props.onFieldChange } />
                   </div>
                 </div>
                 <Row>
                   <Col md={ 4 }>
                     <Input value={ c.content.size }
                       onChange={ this.handleSelect.bind(this, ["content", k, "content", "size"]) }
                       addonBefore="Size"
                       type="select">
                     { sizes }
                     </Input>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Race/Type</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'Humanoid'"
                           className="form-control"
                           value={ c.content.raceOrType }
                           name={ ["content", k, "content", "raceOrType"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <Input value={ c.content.alignment }
                       onChange={ this.handleSelect.bind(this, ["content", k, "content", "alignment"]) }
                       addonBefore="Alignment"
                       type="select">
                     { alignments }
                     </Input>
                   </Col>
                 </Row>
                 <Row>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Armor Class</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'12'"
                           className="form-control"
                           value={ c.content.armorclass }
                           name={ ["content", k, "content", "armorclass"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Hit Points</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'16 (3d8+3)'"
                           className="form-control"
                           value={ c.content.hitpoints }
                           name={ ["content", k, "content", "hitpoints"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Speed</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'50 ft'"
                           className="form-control"
                           value={ c.content.speed }
                           name={ ["content", k, "content", "speed"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                 </Row>
                 <Row>
                   { statblocks }
                 </Row>
               </div>
             </Panel>
           </section>;
  }

  makeText(t, k, ref) {
    return <section key={ k } ref={ ref } className={ ref }>
             { this.makeToolBar(k) }
             <CtrldTextarea className="form-control"
               value={ t.content.text }
               name={ ["content", k, "content", "text"] }
               rows={ 6 }
               onFieldChange={ this.props.onFieldChange } />
           </section>;
  }


  render() {
    const {content} = this.props;
    const self = this;
    const sections = [];
    if (content) {

      _.forEach(content, (s, key) => {
        const ref = 'section-' + key;
        switch (s.type) {
          case "section":
            sections.push(self.makeSection(s, key, false, ref));
            break;
          case "subsection":
            sections.push(self.makeSection(s, key, true, ref));
            break;
          case "text":
            sections.push(self.makeText(s, key, ref));
            break;
          case "commentbox":
            sections.push(self.makeCommentbox(s, key, ref));
            break;
          case "monster":
            sections.push(self.makeMonster(s, key, ref));
            break;
        }

      });
    }

    return (<div className="ContentEditor">
              { sections }
            </div>);
  }
}
