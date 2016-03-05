import React, { Component } from 'react';
import { connect } from 'react-redux';
import { monsters as doMonsters, monster as doMonster, monsterReset } from '../actions/monsters';
import Monsters from '../../components/Monsters';

class MonstersContainer extends Component {

  constructor() {
    super();
    this.loadMonsters = this.loadMonsters.bind(this);
    this.loadMonster = this.loadMonster.bind(this);
  }

  loadMonsters(startswith) {

    const {dispatch} = this.props;
    if (this.props.show) {
      if (startswith && startswith.length > 0) {
        dispatch(doMonsters(startswith));
      }
    }
  }

  loadMonster(id) {
    const {dispatch} = this.props;
    dispatch(doMonster(id));
  }

  componentWillReceiveProps(newProps) {
    const {monsters, monster} = newProps;
    if (monster && monster.succeeded && newProps.show) {
      this.props.onGetMonster(monster.payload);
      this.props.onHide();
    }
  }

  render() {
    const self = this;
    const {monsters, monster} = this.props;

    let monsterlist = [];
    if (monsters && monsters.succeeded) {
      monsterlist = monsters.payload;
    }

    return (
      <Monsters show={ this.props.show }
        onHide={ this.props.onHide }
        monsters={ monsterlist }
        loadMonster={ self.loadMonster }
        loadMonsters={ self.loadMonsters } />);
  }
}

function select(state) {

  return {
    monsters: state.app.monsters.monsters,
    monster: state.app.monsters.monster
  };
}

export default connect(select)(MonstersContainer);
