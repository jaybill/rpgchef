import './MakeSection.less';
import React, { Component, PropTypes } from 'react';
import CtrldInputText from '../ControlledField';

export default class MakeSection extends Component {

  constructor() {
    super();
  }

  render() {
    const h = this.props.content;
    const k = this.props.k;
    const sub = this.props.sub;
    const ref = this.props.refName;
    let hint;
    let htype;


    switch (sub) {
      case 3:
        hint = "Subsubsection Header";
        htype = "H3";
        break;
      case 2:
        hint = "Subsection Header";
        htype = "H2";
        break;
      default:
        hint = "Section Header";
        htype = "H1";
    }

    return <section key={ k }
             onClick={ this.props.onOpenSection }
             ref={ ref }
             className={ ref }
             id={ k }>
             { this.props.toolbar }
             <div className="input-group">
               <span title={ hint } className="input-group-addon">{ htype }</span>
               <CtrldInputText type="text"
                 className="form-control input-lg"
                 value={ h.content.title }
                 name={ ["content", k, "content", "title"] }
                 onFieldChange={ this.props.onFieldChange } />
             </div>
           </section>;
  }

}

