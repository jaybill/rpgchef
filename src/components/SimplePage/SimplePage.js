import './SimplePage.less';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Navbar, NavbarBrand, Nav } from 'react-bootstrap';

export default class SimplePage extends Component {
  render() {
    return (
      <div className="Home">
                <div className="container">
                    <Navbar fixedTop><NavbarBrand><a href="/">RPG Chef</a></NavbarBrand>
                    </Navbar>
                    <div className="SimplePage-Holder">{this.props.children}</div>
                </div>
      </div>
      );
  }
}


