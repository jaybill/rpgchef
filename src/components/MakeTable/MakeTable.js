import './MakeTable.less';
import React, { Component, PropTypes } from 'react';
import TableEditor from '../TableEditor';
export default class MakeTable extends Component {

  constructor() {
    super();
  }

  render() {
    const k = this.props.k;
    const ref = this.props.refName;
    const h = this.props.content;

    return (<section key={ k }
              ref={ ref }
              className={ ref }
              id={ k }>
              { this.props.toolbar }
              <TableEditor name={ ["content", k, "content", "data"] } onFieldChange={ this.props.onFieldChange } data={ h.content.data } />
            </section>);
  }
}
