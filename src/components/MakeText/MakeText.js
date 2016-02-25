import './MakeText.less';
import React, { Component, PropTypes } from 'react';
import CtrldInputText from '../ControlledField';
export default class MakeText extends Component {

  constructor() {
    super();
  }

  render() {

    const t = this.props.content;
    const ref = this.props.refName;
    const k = this.props.k;
    return <section key={ k } ref={ ref } className={ ref }>
             { this.props.toolbar }
             <CtrldInputText type="textarea"
               className="form-control"
               value={ t.content.text }
               name={ ["content", k, "content", "text"] }
               rows={ 6 }
               onFieldChange={ this.props.onFieldChange } />
           </section>;
  }

}
