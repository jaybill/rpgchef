import './SectionToolbar.less';
import React, { Component, PropTypes } from 'react';
import { ButtonGroup, ButtonToolbar, Panel, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import ConfirmDelete from '../ConfirmDelete';

export default class SectionToolbar extends Component {

  constructor() {
    super();
  }

  render() {
    const k = this.props.keyName;
    const disabled = this.props.disabled;
    const last = this.props.last;

    const mbProps = {
      title: "Mark",
      bsSize: "xs",
      bsStyle: "default",
      onClick: () => {
        this.props.toggleSectionMark(k);
      }
    };

    if (this.props.marked) {
      mbProps.bsStyle = "success";
    }

    let markButton = (
    <Button {...mbProps}>
      <i className="fa fa-check fa-fw"></i>
    </Button>
    );

    return <ButtonToolbar>
             <ButtonGroup className="pull-right">
               <Button title="Move to top"
                 onClick={ this.props.moveToTop.bind(this, k) }
                 disabled={ k == 0 || disabled }
                 bsSize="xs">
                 <i className="icon icon-top"></i>
               </Button>
               <Button title="Move to bottom"
                 onClick={ this.props.moveToBottom.bind(this, k) }
                 disabled={ k == last || disabled }
                 bsSize="xs">
                 <i className="icon icon-bottom"></i>
               </Button>
               <Button title="Move up"
                 onClick={ this.props.moveSection.bind(this, k, -1) }
                 disabled={ k == 0 || disabled }
                 bsSize="xs">
                 <i className="fa fa-arrow-up fa-fw"></i>
               </Button>
               <Button title="Move down"
                 onClick={ this.props.moveSection.bind(this, k, 1) }
                 disabled={ k == last || disabled }
                 bsSize="xs">
                 <i className="fa fa-arrow-down fa-fw"></i>
               </Button>
               { markButton }
             </ButtonGroup>
             <ConfirmDelete disabled={ disabled }
               className="pull-right"
               onConfirm={ this.props.removeSection.bind(this, k) }
               bsSize="xs" />
           </ButtonToolbar>;
  }
}
