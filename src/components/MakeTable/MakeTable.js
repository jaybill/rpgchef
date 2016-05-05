import './MakeTable.less';
import React, { Component, PropTypes } from 'react';
import TableEditor from '../TableEditor';
import { Input, Panel } from 'react-bootstrap';
import CtrldInputText from '../ControlledField';
export default class MakeTable extends Component {

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
    const h = this.props.content;

    const displayFormatSelect = (
    <Input value={ h.content.displayFormat }
      bsSize="small"
      onChange={ this.handleSelect.bind(this, ["content", k, "content", "displayFormat"]) }
      addonBefore="Display"
      type="select">
    <option value="normal">
      Normal
    </option>
    <option value="large">
      Full Page
    </option>
    </Input>);
    let titleField;
    let noteField;
    if (h.content.displayFormat == "large") {
      titleField = (
        <div className="form-group">
          <div className="input-group input-group-sm">
            <span title="Text Box" className="input-group-addon">Title</span>
            <CtrldInputText type="text"
              placeholder="i.e. 'Weapons'"
              className="form-control"
              value={ h.content.title }
              name={ ["content", k, "content", "title"] }
              onFieldChange={ this.props.onFieldChange } />
          </div>
        </div>);

      noteField = (
        <div className="form-group">
          <label>
            Notes
          </label>
          <CtrldInputText type="textarea"
            placeholder="(Will be displayed below table on same page.)"
            className="form-control"
            value={ h.content.notes }
            name={ ["content", k, "content", "notes"] }
            rows={ 6 }
            onFieldChange={ this.props.onFieldChange } />
          <span title="Very basic Markdown support." className="pull-right help-block"><strong>**bold**</strong> <em>_italics_</em> ~~<s>strikeout</s>~~ * bullet list</span>
        </div>
      );
    }



    let wtr;

    if (this.props.open) {
      wtr = (<section key={ k }
               ref={ ref }
               className={ ref }
               id={ k }>
               { this.props.toolbar }
               <TableEditor onCloseSection={ this.props.onCloseSection }
                 displayFormatSelect={ displayFormatSelect }
                 noteField={ noteField }
                 titleField={ titleField }
                 name={ ["content", k, "content", "data"] }
                 onFieldChange={ this.props.onFieldChange }
                 data={ h.content.data } />
             </section>);
    } else {

      wtr = (<section key={ k }
               onClick={ this.props.onOpenSection }
               ref={ ref }
               className={ ref }
               id={ k }>
               { this.props.toolbar }
               <Panel>
                 <h4><i className="fa fa-table fa-fw"></i> Table</h4>
               </Panel>
             </section>);
    }
    return wtr;
  }
}

