import './Subscribe.less';
import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Tooltip, Label, Input, Button, Grid, Row, Col, Alert, Panel } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';
export default class Subscribe extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {

    this.props.onSubmit(
      {
        number: this.refs.number.getValue(),
        exp_month: this.refs.exp_month.getValue(),
        exp_year: this.refs.exp_year.getValue(),
        cvc: this.refs.cvc.getValue(),
        plan: this.refs.plan.getValue()
      }
    );

  }

  render() {
    const self = this;
    let wtr;
    let displayMessage;
    const levels = [{
      plan: "Novice",
      cost: "Free",
      copy: "You only use our site occasionally, just want to try it out, or can't afford to pay us."
    }, {

      plan: "Evoker",
      cost: "$1.99 per month",
      copy: "You use our site to prep for one play session per month.",
      style: "info"
    }, {
      plan: "Conjurer",
      cost: "$4.99 per month",
      copy: "You use our site to prep for one play session per week.",
      style: "success"
    }, {
      plan: "Wizard",
      cost: "$9.99 per month",
      copy: "You use our site to prep for more than one play session per week, or you plan to sell the content you create.",
      style: "primary"
    }];

    const panels = [];
    let i = 0;
    _.forEach(levels, (level) => {
      const header = <div><strong>{level.plan}</strong>
                <div className="pull-right"><strong>{level.cost}</strong></div>
                </div>;
      panels.push(<Col key={i++} md={3}>
                  <Panel bsStyle={level.style} header={header}>
                  {level.copy}
                      </Panel>
                      </Col>
      );

    });

    if (!this.props.subscribeGet.payload && this.props.subscribeGet.succeeded) {

      const {message, succeeded, failed, working} = this.props.subscribePost;

      if (succeeded) {
        displayMessage = <Alert bsStyle="success">Your payment was accepted. Thanks!</Alert>
      }

      if (failed) {
        displayMessage = <Alert bsStyle="danger">{message}</Alert>
      }


      const cvcLabel = (<span>CVV <a href="https://www.cvvnumber.com/cvv.html" target="new"><i className="fa fa-question-circle"></i></a></span>);
      const subForm = (<div><Input ref="plan" type="select" label="Subscription Plan" placeholder="select">
            <option value="EVOKER">Evoker - $1.99/month</option>
            <option value="CONJURER">Conjurer - $4.99/month</option>
            <option value="WIZARD">Wizard - $9.99/month</option>
            </Input>
            <Input label="Card Number" placeholder="Card Number" type="text" ref="number"/>
            <Row>
            <Col md={4}>
            <Input type="text" placeholder="MM" label="Exp. Month" ref="exp_month"/>
            </Col>
            <Col md={4}>
            <Input type="text" placeholder="YYYY" label="Exp. Year" ref="exp_year"/>
            </Col>
            <Col md={4}>
            <Input type="text" label={cvcLabel} ref="cvc"/>
            </Col>
            </Row>            
            <Button onClick={this.onSubmit} bsStyle="primary" bsSize="large">Subscribe</Button>
                                                                                                                                                                     </div>);

      if (!succeeded) {
        wtr = subForm;
      }
    } else {
      const sg = this.props.subscribeGet;

      if (sg.succeeded) {
        const {subscription} = sg.payload;
        const card = sg.payload.customer.sources.data[0];
        wtr = <div>
              <dl>
              <dt>Current plan</dt>
              <dd>{subscription.plan.name}</dd>
              <dt>Card</dt>
              <dd>{card.brand} XXXXXXX-{card.last4}</dd>
              <dt>Expires</dt>
              <dd>{card.exp_month}/{card.exp_year}</dd>
              </dl>
              <p><LinkContainer to="/app/unsubscribe"><Button bsSize="xs" bsStyle="danger">Cancel Subscription</Button></LinkContainer></p>
              </div>
      }
    }
    return (<div className="Subscribe">
        <Grid>
            <Row>
            <Col md={12}>
            <h2>Subscribe</h2>

            <p>RPG Chef is a "pay what you want" subscription service. We&apos;re not talking about <em>donations</em> here. We do ask that you pay for the service if you actively use it. We just think you should decide how much you pay and that payment should be on the honor system. What we <em>don&apos;t</em> have are "premium accounts" where people who pay us get access to special features and other people don&apos;t. Instead, we&apos;ve created a couple of subscription plans that are loosely based on how much you use our site:</p> 
            <Row>
            {panels}
            </Row>
            </Col>
            <Col md={6}>
            <h2>Payment Details</h2>
            {displayMessage}
            {wtr}
            </Col>
            </Row>
        </Grid>
        </div>);
  }
}
