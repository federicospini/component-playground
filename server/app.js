/*!
 * component-playground
 * playground for published Component(s)
 */

/**
 * component.json
 */

var component_json = {
  "name": "playground-",
  "description": "Component playground ",
  "version": "0.0.0"
};

/**
 * app dependencies
 */
 
var express = require('express');
var shortid = require('shortid');
var async = require('async');
var fs = require('fs');
var extend = require('extend');
var rimraf = require('rimraf');
var exec = require('child_process').exec;

var playgrounds = {};
var app = express();


/**
 * create_filesystem
 * create foldes `playgrounds/<id>`.
 *
 * @param {Object} options
 *   @param {String} options.id
 *   @param {Object} options.data
 * @api private
 */

var create_filesystem = function(options, callback) {
  var id = options.id;
  var path = 'public/playgrounds/' + id;
  fs.mkdir(path, function(err) {
    if (err) throw err;
    callback(null, options);
  });
};

/**
 * create_component_json
 * create file `playgrounds/<id>/component.json`.
 *
 * @param {Object} options
 *   @param {String} options.id
 *   @param {Object} options.data
 * @api private
 */


var create_component_json = function(options, callback) {
  var id = options.id;
  var data = options.data;
  var path = 'public/playgrounds/' + id + '/component.json';
  var component = {};
  var string;
  
  extend(true, component, component_json);
  component.name += id;
  component.description += id;
  component.dependencies = {};
  data.dependencies.forEach(function(item) {
    if (item !== '') {
      component.dependencies[item] = "*";      
    }
  });
  string = JSON.stringify(component);
  fs.writeFile(path, string, function(err) {
    if (err) throw err;
    callback(null, options);
  });
};

/**
 * create_makefile
 * create a symbolic link to `asset/Makefile`.
 *
 * @param {Object} options
 *   @param {String} options.id
 *   @param {Object} options.data
 * @api private
 */


var create_makefile = function(options, callback) {
  var id = options.id;
  var srcpath = '../../../assets/Makefile';
  var dstpath = 'public/playgrounds/' + id + '/Makefile';
  fs.symlink(srcpath, dstpath, 'file', function() {
    callback(null, options);    
  });
};

/**
 * create_html
 * create file `playgrounds/<id>/index.html`
 *
 * @param {Object} options
 *   @param {String} options.id
 *   @param {Object} options.data
 * @api private
 */


var create_html = function(options, callback) {
  var id = options.id;
  var data = options.data;
  var path = 'public/playgrounds/' + id + '/index.html';
  var html = data.html;
  
  fs.writeFile(path, html, function(err) {
    if (err) throw err;
    callback(null, options);
  });
};

/**
 * create_eraser
 * bind a crone to erase folder `playgrounds/<id>` after 1h.
 *
 * @param {Object} options
 *   @param {String} options.id
 *   @param {Object} options.data
 * @api private
 */

var create_eraser = function(options, callback) {
  var id = options.id;
  var path = 'public/playgrounds/' + id;
  playgrounds[id] = setTimeout(function() {
    rimraf(id, function(err) {
      if (err) throw err;
      
    });
  }, 3600000);
  callback(null, options);
};

/**
 * build
 * build the project.
 *
 * @param {Object} options
 *   @param {String} options.id
 *   @param {Object} options.data
 * @api private
 */

var build = function(options, callback) {
  var id = options.id;
  var cmd = 'cd public/playgrounds/' + id + '; make'; 
  
  console.log('BUILDING...');
  
  exec(cmd, function(err) {
    if (err) throw err;
    callback(null, options);    
  });
};

app
  .use(express.logger('dev'))
  .use(express.favicon())
  .use(express.static(__dirname + '/public'))
  .use(express.bodyParser())
  .listen(7000);

app.post('/build', function(req, res) {
  var id = shortid.generate();
  var redirect_url = '/playgrounds/' + id;
  
  console.log('building dependencies: ' + req.body.dependencies);
  
  async.waterfall([
    function(callback) {
      callback(null, {id: id, data: req.body});
    },
    create_filesystem,
    create_component_json,
    create_html,
    create_makefile,
    create_eraser,
    build
  ], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('DONE!');
    res.redirect(redirect_url);
  });
});