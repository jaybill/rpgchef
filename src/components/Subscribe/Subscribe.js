import './Subscribe.less';
import React, { Component, PropTypes } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Well, Tooltip, Label, Input, Button, Grid, Row, Col, Alert, Panel } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';
import Loading from '../Loading';
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
      copy: "You only use our site occasionally, just want to try it out, or can't afford to pay us.  You rarely create content for others."
    }, {
      plan: "Evoker",
      cost: "$1.99 per month",
      copy: "You use our site mainly to prepare for gaming sessions, i.e. you mostly use it print monster stat blocks.",
      style: "info"
    }, {
      plan: "Conjurer",
      cost: "$4.99 per month",
      copy: "You use our site to create content that you distribute to others for free or \"Pay what you want\" pricing.",
      style: "success"
    }, {
      plan: "Wizard",
      cost: "$9.99 per month",
      copy: "You use our site frequently or you create content that you intend to sell at a fixed price.",
      style: "primary"
    }];

    const panels = [];
    let i = 0;
    _.forEach(levels, (level) => {
      const header = <div>
                       <strong>{ level.plan }</strong>
                       <div className="pull-right">
                         <strong>{ level.cost }</strong>
                       </div>
                     </div>;
      panels.push(<Col key={ i++ } md={ 3 }>
                  <Panel bsStyle={ level.style } header={ header }>
                    { level.copy }
                  </Panel>
                  </Col>
      );

    });

    if (this.props.subscribeGet.working || this.props.subscribePost.working) {
      wtr = <Loading/>;
    } else {


      if (!this.props.subscribeGet.payload && this.props.subscribeGet.succeeded) {

        const {message, succeeded, failed, working} = this.props.subscribePost;

        if (succeeded) {
          displayMessage = <Alert bsStyle="success">
                             Your payment was accepted. Thanks!
                           </Alert>
        }

        if (failed) {
          displayMessage = <Alert bsStyle="danger">
                             { message }
                           </Alert>
        }


        const cvcLabel = (<span>CVV <a href="https://www.cvvnumber.com/cvv.html" target="new"><i className="fa fa-question-circle"></i></a></span>);
        const subForm = (<Well>
                           <Input ref="plan"
                             type="select"
                             label="Subscription Plan"
                             placeholder="select">
                           <option value="EVOKER">
                             Evoker - $1.99/month
                           </option>
                           <option value="CONJURER">
                             Conjurer - $4.99/month
                           </option>
                           <option value="WIZARD">
                             Wizard - $9.99/month
                           </option>
                           </Input>
                           <Input label="Card Number"
                             placeholder="Card Number"
                             type="text"
                             ref="number" />
                           <Row>
                             <Col md={ 4 }>
                             <Input type="text"
                               placeholder="MM"
                               label="Exp. Month"
                               ref="exp_month" />
                             </Col>
                             <Col md={ 4 }>
                             <Input type="text"
                               placeholder="YYYY"
                               label="Exp. Year"
                               ref="exp_year" />
                             </Col>
                             <Col md={ 4 }>
                             <Input type="text" label={ cvcLabel } ref="cvc" />
                             </Col>
                           </Row>
                           <Button onClick={ this.onSubmit } bsStyle="primary" bsSize="large">
                             Subscribe
                           </Button>
                         </Well>);

        if (!succeeded) {
          wtr = subForm;
        }
      } else {
        const sg = this.props.subscribeGet;

        if (sg.succeeded) {
          const {subscription} = sg.payload;
          const card = sg.payload.customer.sources.data[0];
          wtr = <Well>
                  <dl>
                    <dt>Current plan</dt>
                    <dd>
                      { subscription.plan.name }
                    </dd>
                    <dt>Card</dt>
                    <dd>
                      { card.brand } XXXXXXX-
                      { card.last4 }
                    </dd>
                    <dt>Expires</dt>
                    <dd>
                      { card.exp_month }/
                      { card.exp_year }
                    </dd>
                  </dl>
                  <p>
                    <LinkContainer to="/app/cancel">
                      <Button bsSize="xs" bsStyle="danger">
                        Cancel Subscription
                      </Button>
                    </LinkContainer>
                  </p>
                </Well>
        }
      }
    }
    return (<div className="Subscribe">
              <h2>Subscribe</h2>
              <Grid>
                <Row className="no-gutter">
                  <Col md={ 12 }>
                  <Well>
            <p>
            RPG Chef is 100% supported by subscriptions. We don&apos;t run ads, we don&apos;t have "premium accounts" and we&apos;re not financed by venture capital. Buying a subscription helps us pay our operating costs and lets us build new and awesome features. Help us do what we love so we can continue to help you do what you love: Make great content!
            </p>
            <p>Subscriptions are priced according to how you use (or plan to use) the site, but are really just guidelines. Pay us what you think we&apos;re worth! You can cancel at any time.</p>
                  </Well>
                  <Row>
                    { panels }
                  </Row>
                  </Col>
                  <Col md={ 6 }>
                  <h2>Payment Details</h2>
                  { displayMessage }
                  { wtr }
                  </Col>
                </Row>
              </Grid>
            </div>);
  }
}
