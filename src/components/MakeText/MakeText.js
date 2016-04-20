import './MakeText.less';
import React, { Component, PropTypes } from 'react';
import { Col, Row, Panel } from 'react-bootstrap';
import CtrldInputText from '../ControlledField';
export default class MakeText extends Component {

  constructor() {
    super();
  }

  render() {
    const t = this.props.content;
    const ref = this.props.refName;
    const k = this.props.k;
    const quoteType = this.props.quoteType;
    let qh;
    let attrib;
    let mds;
    switch (quoteType) {
      case "racequote":
        qh = <h4><i className="fa fa-quote-left fa-fw"></i> Quote</h4>;
        attrib = (
          <Row>
            <Col md={ 6 }>
            <div className="form-group ">
              <div className="input-group">
                <span title="Size" className="input-group-addon">Attribution</span>
                <CtrldInputText type="text"
                  placeholder="i.e. 'Selldar Hallwanter'"
                  className="form-control"
                  value={ t.content.attributeTo }
                  name={ ["content", k, "content", "attributeTo"] }
                  onFieldChange={ this.props.onFieldChange } />
              </div>
            </div>
            </Col>
          </Row>);
        mds = (
          <span title="Very basic Markdown support" className="pull-right help-block"><strong>**bold**</strong> <em>_italics_</em> ~~<s>strikeout</s>~~ (On attribution only.)</span>);
        break;
      case "quote":
        qh = <h4><i className="fa fa-comment fa-fw"></i> Read Aloud</h4>;
        mds = (<span title="Very basic Markdown support." className="pull-right help-block"><strong>**bold**</strong> <em>_italics_</em> ~~<s>strikeout</s>~~ * bullet list</span>);

        break;
      default:
        qh = <h4><i className="fa fa-paragraph fa-fw"></i> Plain Text</h4>;
        mds = (<span title="Very basic Markdown support." className="pull-right help-block"><strong>**bold**</strong> <em>_italics_</em> ~~<s>strikeout</s>~~ * bullet list</span>);
        break;
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
                 </div>
                 { mds }
               </div>
               { attrib }
             </Panel>
           </section>;
  }

}
