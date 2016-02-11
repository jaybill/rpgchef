import './ContentEditor.less';
import React, { Component, PropTypes } from 'react';
import { Popover, OverlayTrigger, ButtonGroup, ButtonToolbar, Panel, Input, Button, Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';
import CtrldInputText from '../ControlledField';
import ConfirmDelete from '../ConfirmDelete';
import TableEditor from '../TableEditor';
import { getPosition } from '../../frontend/domutils';

import DnD5e from '../../lib/dnd5e';

export default class ContentEditor extends Component {

  constructor() {
    super();
    this.makeSection = this.makeSection.bind(this);
    this.makeText = this.makeText.bind(this);
    this.makeToolBar = this.makeToolBar.bind(this);
    this.makeCommentbox = this.makeCommentbox.bind(this);
    this.makeTable = this.makeTable.bind(this);
    this.makePageBreak = this.makePageBreak.bind(this);
    this.makeColumnBreak = this.makeColumnBreak.bind(this);
    this.getKeyName = this.getKeyName.bind(this);
    this.state = {
      sections: []
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleStatChange = this.handleStatChange.bind(this);
    this.dd = new DnD5e();
    this.corestats = [
      'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'
    ];
    this.addTrait = this.addTrait.bind(this);
    this.makeTraitList = this.makeTraitList.bind(this);
    this.removeTrait = this.removeTrait.bind(this);
    this.moveTrait = this.moveTrait.bind(this);
    this.makeUpdateRefresh = this.makeUpdateRefresh.bind(this);
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
  makeToolBar(k) {

    return <ButtonToolbar>
             <ButtonGroup className="pull-right">
               <Button title="Move to top"
                 onClick={ this.props.moveToTop.bind(this, k) }
                 disabled={ k == 0 }
                 bsSize="xs">
                 <i className="icon icon-top"></i>
               </Button>
               <Button title="Move to bottom"
                 onClick={ this.props.moveToBottom.bind(this, k) }
                 disabled={ k == this.props.content.length - 1 }
                 bsSize="xs">
                 <i className="icon icon-bottom"></i>
               </Button>
               <Button title="Move up"
                 onClick={ this.props.moveSection.bind(this, k, -1) }
                 disabled={ k == 0 }
                 bsSize="xs">
                 <i className="fa fa-arrow-up fa-fw"></i>
               </Button>
               <Button title="Move down"
                 onClick={ this.props.moveSection.bind(this, k, 1) }
                 disabled={ k == this.props.content.length - 1 }
                 bsSize="xs">
                 <i className="fa fa-arrow-down fa-fw"></i>
               </Button>
             </ButtonGroup>
             <ConfirmDelete className="pull-right" onConfirm={ this.props.removeSection.bind(this, k) } bsSize="xs" />
           </ButtonToolbar>;
  }


  makeTable(h, k, ref) {

    return (<section key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { this.makeToolBar(k) }
              <TableEditor name={ ["content", k, "content", "data"] } onFieldChange={ this.props.onFieldChange } data={ h.content.data } />
            </section>);
  }

  makePageBreak(k, ref) {

    return (<section key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { this.makeToolBar(k) }
              <Panel>
                <p>
                  Page Break
                </p>
                <hr/>
              </Panel>
            </section>);
  }

  makeColumnBreak(k, ref) {

    return (<section key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { this.makeToolBar(k) }
              <Panel>
                <p>
                  Column Break
                </p>
                <hr/>
              </Panel>
            </section>);
  }


  makeSection(h, k, sub, ref) {

    let icon = "fa fa-header fa-fw";
    let hint = "Section Header";
    if (sub) {
      icon = "fa fa-h-square fa-fw";
      hint = "Subsection Header";
    }

    return <section key={ k }
             ref={ ref }
             className={ ref }
             id={ k }>
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
  showOrder(a) {
    const aa = [];

    _.forEach(a, (aaa, i) => {
      aa.push(aaa.content.title, i);
    });
    return aa;
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
                   <CtrldInputText type="textarea"
                     className="form-control"
                     value={ c.content.text }
                     name={ ["content", k, "content", "text"] }
                     rows={ 6 }
                     onFieldChange={ this.props.onFieldChange } />
                 </div>
               </div>
             </Panel>
           </section>;
  }

  getKeyName(nameArray) {
    return nameArray.join("___");
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

  handleStatChange(name, value) {
    value = parseInt(value);
    let nnn;
    const self = this;
    if (Array.isArray(name)) {
      name.push("modifier");
      nnn = self.getKeyName(name);
    }
    const ns = {};
    ns[nnn] = this.dd.calcModifier(value);

    this.setState(ns);
    name.pop();
    this.props.onFieldChange(name, value);
  }

  addTrait(c, k, type = "traits") {
    const newTraits = Object.assign([], c.content[type] || []);
    const name = ["content", k, "content", type];
    newTraits.push({
      name: "",
      content: ""
    });
    this.props.onFieldChange(name, newTraits, false);
  }

  removeTrait(c, k, t, type = "traits") {
    const newTraits = Object.assign([], c.content[type] || []);
    const name = ["content", k, "content", type];
    newTraits.splice(t, 1);
    this.props.onFieldChange(name, newTraits, false);
  }

  moveTrait(c, k, t, a, type = "traits") {
    const newTraits = Object.assign([], c.content[type] || []);
    const name = ["content", k, "content", type];
    [newTraits[t], newTraits[t + a]] = [newTraits[t + a], newTraits[t]];
    this.props.onFieldChange(name, newTraits, false);
  }

  makeTraitList(c, k, type = "traits", title) {
    const traits = [];
    const self = this;
    _.forEach(c.content[type], (action, i) => {

      traits.push(<div className="monster-trait" key={ i }>
                    <Row>
                      <Col md={ 8 }>
                        <div className="form-group ">
                          <div className="input-group">
                            <span title="Size" className="input-group-addon">Name</span>
                            <CtrldInputText type="text"
                              className="form-control"
                              value={ c.content[type][i].name }
                              name={ ["content", k, "content", type, i, "name"] }
                              onFieldChange={ self.props.onFieldChange } />
                          </div>
                        </div>
                      </Col>
                      <Col md={ 4 }>
                        <ButtonToolbar>
                          <ButtonGroup className="pull-right">
                            <Button disabled={ i == 0 } onClick={ self.moveTrait.bind(this, c, k, i, -1, type) } bsSize="xs">
                              <i className="fa fa-arrow-up fa-fw"></i>
                            </Button>
                            <Button disabled={ i == c.content[type].length - 1 }
                              onClick={ self.moveTrait.bind(this, c, k, i, 1, type) }
                              bsSize="xs"
                              bsSize="xs">
                              <i className="fa fa-arrow-down fa-fw"></i>
                            </Button>
                          </ButtonGroup>
                          <ConfirmDelete className="pull-right" onConfirm={ self.removeTrait.bind(this, c, k, i, type) } bsSize="xs" />
                        </ButtonToolbar>
                      </Col>
                    </Row>
                    <CtrldInputText type="textarea"
                      className="form-control"
                      rows={ 2 }
                      value={ c.content[type][i].content }
                      name={ ["content", k, "content", type, i, "content"] }
                      onFieldChange={ self.props.onFieldChange } />
                    <hr/>
                  </div>
      );

    });
    if (!title) {
      title = _.capitalize(type);
    }
    return <div>
             <Button className="pull-right"
               bsSize="xs"
               onClick={ self.addTrait.bind(this, c, k, type) }
               bsStyle="primary">
               Add
             </Button>
             <h4>{ title }</h4>
             { traits }
           </div>;
  }

  makeUpdateRefresh(name, value) {
    if (!isNaN(parseInt(value))) {
      value = parseInt(value);
    }
    this.props.onFieldChange(name, value, false);
  }

  makeMonster(c, k, ref) {
    const self = this;

    const aaa = this.dd.getAlignments();
    const alignments = [];
    let i = 0;
    _.forEach(aaa, (a) => {
      alignments.push(<option value={ a } key={ i++ }>
                        { a }
                      </option>);
    });

    const sss = this.dd.getSizes();
    const sizes = [];
    let j = 0;

    _.forEach(sss, (s) => {
      sizes.push(<option value={ s } key={ i++ }>
                   { s }
                 </option>);
    });

    const statblocks = [];
    let jj = 0;
    _.forEach(this.corestats, cs => {

      statblocks.push(
        <Col key={ jj++ } md={ 2 }>
          <div className="form-group">
            <div className="input-group">
              <span className="input-group-addon input-sm">{ cs }</span>
              <CtrldInputText type="number"
                className="form-control input-sm"
                value={ c.content[cs] }
                name={ ["content", k, "content", cs] }
                onFieldChange={ self.handleStatChange } />
              <span className="input-group-addon input-sm">{ self.state[self.getKeyName(["content", k, "content", cs, "modifier"])] || this.dd.calcModifier(c.content[cs]) }</span>
            </div>
          </div>
        </Col>);
    });

    const traits = this.makeTraitList(c, k, "traits");
    const actions = this.makeTraitList(c, k, "actions");

    let legendaryActions;

    if (c.content.legendaryPoints > 0) {
      const llist = this.makeTraitList(c, k, "legendaryActions", "Legendary Actions");
      legendaryActions = (<Row>
                            <Col md={ 6 }>
                              { llist }
                            </Col>
                          </Row>);
    }

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
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Challenge</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'1/4'"
                           className="form-control"
                           value={ c.content.challenge }
                           name={ ["content", k, "content", "challenge"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">XP</span>
                         <CtrldInputText type="number"
                           placeholder="i.e.'100'"
                           className="form-control"
                           value={ c.content.xp }
                           name={ ["content", k, "content", "xp"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Legendary Actions</span>
                         <CtrldInputText type="number"
                           placeholder="i.e.'3'"
                           className="form-control"
                           value={ c.content.legendaryPoints }
                           name={ ["content", k, "content", "legendaryPoints"] }
                           onFieldChange={ this.makeUpdateRefresh } />
                       </div>
                     </div>
                   </Col>
                 </Row>
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
                     <Input value={ this.state[this.getKeyName(["content", k, "content", "alignment"])] || c.content.alignment }
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
                 <Row>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Damage Immunities</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'fire, frost'"
                           className="form-control"
                           value={ c.content.damageImmunities }
                           name={ ["content", k, "content", "damageImmunities"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Condition Immunities</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'poisoned'"
                           className="form-control"
                           value={ c.content.conditionImmunities }
                           name={ ["content", k, "content", "conditionImmunities"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Saving Throws</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'Con +6, Int +8'"
                           className="form-control"
                           value={ c.content.savingThrows }
                           name={ ["content", k, "content", "savingThrows"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                 </Row>
                 <Row>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Damage Vulnerabilities</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'fire, frost'"
                           className="form-control"
                           value={ c.content.damageVulnerabilities }
                           name={ ["content", k, "content", "damageVulnerabilities"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Damage Immunities</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'acid, lightning'"
                           className="form-control"
                           value={ c.content.damageImmunities }
                           name={ ["content", k, "content", "damageImmunities"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Damage Resistance</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'acid, lightning'"
                           className="form-control"
                           value={ c.content.damageResistances }
                           name={ ["content", k, "content", "damageResistances"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                 </Row>
                 <Row>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Senses</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'darkvision 120 ft'"
                           className="form-control"
                           value={ c.content.senses }
                           name={ ["content", k, "content", "senses"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Languages</span>
                         <CtrldInputText type="text"
                           placeholder="i.e. 'common, goblin, infernal'"
                           className="form-control"
                           value={ c.content.languages }
                           name={ ["content", k, "content", "languages"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                   <Col md={ 4 }>
                     <div className="form-group ">
                       <div className="input-group">
                         <span title="Size" className="input-group-addon">Skills</span>
                         <CtrldInputText type="text"
                           placeholder="i.e.'History +1, Perception +4'"
                           className="form-control"
                           value={ c.content.skills }
                           name={ ["content", k, "content", "skills"] }
                           onFieldChange={ this.props.onFieldChange } />
                       </div>
                     </div>
                   </Col>
                 </Row>
                 <hr/>
                 <Row>
                   <Col md={ 6 }>
                     { traits }
                   </Col>
                   <Col md={ 6 }>
                     { actions }
                   </Col>
                 </Row>
                 { legendaryActions }
               </div>
             </Panel>
           </section>;
  }

  makeText(t, k, ref) {
    return <section key={ k } ref={ ref } className={ ref }>
             { this.makeToolBar(k) }
             <CtrldInputText type="textarea"
               className="form-control"
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
          case "pagebreak":
            sections.push(self.makePageBreak(key, ref));
            break;
          case "columnbreak":
            sections.push(self.makeColumnBreak(key, ref));
            break;

          case "table":
            sections.push(self.makeTable(s, key, ref));
            break;
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