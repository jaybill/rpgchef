import './ModuleList.less';
import log from 'loglevel';
import { LinkContainer } from 'react-router-bootstrap';
import React, { Component, PropTypes } from 'react';
import { ListGroup, ListGroupItem, Panel, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';

export default class ModuleList extends Component {

  constructor() {
    super();
    this.onPost = this.onPost.bind(this);
  }

  onPost() {
    this.props.onPost({
      name: this.refs.name.getValue()
    });
  }

  render() {

    let modules;
    let displayMessage;

    const {message, succeeded, failed, working, payload} = this.props.list;

    if (failed) {
      displayMessage = <Alert bsStyle="danger">
                         { message }
                       </Alert>;
    }

    if (payload && payload.length > 0) {
      log.debug("payload", payload);
      const mm = [];
      let k = 0;
      for (let m in payload) {
        const mmm = payload[m];
        const l = "/app/module/" + mmm.id;
        mm.push(<LinkContainer key={ k++ } to={ l }>
                  <ListGroupItem>
                    { mmm.name }
                  </ListGroupItem>
                </LinkContainer>);
      }
      modules = <ListGroup>
                  { mm }
                </ListGroup>;
    }

    return (<div className="ModuleList">
              <h2>Modules</h2>
              <Grid>
                <Row className="no-gutter">
                  <Col md={ 6 }>
                    { displayMessage }
                    { modules }
                  </Col>
                </Row>
              </Grid>
            </div>);
  }
}
