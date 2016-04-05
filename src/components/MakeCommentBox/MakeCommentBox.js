import './MakeCommentBox.less';
import React, { Component, PropTypes } from 'react';
import { Input, Panel, Row, Col } from 'react-bootstrap';
import CtrldInputText from '../ControlledField';

export default class MakeCommentBox extends Component {

  constructor() {
    super();
    this.handleSelect = this.handleSelect.bind(this);
    this.getKeyName = this.getKeyName.bind(this);
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


  render() {
    const k = this.props.k;
    const ref = this.props.refName;
    const c = this.props.content;
    return <section key={ k }
             onClick={ this.props.onOpenSection }
             ref={ ref }
             className={ ref }>
             { this.props.toolbar }
             <Panel className="MakeCommentBox">
               <div className="form">
                 <Row>
                   <Col md={ 9 }>
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
                   </Col>
                   <Col md={ 3 }>
                   <Input value={ c.content.displayFormat }
                     onChange={ this.handleSelect.bind(this, ["content", k, "content", "displayFormat"]) }
                     addonBefore="Display Format"
                     type="select">
                   <option value="paper">
                     Paper
                   </option>
                   <option value="comment">
                     Block
                   </option>
                   </Input>
                   </Col>
                 </Row>
                 <div className="form-group">
                   <CtrldInputText type="textarea"
                     className="form-control"
                     value={ c.content.text }
                     name={ ["content", k, "content", "text"] }
                     rows={ 6 }
                     onFieldChange={ this.props.onFieldChange } />
                   <span title="Very basic Markdown support." className="pull-right help-block"><strong>**bold**</strong> <em>_italics_</em> ~~<s>strikeout</s>~~ * bullet list</span>
                 </div>
               </div>
             </Panel>
           </section>;
  }
}
