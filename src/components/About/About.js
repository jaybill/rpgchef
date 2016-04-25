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
            As of this writing, RPG Chef is very focused on content creation for (Oh boy...how do we say this without getting in trouble?) the fifth edition of the world's most
            popular <a target="_new" href="http://dnd.wizards.com">role-playing game</a>. (There, that ought to do it. Whew!) While you certainly could use RPG Chef
            to create content for other systems, things like stat blocks are very 5e specific. That said, we are planning to add direct support for other systems if there
            is enough interest.
          </p>
          <h3>Technology</h3>
          <p>
            RPG Chef is built using <a href="https://facebook.github.io/react/">React</a> and <a href="http://redux.js.org">Redux</a>. We employ a microservice architecture
            that uses <a href="http://hapijs.com/">hapi.js</a> and <a href="http://www.postgresql.org">PostgreSQL</a>. We render content with <a href="https://www.latex-project.org">LaTeX</a>.
          </p>
          <h3>Data Safety</h3>
          <p>
            You very likely put a lot of work into your content. If you're like us, you've often spent days, sometimes <em>weeks</em> working on stuff. We're committed
            to keeping your work safe, secure and available. To this end, we do all of the following, and lots of other stuff:
          </p>
          <ul>
            <li>
              Nightly database backups
            </li>
            <li>
              Cloud-based, load balanced servers
            </li>
            <li>
              Site access if via HTTPS exclusively
            </li>
          </ul>
          <h3>Acknowledgments</h3>
          <p>
            We use a modified version of the most excellent <a href="https://github.com/evanbergeron/DND-5e-LaTeX-Template">DnD 5 LaTeX Template</a>, which was, in part,
            the inspiration for this project.
          </p>
          <p>
            Certain print <a href="https://drive.google.com/a/jaybill.com/folderview?id=0B2UyuHLUuCjxRkJYUzBlYkpzSVU&usp=sharing">fonts</a> by <a href="https://www.reddit.com/u/Solbera">Solbera</a>      licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0">Creative Commons (CC BY-SA 4.0)</a>.
          </p>
          <p>
            Cover art on front page includes <a href="http://ejlowell.deviantart.com/art/The-Werewolf-461806291">The Werewolf</a> by <a href="http://ejlowell.deviantart.com">EjLowell</a>      and <a href="http://darkgift.ru/gallery.html">The Great Battle</a> by <a href="http://darkgift.ru">Julia Alekseeva</a>. Both licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0">Creative Commons (CC BY-SA 4.0)</a>.
          </p>
          <p>
            Background image is <a href="http://fav.me/d6sq6ee">Fantasy Landscape: Mountains</a> by <a href="http://fpesantez.deviantart.com">Felipe Pesantez</a> licensed
            under a <a href="http://creativecommons.org/licenses/by-nd/3.0/">Creative Commons Attribution-No Derivative Works 3.0 License.</a>
          </p>
        </Panel>
        <Label bsStyle="info">
          { "Version: " + (process.env.RPGCHEF_VERSION || "Local") }
        </Label>
      </div>
      );
  }
}
