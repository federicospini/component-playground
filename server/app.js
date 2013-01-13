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

var playgrounds = {}
var app = express();


/**
 * create_filesystem
 */

var create_filesystem = function(options, callback) {
  
  callback(null, options);
};

/**
 * create_component_json
 */

var create_component_json = function(options, callback) {
  
  callback(null, options);
};

/**
 * create_makefile
 */

var create_makefile = function(options, callback) {
  
  callback(null, options);
};

/**
 * create_html
 */

var create_html = function(options, callback) {
  
  callback(null, options);
};

/**
 * create_eraser
 */

var create_eraser = function(options, callback) {
  
  callback(null, options);
};

/**
 * build
 */

var build = function(options, callback) {
  
  callback(null, options);
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
  
  async.waterfall([
    function(callback) {
      callback(null, {id: id, data: req.body});
    },
    create_filesystem,
    create_component_json,
    create_html,
    create_makefile,
    create_eraser,
    build,
  ], function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect(redirect_url);
  });
});