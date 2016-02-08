import './ConfirmDelete.less';
import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

export default class ConfirmDelete extends Component {

  constructor() {
    super();
    this.onConfirm = this.onConfirm.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.state = {
      open: false
    };
  }

  onOpen() {
    this.setState({
      open: true
    });
  }

  onClose() {
    this.setState({
      open: false
    });
  }

  onConfirm() {
    this.setState({
      open: false
    });
    this.props.onConfirm();
  }

  render() {
    const wtr = [];
    const self = this;
    if (this.state.open) {
      wtr.push(
        <Button key={ 1 }
          title="Really delete?"
          onClick={ self.onConfirm }
          bsStyle="danger"
          bsSize={ self.props.bsSize }>
          <i className="fa fa-trash-o fa-fw"></i>
        </Button>
      );
      wtr.push(
        <Button key={ 2 }
          title="Cancel"
          bsStyle="success"
          onClick={ self.onClose }
          bsSize={ self.props.bsSize }>
          <i className="fa fa-ban fa-fw"></i>
        </Button>
      );
    } else {
      wtr.push(<Button key={ 1 } onClick={ self.onOpen } bsSize={ self.props.bsSize }>
                 <i className="fa fa-trash-o fa-fw"></i>
               </Button>);
    }

    return <ButtonGroup className={ this.props.className }>
             { wtr }
           </ButtonGroup>;
  }
}
