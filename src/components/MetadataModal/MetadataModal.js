import './MetadataModal.less';
import React, { Component, PropTypes } from 'react';
import { Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';

export default class MetadataModal extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
  }

  onSubmit() {
    this.props.onSubmit({
      name: this.refs.name.getValue()
    });
  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  }

  render() {

    let displayMessage;

    const {message, succeeded, failed, working} = this.props;
    
    if(succeeded){
        displayMessage = <Alert bsStyle="success">{message}</Alert>
    }

    if(failed){
        displayMessage = <Alert bsStyle="danger">{message}</Alert>
    }
      
    return (<div className="MetadataModal">
        <Grid>
            <Row>
            <Col md={6} mdOffset={3}>
            <h2>MetadataModal</h2>

            {displayMessage}

            <Input type="text" 
            ref="name" 
            label="Name"
            onKeyUp={this.onKeyUp} 
            placeholder="Enter name" />
            <Button onClick={this.onSubmit} bsStyle="primary" bsSize="large">Submit</Button>

            </Col>
            </Row>
        </Grid>
        </div>);
  }
}

MetadataModal.propTypes = {
    message: PropTypes.string,
    succeeded: PropTypes.bool,
    failed: PropTypes.bool,
    working: PropTypes.bool,
    onSubmit: PropTypes.func
}
