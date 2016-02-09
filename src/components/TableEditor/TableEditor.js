import './TableEditor.less';
import React, { Component, PropTypes } from 'react';
import { Table, Panel, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import CtrldInputText from '../ControlledField';
import ConfirmDelete from '../ConfirmDelete';
import log from 'loglevel';
import _ from 'lodash';

export default class TableEditor extends Component {

  constructor() {
    super();
    this.addColumn = this.addColumn.bind(this);
    this.delColumn = this.delColumn.bind(this);
    this.addRow = this.addRow.bind(this);
    this.delRow = this.delRow.bind(this);
    this.edit = this.edit.bind(this);
    this.done = this.done.bind(this);
    this.change = this.change.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.updateData = this.updateData.bind(this);
    this.state = {
      editCol: null,
      editRow: null
    };
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.done();
    }
  }

  updateData(newData) {
    this.props.onFieldChange(this.props.name, newData);
  }

  change(cell, newCellData) {
    const newData = Object.assign([], this.state.data);
    newData[cell[0]][cell[1]] = newCellData;
    this.setState({
      data: newData
    });
    this.updateData(newData);
  }

  edit(r, c) {
    log.debug("editing ", r, c);
    this.setState({
      editCol: c,
      editRow: r
    });
  }

  done() {
    this.setState({
      editCol: null,
      editRow: null
    });
  }


  addRow() {

    const newData = Object.assign([], this.state.data);
    const newRow = [];
    for (let i = 0; i < this.state.data[0].length; i++) {
      newRow.push("");
    }
    newData.push(newRow);
    this.setState({
      data: newData
    });
    this.updateData(newData);
  }


  addColumn() {
    const newData = [];
    const oldData = this.state.data;
    if (!oldData.length) {
      newData.push([""]);
    } else {
      _.forEach(oldData, (r) => {
        r.push("");
        newData.push(r);
      });
    }
    this.setState({
      data: newData
    });
    this.updateData(newData);
  }

  delRow(r) {
    const newData = Object.assign([], this.state.data);
    newData.splice(r, 1);
    this.setState({
      data: newData
    });
    this.updateData(newData);
  }

  delColumn(c) {
    let newData = [];
    const oldData = Object.assign([], this.state.data);
    _.forEach(oldData, (r) => {
      r.splice(c, 1);
      newData.push(r);
    });

    if (!oldData[0].length) {
      newData = [];
    }

    this.setState({
      data: newData
    });
    this.updateData(newData);
  }

  componentWillMount() {
    this.setState({
      data: this.props.data
    });
  }

  render() {
    const self = this;
    if (!this.state.data) {
      return <div/>;
    }

    const rows = [];
    const bodyrows = [];
    log.debug("state", this.state.editRow, this.state.editCol);

    _.forEach(this.state.data, (r, i) => {
      let cells = [];
      _.forEach(r, (c, j) => {
        let cellContent = c || <em>empty</em>;

        if (this.state.editCol == j && this.state.editRow == i) {
          cellContent = (
            <CtrldInputText type="text"
              focusMe={ true }
              className="form-control input-sm"
              value={ c }
              name={ [i, j] }
              onKeyUp={ self.handleKeyUp }
              onBlur={ self.done }
              onFieldChange={ self.change } />
          );
        } else {
          let ddb;
          if (i < 1) {
            ddb = (<span title="Delete column" className="pull-right"><ConfirmDelete onConfirm={ self.delColumn.bind(this, j) } bsSize="xs" /></span>);
          }
          cellContent = (
            <div>
              <span title="Click to edit" onClick={ self.edit.bind(this, i, j) }>{ cellContent }</span>
              { ddb }
            </div>
          );
        }

        const colWidth = Math.floor(11 / r.length) || 1;

        if (i < 1) {
          cells.push(<th className={ "col-sm-" + colWidth } key={ i + "-" + j }>
                       { cellContent }
                     </th>);
        } else {
          cells.push(<td key={ i + "-" + j }>
                       <span onClick={ self.edit.bind(this, i, j) }>{ cellContent }</span>
                     </td>);
        }
      });

      if (i < 1) {
        rows.push(<thead key={ i }>
                    <tr>
                      { cells }
                      <th className="col-sm-1">
                        &nbsp;
                      </th>
                    </tr>
                  </thead>
        );
      } else {
        bodyrows.push(<tr key={ i }>
                        { cells }
                        <td>
                          <span title="Delete Row" className="pull-right"><ConfirmDelete bsSize="xs" onConfirm={ self.delRow.bind(this, i) }/></span>
                        </td>
                      </tr>);
      }

    }

    );
    rows.push(
      <tbody key={ 99 }>
        { bodyrows }
      </tbody>
    );

    return (<div className="TableEditor">
              <ButtonToolbar>
                <ButtonGroup>
                  <Button onClick={ self.addColumn } bsSize="xs">
                    <i className="fa fa-plus-square fa-fw"></i> Add Column
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button bsSize="xs" disabled={ self.state.data.length < 1 } onClick={ self.addRow }>
                    <i className="fa fa-plus-square fa-fw"></i> Add Row
                  </Button>
                </ButtonGroup>
              </ButtonToolbar>
              <Panel>
                <Table bordered striped condensed>
                  { rows }
                </Table>
              </Panel>
            </div>);
  }
}
