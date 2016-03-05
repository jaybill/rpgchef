import './Monsters.less';
import React, { Component, PropTypes } from 'react';
import { Modal, Input, ListGroupItem, ListGroup } from 'react-bootstrap';
import _ from 'lodash';
export default class Monsters extends Component {

  constructor() {
    super();
    this.loadMonsters = this.loadMonsters.bind(this);
    this.lazyLoadMonsters = _.throttle(this.loadMonsters, 200);
    this.lazyLoadMonsters = this.lazyLoadMonsters.bind(this);
  }

  loadMonsters() {
    this.props.loadMonsters(this.refs.name.getValue());
  }

  loadMonster(id) {
    this.props.loadMonster(id);
  }

  render() {

    let monsterList;

    if (this.props.monsters && this.props.monsters.length) {
      const monsterItems = [];
      let culledList;
      let more;
      if (this.props.monsters.length < 10) {
        culledList = this.props.monsters;
      } else {
        culledList = this.props.monsters.slice(0, 8);
        more = this.props.monsters.length - culledList.length;
      }

      culledList.forEach((m, i) => {
        monsterItems.push(
          <ListGroupItem onClick={ this.loadMonster.bind(this, m.id) } key={ i }>
            { m.name }
          </ListGroupItem>);
      });
      if (more) {
        monsterItems.push(<ListGroupItem key={ 999 }>
                            <em>{ "...and " + more + " more. (Try narrowing your search.)" }</em>
                          </ListGroupItem>);
      }
      monsterList = (
        <ListGroup>
          { monsterItems }
        </ListGroup>);

    }

    return (
      <Modal className="Monsters" show={ this.props.show } onHide={ this.props.onHide }>
        <Modal.Header closeButton>
          <Modal.Title>
            <Input type="text"
              ref="name"
              label="Enter Monster Name"
              onChange={ this.lazyLoadMonsters }
              placeholder="i.e. Hook Horror" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="monster-list">
            { monsterList }
          </div>
        </Modal.Body>
      </Modal>


      );
  }
}
