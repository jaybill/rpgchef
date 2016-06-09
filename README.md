# RPG Chef

RPG Chef is a web application that helps you create content for DnD 5e.

RPG Chef is built using React and Redux. We employ a microservice architecture that uses hapi.js and PostgreSQL. We render content with LaTeX.

It's doubtful that you'd want to take this application "as is" and run it as a public website, though there's nothing preventing you from doing so. (For legal reasons, you'd need to remove any mention of "RPG Chef" or any of the other stuff we have legal stuff around. There's OGL stuff in here you'd need to agree to if you wanted to publish it.) I mainly make this code public so people can see how I did what I did, which is mainly of interest to other developers working on similar applications and people who may wish to hire me and want to see my code.

## You charge for the use of this service at rpgchef.com. Isn't this kind of giving away the store?

Not really. I'll be the first to tell you that writing a nifty web application is only one part of getting a successful startup off the ground. There's a ton of marketing, branding, devOps, customer support and a boatload of other details that need to be worked out. And besides, [Reddit did it](https://github.com/reddit/reddit), and they don't seem to have any problem competing with people that use their code.

Truth be told so much of what I've done with this is depends on open source projects built by other people that it seems kind of selfish not to make my code avaiable.

## Requirements

1. A working postgres server, 9.5 or better.
1. `node` and `npm` (tested with node 4.x, 5 will likely work fine.)
1. `gulp` available in your path  

## Installation

1. Clone the repo with `git clone https://github.com/jaybill/rpgchef.git`
1. Change into the directory where you cloned the repo
1. run `npm install`
1. copy `template.env` to `.env` and edit it to reflect your database settings and various accounts. DO NOT PUT `.env` IN SOURCE CONTROL.
1. run `gulp migrate` to set up the database
1. run `gulp fixture --name monsters` to load the monsters into the database. You can also load `weapons` and `weapongroups` but these aren't currently active in the application.
1. run `gulp` to bring up the app in dev mode. You should be able to see the site on whatever url/port you configured

## Deployment

Deployment is beyond the scope of this short readme, but it uses AWS CodeDeploy. You need the aws commad line tool installed and configured, and you'll need to create a directory called `tempnode` and copy (or preferably, create a symlink to) the `package.json` in the root directory. You can then go into that directory and run `npm install --production` and this will install only the production dependencies and not the dev dependencies. You can look at the `deploy` task in `gulpfile.js` to see what it does.

If you don't want to use CodeDeploy, you can tweak the gulpfile to build a dist version and then move that to your web server however you'd like.

# Contributing

I'm not expecting that I'll be deluged with contributions on this thing, but if you're so moved, by all means submit a pull request. If you find a bug, feel free to report an issue.

# Bugs  
  
If you are a user of the RPG Chef website and need help with that, as in the one at https://rpgchef.com - DO NOT submit an issue here, instead use our regular [issue tracker](https://rpgchef.lighthouseapp.com/projects/132376-rpg-chef/tickets).