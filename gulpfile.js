'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));
var jasmine = require('gulp-jasmine-phantom');
var concatFilenames = require('gulp-concat-filenames');
var _ = require('lodash');
var insert = require('gulp-insert');
var log = require('loglevel');
var URI = require('urijs');
var exec = require('child_process').exec;
var gutil = require('gulp-util');
var symlink = require('gulp-sym');
var rimraf = require('gulp-rimraf');
// Settings
var RELEASE = !!argv.release; // Minimize and optimize during a build?
var PROD = !!argv.prod;
var DEPLOY = false;

var AUTOPREFIXER_BROWSERS = [ // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var src = {};
var watch = false;
var browserSync;
var outputDir = 'build';
require('dotenv').config({
  path: (PROD ? "deploy.env" : ".env")
});;

// Check for required environment variables
var required = [
  "SERVER_URL",
  "SERVER_PORT",
  "API_URL",
  "LOG_LEVEL",
  "POSTGRES"
];

var errors = [];

required.forEach(function(element, index, array) {
  if (!process.env[element]) {
    errors.push("ERROR: Environment variable " + element
      + " is required but not set. Please make sure it is in your .env file or set manually.");
  }
});

if (errors.length) {
  errors.forEach(function(error) {
    $.util.log(error);
  });
  process.exit(1);
}

var logLevel = log.levels.DEBUG;
if (process.env.LOG_LEVEL) {
  logLevel = parseInt(process.env.LOG_LEVEL);
}

log.setLevel(logLevel);
$.util.log("Log level is " + log.getLevel());

var uri = new URI(process.env.SERVER_URL);
var subdomain = uri.subdomain();
var domain;

if (subdomain) {
  domain = subdomain + "." + uri.domain();
} else {
  domain = uri.domain();
}

$.util.log("Domain " + domain);

// The default task
gulp.task('default', ['sync']);

gulp.task('deploy', function(cb) {
  watch = false;
  RELEASE = true;
  DEPLOY = true;
  process.env.DEPLOY = DEPLOY;
  outputDir = "./deploy/build/";
  runSequence(['clean', 'build', 'appspec', 'prodnode'], cb);
});

// Clean output directory
gulp.task('clean', function() {
  gulp.src(['.tmp', './deploy', './build']) // much faster 
    .pipe(rimraf({
      read: false,
      force: true
    }));
}
);

// 3rd party libraries
gulp.task('latex', function() {
  return gulp.src([
    './src/latex/**/*'
  ], {
    "base": "./src"
  }).pipe(gulp.dest(outputDir));
});

gulp.task('prodnode', function(cb) {
  gulp.src(['tempnode/node_modules/**/*'])
    .pipe(gulp.dest('deploy/node_modules'));
  cb();
});

// Copy appspec
gulp.task('appspec', function(cb) {
  gulp.src([
    'appspec.yml'
  ], {
    "base": "./"
  }).pipe(gulp.dest('deploy'));
  cb();
});


// 3rd party libraries
gulp.task('vendor', ['latex'], function() {

  return gulp.src([
    '*/rpgchef-theme/**/*',
    '*/font-awesome/**/*'
  ], {
    "base": "./node_modules/"
  }).pipe(gulp.dest(path.join(outputDir, 'public', 'vendor')));

});

// Static files
gulp.task('assets', function() {
  src.assets = [
    'src/public/**/*',
  ];
  return gulp.src(src.assets)
    .pipe($.changed(path.join(outputDir, 'public')))
    .pipe(gulp.dest(path.join(outputDir, 'public')))
    .pipe($.size({
      title: 'assets'
    }));
});

// Bundle
gulp.task('bundle', function(cb) {
  var started = false;
  var config = require('./webpack.config');
  var bundler = webpack(config);

  function bundle(err, stats) {

    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    if (argv.verbose) {
      $.util.log('[webpack]', stats.toString({
        colors: true
      }));
    }

    if (!started) {
      started = true;
      return cb();
    }
  }

  if (watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// CSS style sheets
gulp.task('styles', function() {
  src.styles = 'src/styles/**/*.{css,less}';
  return gulp.src('src/styles/main.less')
    .pipe($.plumber())
    .pipe($.less({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.csscomb())
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(path.join(outputDir, 'public', 'css')))
    .pipe($.size({
      title: 'styles'
    }));
});

// Build the app from source code
gulp.task('build', ['clean'], function(cb) {
  runSequence(['vendor', 'assets', 'styles', 'bundle'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', function(cb) {
  watch = true;
  runSequence('build', function() {
    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.styles, ['styles']);
    cb();
  });
});



// Launch the Node.js/Hapi server
gulp.task('serve', ['build:watch'], function(cb) {

  if (DEPLOY) {
    cb();
    return;
  }
  src.server = [
    'build/server.js',
    'build/workers.js'
  ];

  var started = false;
  var cp = require('child_process');
  var assign = require('react/lib/Object.assign');

  var server = (function startup() {
    var child = cp.fork('build/server.js', {
      env: assign({
        NODE_ENV: 'development'
      }, process.env)
    });
    child.once('message', function(message) {

      if (message.match(/^online$/)) {

        if (browserSync) {
          browserSync.reload();
        }

        if (!started) {
          started = true;
          gulp.watch(src.server, function() {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', function() {
    server.kill('SIGTERM');
  });
});

// Launch BrowserSync development server
gulp.task('sync', ['serve'], function(cb) {

  if (DEPLOY) {
    cb();
    return;
  }


  $.util.log("Starting browsersync");
  browserSync = require('browser-sync');
  browserSync({
    notify: true,
    https: false,
    proxy: 'localhost:' + process.env.SERVER_PORT,
    scriptPath: function(relative) {
      return relative;
    },
    host: domain,
    open: false
  }, cb);

  process.on('exit', function() {
    browserSync.exit();
  });

  gulp.watch(['build/**/*.*'].concat(
    src.server.map(function(file) {
      return '!' + file;
    })
  ), function(file) {
    browserSync.reload(path.relative(__dirname, file.path));
  });
});

var dbURL;
if (gutil.env.db == "prod") {
  dbURL = process.env.POSTGRES_PROD;
} else {
  dbURL = process.env.POSTGRES;
}

gulp.task('migrate', function(cb) {
  var cmd = "./node_modules/.bin/sequelize db:migrate --url " + dbURL;
  exec(cmd, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('unmigrate', function(cb) {
  var cmd = "./node_modules/.bin/sequelize db:migrate:undo --url " + dbURL;
  exec(cmd, function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('migration', function(cb) {

  if (gutil.env.name) {
    var name = gutil.env.name;
    var cmd = "./node_modules/.bin/sequelize migration:create --url " + dbURL + " --name " + name;
    exec(cmd, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });

  } else {
    console.log("Please specify a name for this migration, i.e. --name users");
  }

});

gulp.task('fixture', function(cb) {

  if (gutil.env.name) {
    var name = gutil.env.name;
    var cmd = "./node_modules/.bin/pji -c "
      + dbURL + " -t " + name + " --file ./fixtures/" + name + ".json";
    exec(cmd, function(err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });

  } else {
    console.log("Please specify the name of the table, i.e. --name effects");
  }

});

