import './Sidebar.less';
import React, { Component, PropTypes } from 'react';
import { Nav } from 'react-bootstrap';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from '../Card';
import { Motion, spring } from 'react-motion';

@DragDropContext(HTML5Backend)
export default class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);

    this.state = {
      cards: props.cards
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.cards) {
      this.setState({
        cards: newProps.cards
      });
    }
  }

  moveCard(dragIndex, hoverIndex) {
    const {cards} = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    let wtr;
    const {cards} = this.state;



    const ccc = cards.map((card, i) => {
      return (
        <Card key={ card.id }
          index={ i }
          id={ card.id }
          text={ card.text }
          moveCard={ this.moveCard }
          clickOn={ () => {
                      this.props.clickOn(card.id);
                    } }
          dropCard={ this.props.onMoveSection } />
        );
    });

    const ss = {
      x: spring(this.props.open ? 0 : -260),
      r: spring(this.props.open ? 0 : -180),
      o: spring(this.props.open ? 1 : 0),
      s: spring(this.props.open ? 0.4 : 0)
    };

    wtr = <Motion style={ ss }>
            { ({x, r, o, s}) => <div style={ {  boxShadow: `10px 0px rgba(0, 0, 0, ${s})`,  backgroundColor: `rgba(0,0,0,${o})`,  left: `${x}px`} } className="Sidebar hidden-xs hidden-sm">
                                  <div onClick={ this.props.open ? this.props.onClose : this.props.onOpen } className="button">
                                    <i style={ {  transform: `rotate(${r}deg)`} } className="fa fa-chevron-left fa-fw"></i>
                                  </div>
                                  <div>
                                    <h4>Outline</h4>
                                    <div style={ {  opacity: `${o}`} } title="Click to navigate, drag to reorder." className="outline">
                                      { ccc }
                                    </div>
                                  </div>
                                </div> }
          </Motion>





    return wtr;
  }
}
