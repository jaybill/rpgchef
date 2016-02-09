'use strict';
import log from 'loglevel';
import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import _ from 'lodash';

export default class CtrldInputText extends Component {

  constructor() {
    super();
    this.state = {
      value: null
    };
    this.update = this.update.bind(this);
  }

  componentWillMount() {
    this.setState({
      value: this.props.value
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.value
    });
  }

  componentDidMount() {
    if (this.props.focusMe) {
      var field = findDOMNode(this.refs.field);
      field.focus();
      if (field.setSelectionRange) {
        field.setSelectionRange(field.value.length, field.value.length);
      }
    }
  }

  update(e) {
    this.setState({
      value: e.target.value
    });
    this.props.onFieldChange(this.props.name, e.target.value);
  }
  render() {
    const self = this;
    let wtr;
    switch (this.props.type) {
      case "textarea":
        wtr = (<textarea disabled={ this.props.disabled }
                 placeholder={ this.props.placeholder }
                 className={ this.props.className }
                 value={ this.state.value }
                 onChange={ this.update }
                 onBlur={ (e) => {
                            self.update(e);
                            if (self.props.onBlur) {
                              self.props.onBlur();
                            }
                          } }
                 ref="field"
                 rows={ this.props.rows } />);
        break;
      case "select":
        wtr = (<select disabled={ this.props.disabled }
                 placeholder={ this.props.placeholder }
                 className={ this.props.className }
                 value={ this.state.value }
                 onChange={ this.update }
                 onBlur={ (e) => {
                            self.update(e);
                            if (self.props.onBlur) {
                              self.props.onBlur();
                            }
                          } }
                 ref="field">
                 { this.props.children }
               </select>);
        break;
      default:
        wtr = (<input disabled={ this.props.disabled }
                 type={ this.props.type || "text" }
                 placeholder={ this.props.placeholder }
                 className={ this.props.className }
                 value={ this.state.value }
                 onChange={ this.update }
                 onBlur={ (e) => {
                            self.update(e);
                            if (self.props.onBlur) {
                              self.props.onBlur();
                            }
                          } }
                 onKeyUp={ this.props.onKeyUp }
                 ref="field" />);
        break;
    }
    return wtr;
  }
}

CtrldInputText.propTypes = {
  onFieldChange: React.PropTypes.func.isRequired,
  name: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]).isRequired
};

export { CtrldInputText };

