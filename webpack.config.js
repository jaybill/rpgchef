'use strict';

var _ = require('lodash');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));
var ignore = new webpack.IgnorePlugin(new RegExp("\.test\.js"));
var RewirePlugin = require("rewire-webpack");
var DEBUG = !argv.release;
var path = require('path');

var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
  '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
  '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

var babelQuery = {
  cacheDirectory: true,
  presets: ['es2015', 'stage-0', 'react'],
  plugins: ["check-es2015-constants", "transform-es2015-block-scoping", "transform-es2015-constants"]
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

var config = {
  output: {
    path: './build/',
    publicPath: './public/',
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,
  devtool: DEBUG ? '#inline-source-map' : false,

  stats: {
    colors: true,
    reasons: DEBUG
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],


  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    preLoaders: [],
    postLoaders: [
      {
        loader: "transform?envify"
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER +
          '!less-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelQuery
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: babelQuery
      }
    ]
  }

};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

var appConfig = _.merge({}, config, {
  entry: './src/frontend/app.js',
  output: {
    filename: 'app.js',
    path: './build/public/'
  },
  plugins: config.plugins.concat([
    ignore,
    new webpack.DefinePlugin(_.merge(GLOBALS, {
      '__SERVER__': false
    }))
  ].concat(DEBUG ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
  )
});
appConfig.resolve = {
  root: path.resolve(__dirname, "node_modules"),
  fallback: path.join(__dirname, "node_modules"),
  fallbackLoader: path.join(__dirname, "node_modules"),
  extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
}

//
// Configuration for the test bundle (test.js)
// -----------------------------------------------------------------------------


//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

var serverConfig = _.merge({}, config, {
  entry: './src/server/server.js',
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /^[a-z\-0-9]+$/,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  plugins: config.plugins.concat(
    ignore,
    new webpack.DefinePlugin(_.merge(GLOBALS, {
      '__SERVER__': true
    }))
  ),
  module: {
    loaders: config.module.loaders.map(function(loader) {
      // Remove style-loader
      return _.merge(loader, {
        loader: loader.loader = loader.loader.replace('style-loader!', '')
      });
    })
  }
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

var apiConfig = _.merge({}, config, {
  entry: './src/api/api.js',
  output: {
    filename: 'api.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: /^[a-z\-0-9]+$/,
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  plugins: config.plugins.concat(
    ignore,
    new webpack.DefinePlugin(_.merge(GLOBALS, {
      '__SERVER__': true
    }))
  ),
  module: {
    loaders: config.module.loaders.map(function(loader) {
      // Remove style-loader
      return _.merge(loader, {
        loader: loader.loader = loader.loader.replace('style-loader!', '')
      });
    })
  }
});

module.exports = [appConfig, apiConfig, serverConfig];
