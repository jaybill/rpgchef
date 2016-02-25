import './MakeBreak.less';
import React, { Component, PropTypes } from 'react';
import { Panel, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';

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

    return (<section key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { this.props.toolbar }
              <Panel>
                <p>
                  { breakType }
                </p>
                <hr/>
              </Panel>
            </section>);
  }
}
