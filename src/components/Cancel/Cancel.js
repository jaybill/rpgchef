import './Cancel.less';
import React, { Component, PropTypes } from 'react';
import { Well, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class Cancel extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);

  }

  onSubmit() {
    this.props.onSubmit();
  }


  render() {

    let wtr;

    const {message, succeeded, failed, working} = this.props;

    if (succeeded) {

      wtr = <div><Alert bsStyle="success">Your subscription has been cancelled.</Alert>
               <p><LinkContainer to="/app/subscribe">
               <Button block bsSize="large" bsStyle="success">Go Back</Button>
               </LinkContainer></p></div>
    }

    if (failed) {
      wtr = <Alert bsStyle="danger">Your subscription could not be cancelled. Please contact us for more information.</Alert>
    }

    if (!failed && !succeeded) {
      wtr = (<div>
               <p>You are about to cancel your subscription.
               Are you sure you want to do this?</p>
               <p><em>Note: This will not delete your account,
               we&apos;ll just stop charging your credit card.</em>
               </p>
               <Row>
               <Col md={6}>
               <LinkContainer to="/app/subscribe">
               <Button block bsSize="large" bsStyle="success">Go Back</Button>
               </LinkContainer>
               </Col>
               <Col md={6}>
               <Button block onClick={this.onSubmit} bsStyle="danger" bsSize="large">
               Cancel Subscription</Button>
               </Col>
               </Row>
               </div>
      );
    }

    return (<div className="Cancel">

            <Grid>
            <Row>
            <Col md={6} mdOffset={3}>
            <h2>Cancel</h2>
            <Well>
            {wtr}
            </Well>
            </Col>
            </Row>
        </Grid>
        </div>);
  }
}

Cancel.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  onSubmit: PropTypes.func
}
