'use strict';

import log from 'loglevel'
import React from 'react'
import { findDOMNode } from 'react-dom';
import _ from 'lodash'

var commonDef = {
  propTypes: {
    onFieldChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired
  },
  getInitalState() {
    return {
      start: 0,
      end: 0
    };
  },
  componentDidUpdate() {
    // Put cursor in the right place after update, but only if we're focused.
    var field = findDOMNode(this.refs.field);
    if (this.state && this.state.start && field == document.activeElement) {
      field.setSelectionRange(this.state.start, this.state.end);
    }

  },
  update(e) {
    this.setState({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    });
    this.props.onFieldChange(this.props.name, e.target.value);
  },
};

var textareaRender = {
  render() {
    return (<textarea disabled={ this.props.disabled } placeholder={ this.props.placeholder } className={ this.props.className } value={ this.props.value } onChange={ this.update }
            onBlur={ this.update } ref="field" rows={ this.props.rows } />);
  }
};

var inputTextRender = {
  render() {
    return (<input disabled={ this.props.disabled } type="text" placeholder={ this.props.placeholder } className={ this.props.className } value={ this.props.value } onChange={ this.update }
            onBlur={ this.update } ref="field" />);
  }
};

var inputPasswordRender = {
  render() {
    return (<input disabled={ this.props.disabled } type="password" placeholder={ this.props.placeholder } className={ this.props.className } value={ this.props.value } onChange={ this.update }
            onBlur={ this.update } ref="field" />);
  }
};

var CtrldTextarea = React.createClass(_.merge(commonDef, textareaRender));
var CtrldInputText = React.createClass(_.merge(commonDef, inputTextRender));
var CtrldInputPassword = React.createClass(_.merge(commonDef, inputPasswordRender));

export { CtrldTextarea, CtrldInputText, CtrldInputPassword };
