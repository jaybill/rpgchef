import './MakeText.less';
import React, { Component, PropTypes } from 'react';
import { Panel } from 'react-bootstrap';
import CtrldInputText from '../ControlledField';
export default class MakeText extends Component {

  constructor() {
    super();
  }

  render() {

    const t = this.props.content;
    const ref = this.props.refName;
    const k = this.props.k;
    const quote = this.props.quote;
    let qh;
    if (quote) {
      qh = <h4>Quote</h4>;
    }


    return <section key={ k }
             onClick={ this.props.onOpenSection }
             ref={ ref }
             className={ ref }>
             { this.props.toolbar }
             <Panel className="MakeText">
               { qh }
               <div className="form">
                 <div className="form-group">
                   <CtrldInputText type="textarea"
                     className="form-control"
                     value={ t.content.text }
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
