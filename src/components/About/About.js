import './About.less';
import React, { Component, PropTypes } from 'react';
import { Label, Panel } from 'react-bootstrap';
import SimplePage from '../SimplePage';

export default class About extends Component {

  render() {

    return (
      <div className="About">
        <h2>About RPG Chef</h2>
        <Panel bsStyle="primary">
          <p>
            At RPG Chef, we love role-playing games. We love playing them, running them and creating them. This project was born of a desire for the authoring tool we always
            wanted. While there are plenty of tools avilable for playing games and running games, we found there to be a severe lack of tools for actually writing them.
            The choices for creating great-looking game content on a small scale were pretty limited. Sure, you could use a word processor, but most of those aren't very
            good for things like stat blocks. Image editing software makes content really hard to edit. You could buy (or..um...borrow?) something like Adobe InDesign,
            but it's expensive and has a pretty steep learning curve.
          </p>
          <p>
            What if you just want to write a module, describe a homebrew character class or even just throw together all the stat blocks for the monsters in this weekend&apos;s
            game? That's why we built RPG Chef.
          </p>
          <h3>A Note About Game Systems</h3>
          <p>
            As of this writing, RPG Chef is very focused around content creation for (Oh boy...how do we say this without getting in trouble?) the fifth edition of the world's
            most popular <a target="_new" href="http://dnd.wizards.com">role-playing game</a>. (There, that ought to do it. Whew!) While you certainly could use
            RPG Chef to create content for other systems, things like stat blocks are very 5e specific. That said, we are planning to add direct support for other systems
            if there is enough interest.
          </p>
        </Panel>
        <Label bsStyle="info">
          { "Version: " + (process.env.RPGCHEF_VERSION || "Local") }
        </Label>
      </div>
      );
  }
}
