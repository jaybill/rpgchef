import './MakeBreak.less';
import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';
import log from 'loglevel';
export default class MakeBreak extends Component {

  constructor() {
    super();
  }

  render() {

    const k = this.props.k;
    const ref = this.props.refName;
    let breakType;
    if (this.props.breakType == "page") {
      breakType = "Page";
    } else {
      breakType = "Column";
    }

    return (<section onClick={ this.props.onOpenSection }
              key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { this.props.toolbar }
              <div className="content-break">
                <span/>
                <Label bsStyle="default">
                  { breakType + " Break" }
                </Label>
                <span/>
              </div>
            </section>);
  }
}
