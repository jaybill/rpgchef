import './Sidebar.less';
import React, { Component, PropTypes } from 'react';
import { Nav } from 'react-bootstrap';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from '../Card';


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

    if (this.props.open) {

      const ccc = cards.map((card, i) => {
        return (
          <Card key={ card.id }
            index={ i }
            id={ card.id }
            text={ card.text }
            moveCard={ this.moveCard } />
          );
      });

      wtr = <div className="Sidebar open">
              <div onClick={ this.props.onClose } className="button">
                <i className="fa fa-chevron-left fa-fw"></i>
              </div>
              <h4>Outline</h4>
              <div className="outline">
                { ccc }
              </div>
            </div>;

    } else {
      wtr = (<div className="Sidebar closed">
               <div onClick={ this.props.onOpen } className="button">
                 <i className="fa fa-chevron-right fa-fw"></i>
               </div>
             </div>);
    }



    return wtr;
  }
}
