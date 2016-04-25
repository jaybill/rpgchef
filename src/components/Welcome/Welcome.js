'use strict';
import './Welcome.less';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Image, Carousel, Button, Jumbotron, Grid, Col, Row } from 'react-bootstrap';
import SimplePage from '../SimplePage';
import _ from 'lodash';
export default class Welcome extends Component {

  render() {

    const slideContent = [
      {
        title: "Create 5e Content",
        caption: "Quickly create 5e modules, supplements,  sourcebooks, new races, archetypes or totally original content. ",
        imageUrl: "/slides/slide1.png"
      },
      {
        title: "Monster Up",
        caption: "Includes all monsters from the 5e SRD. Insert, modify or make new monsters from scratch.",

        imageUrl: "/slides/slide2.png"
      },
      {
        title: "DM Guild Ready",
        caption: "PDFs you create meet all technical requirements for DM Guild submission. Include the logo and legal copy with one click.",
        imageUrl: "/slides/slide3.png"
      }
    ];

    const slides = [];
    _.forEach(slideContent, (s, i) => {
      slides.push(
        <Carousel.Item key={ i } interval={ 7000 }>
          <div className="slide">
            <div className="hidden-sm hidden-xs slide-text">
              <div>
                <h2>{ s.title }</h2>
                <p>
                  { s.caption }
                </p>
              </div>
            </div>
            <div className="slide-image">
              <img width="360" height="400" src={ s.imageUrl } />
            </div>
          </div>
        </Carousel.Item>

      );
    });

    return (
      <div className="Welcome">
        <Jumbotron>
          <SimplePage>
            <div className="visible-xs-block visible-sm-block">
              <h2>RPG Chef helps you create content for tabletop role-playing games, especially 5e.</h2>
              <Button block
                href="/register"
                bsSize="large"
                bsStyle="primary">
                Register Now
              </Button>
              <Image src="/slides/slide2.png" responsive/>
            </div>
            <Carousel className="hidden-sm hidden-xs fade-carousel">
              { slides }
            </Carousel>
          </SimplePage>
        </Jumbotron>
        <div className="container purpose hidden-sm hidden-xs fade-carousel">
          <h3>RPG Chef helps you create content for tabletop role-playing games, especially 5e.</h3>
          <Button href="/register" bsSize="large" bsStyle="primary">
            Register Now
          </Button>
        </div>
      </div>

      );
  }

}

