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
          <h3>Technology</h3>
          <p>
            RPG Chef is built using <a href="https://facebook.github.io/react/">React</a> and <a href="http://redux.js.org">Redux</a>. We employ a microservice architecture
            that uses <a href="http://hapijs.com/">hapi.js</a> and <a href="http://www.postgresql.org">PostgreSQL</a>. We render content with <a href="https://www.latex-project.org">LaTeX</a>      using the most excellent <a href="https://github.com/evanbergeron/DND-5e-LaTeX-Template">DnD 5 LaTeX Template</a>.
          </p>
          <h3>Acknowledgments</h3>
          <p>
            Certain <a href="http://knald.deviantart.com/art/Vintage-paper-TEXTURE-PACK-152400787">paper textures</a> by <a href="http://knald.deviantart.com/">knald</a>      licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-Noncommercial-Share Alike 3.0 License.</a>.
          </p>
        </Panel>
        <Label bsStyle="info">
          { "Version: " + (process.env.RPGCHEF_VERSION || "Local") }
        </Label>
      </div>
      );
  }
}
