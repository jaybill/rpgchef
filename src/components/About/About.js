import './About.less';
import React, { Component, PropTypes } from 'react';
import { Panel } from 'react-bootstrap';
import SimplePage from '../SimplePage'

export default class About extends Component {

  render() {

    return (

      <div className="About">
        <h2>About RPG Chef</h2>
        <Panel bsStyle="primary">
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere tellus. Proin quam nisl, tincidunt et, mattis eget,
            convallis nec, purus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla posuere. Donec vitae dolor. Nullam tristique
            diam non turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam vestibulum accumsan nisl.
          </p>
          <p>
            Proin quam nisl, tincidunt et, mattis eget, convallis nec, purus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla posuere.
            Donec vitae dolor. Nullam tristique diam non turpis. Cras placerat accumsan nulla. Nullam rutrum. Nam vestibulum accumsan nisl. Lorem ipsum dolor sit amet,
            consectetuer adipiscing elit. Donec hendrerit tempor tellus. Donec pretium posuere tellus.
          </p>
        </Panel>
      </div>
      );
  }
}
