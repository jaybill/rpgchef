import './Weapons.less';
import React, { Component, PropTypes } from 'react';
import { Panel, Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import _ from 'lodash';
import WeaponCard from '../WeaponCard';
import log from 'loglevel';
import GWeaponCardCtrls from '../GWeaponCardCtrls';

export default class Weapons extends Component {

  constructor() {
    super();
    this.loadWeapons = this.loadWeapons.bind(this);
  }

  loadWeapons() {
    this.props.loadWeapons(this.refs.effectCount.getValue(), this.refs.weaponCount.getValue());
  }


  render() {

    let displayMessage;
    const allWeapons = [];

    const {message, succeeded, failed, working, randomWeapons} = this.props;

    if (failed) {
      displayMessage = <Alert bsStyle="danger">
                         { message }
                       </Alert>
    }

    let i = 0;
    _.forIn(randomWeapons, (weapon) => {

      const saveFunc = (ww) => {
        this.props.saveWeapon(ww);
      };

      const saveable = {
        weaponId: weapon.id,
        name: weapon.name,
        priceInCp: weapon.priceInCp,
        magicProps: weapon.magicProps
      };
      const control = <GWeaponCardCtrls working={ working } saveFunc={ saveFunc } weapon={ saveable } />;
      allWeapons.push(<WeaponCard weapon={ weapon } controls={ control } key={ i++ } />);

    });

    return (<div className="Weapons">
              <h2>Weapons</h2>
              <Panel bsStyle="primary">
                <Grid>
                  <Row>
                    <Col md={ 3 }>
                      <Input ref="weaponCount" labelClassName="col-md-4" wrapperClassName="col-md-8" label="Weapons" type="select">
                      <option value={ 1 }>1</option>
                      <option value={ 3 }>3</option>
                      <option value={ 5 }>5</option>
                      <option value={ 10 }>10</option>
                      </Input>
                    </Col>
                    <Col md={ 3 }>
                      <Input ref="effectCount" labelClassName="col-md-4" wrapperClassName="col-md-8" label="Effects" type="select">
                      <option value={ 1 }>One</option>
                      <option value={ 2 }>Two</option>
                      </Input>
                    </Col>
                    <Col md={ 2 }>
                      <Button disabled={ working } block bsStyle="primary" onClick={ this.loadWeapons }>Generate</Button>
                    </Col>
                  </Row>
                </Grid>
              </Panel>
              { allWeapons }
            </div>);
  }
}

Weapons.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  payload: PropTypes.array
}
