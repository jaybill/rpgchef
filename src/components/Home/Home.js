import './Home.less';
import React from 'react';
import log from 'loglevel';
import { RouteHandler } from 'react-router';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Panel, Alert, Button, Jumbotron, Grid, Col, Row } from 'react-bootstrap';


export var componentDef = {

  componentWillMount() {
  },

  render() {

    const buttons = [{
      l: "/app/modules",
      t: "Create and edit modules",
      i: "fa fa-edit"
    }, {
      l: "https://rpgchef.wiki.zoho.com",
      t: "Learn and get help",
      i: "fa fa-question-circle"
    }, {
      l: "https://rpgchef.wiki.zoho.com/Resources.html",
      t: "Resources",
      i: "fa fa-cubes"
    }].map((jj, i) => {
      return (<LinkContainer to={ jj.l }>
                <Button className={ "btn-xlarge b-" + (i + 1) }>
                  <span><i className={ jj.i }></i> { jj.t }</span>
                </Button>
              </LinkContainer>
        );
    });

    return (
      <div className="Home">
        <Row>
          <Col md={ 6 }>
          <div className="visible-xs-block hidden-sm mobile">
            { buttons }
          </div>
          <div className="visible-sm-block visible-md-block visible-sm-block visible-lg-block hidden-xs">
            { buttons }
          </div>
          <Alert bsStyle="info">
            Have you found a bug? Want to request a feature? <strong><a href="https://rpgchef.lighthouseapp.com/projects/132376-rpg-chef/tickets" target="new">Open a ticket!</a></strong>
          </Alert>
          </Col>
          <Col md={ 6 }>
          <Panel bsStyle="primary">
            <h2>Changelog</h2>
            <h3>v 0.9.39</h3>
            <ul>
              <li>
                Updated copy, removed beta button
              </li>
              <li>
                Added additional image display options
              </li>
              <li>
                Added progress bar to image uploader
              </li>
              <li>
                Fixed bug where failed image upload does not throw error
              </li>
              <li>
                Fixed tooltips
              </li>
              <li>
                Updated sidebar position/animation
              </li>
              <li>
                cleaned up sidebar, added tooltip
              </li>
              <li>
                Got outline reordering implemented, got sidebar visuals cleaned up a bit
              </li>
              <li>
                Got basic outline ordering working
              </li>
              <li>
                Got sidebar working
              </li>
              <li>
                Added unmark all
              </li>
              <li>
                Added ability to mark/delete multiple sections
              </li>
              <li>
                Fixed issue where PDF won't render if image isn't loaded
              </li>
              <li>
                Made 'racequote' feature that allows attribution and formats the text correctly
              </li>
              <li>
                Made monster boxes expand and collapse more reasonably
              </li>
              <li>
                Removed second damage immunity block, moved format selection
              </li>
              <li>
                Fixed typos
              </li>
              <li>
                Added mobile styles to front page
              </li>
            </ul>
          </Panel>
          </Col>
        </Row>
      </div>
      );
  }

}
export default React.createClass(componentDef);
