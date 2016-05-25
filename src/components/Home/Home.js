import './Home.less';
import React from 'react';
import log from 'loglevel';
import { RouteHandler } from 'react-router';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Panel, Alert, Button, Jumbotron, Grid, Col, Row } from 'react-bootstrap';
import changelog from '../../lib/changelog';

export var componentDef = {

  componentWillMount() {
  },

  render() {

    const ccl = changelog.map((cl, i) => {
      return (<div key={ i }>
                <h4>{ cl.tag }</h4>
                <ul>
                  { cl.revisions.map((rr, j) => {
                      return (<li key={ j }>
                                { rr }
                              </li>);
                    }) }
                </ul>
              </div>
        );
    });

    const buttons = [{
      l: "https://rpgchef.wiki.zoho.com",
      t: "Learn and get help",
      i: "fa fa-question-circle"
    }, {
      l: "https://rpgchef.wiki.zoho.com/Resources.html",
      t: "Resources",
      i: "fa fa-cubes"
    }].map((jj, i) => {
      return (
        <Button target="_new"
          href={ jj.l }
          key={ i }
          className={ "btn-xlarge b-" + (i + 2) }>
          <span><i className={ jj.i }></i> { jj.t }</span>
        </Button>
        );
    });

    const buttonOne = <LinkContainer to="/app/modules">
                        <Button className={ "btn-xlarge b-1" }>
                          <span><i className="fa fa-edit"></i> Create and edit modules</span>
                        </Button>
                      </LinkContainer>;

    return (
      <div className="Home">
        <Row>
          <Col md={ 6 }>
          <div className="visible-xs-block hidden-sm mobile">
            { buttonOne }
            { buttons }
          </div>
          <div className="visible-sm-block visible-md-block visible-sm-block visible-lg-block hidden-xs">
            { buttonOne }
            { buttons }
          </div>
          <Alert bsStyle="info">
            Have you found a bug? Want to request a feature? <strong><a href="https://rpgchef.lighthouseapp.com/projects/132376-rpg-chef/tickets" target="new">Open a ticket!</a></strong>
          </Alert>
          </Col>
          <Col md={ 6 }>
          <Panel bsStyle="primary">
            <h3>Change Log</h3>
            <div className="changes">
              { ccl }
            </div>
          </Panel>
          </Col>
        </Row>
      </div>
      );
  }

}
export default React.createClass(componentDef);
