
/*!
 * component-playground
 * playground for published Component(s)
 */


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
var join = require('path').join;

/**
 * globals
 */
 
var port = 7000;
var playground_dir = 'public/playgrounds';
var playground_expiration = 1 * 3600 * 1000;
var component_json_path = 'assets/component.json';
var component_json;
var index_html_path = 'assets/index.html';
var index_html;
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
  var path = join(playground_dir, id);
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
  var path = join(playground_dir, id, '/component.json');
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
  var dstpath = join(playground_dir, id, 'Makefile');
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
  var path = join(playground_dir, id, 'index.html');
  var html = data.html !== "" ? data.html : index_html;
  
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
  var path = join(playground_dir, id);
  playgrounds[id] = setTimeout(function() {
    rimraf(id, function(err) {
      if (err) throw err;
    });
  }, playground_expiration);
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
  var path = join(playground_dir, id);
  var cmd = 'cd ' + path + '; make'; 
  
  console.log('BUILDING...');
  
  exec(cmd, function(err) {
    if (err) throw err;
    callback(null, options);    
  });
};


/**
 * configuration
 */
 
app
  .use(express.logger('dev'))
  .use(express.favicon())
  .use(express.static(__dirname + '/public'))
  .use(express.bodyParser());

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

/**
 * initialization
 */
 
async.waterfall([
  function(callback) {
    // empty `playgrounds` folder
    rimraf(playground_dir, function(err) {
      if (err) throw err;
      callback(null);
    });
  },
  function(callback) {
    // create `playgrounds` folder
    fs.mkdir(playground_dir, function(err) {
      if (err) throw err;
      callback(null);
    });
  },
  function(callback) {
    // read `component.json` template
    fs.readFile(component_json_path, function(err, data) {
      if (err) throw err;
      component_json = data;
      callback(null);
    });   
   },
  function(callback) {
    // read `index.html` template
    fs.readFile(index_html_path, function(err, data) {
      if (err) throw err;
      index_html = data;
      callback(null);
    });
  }
], function (err, result) {
  if (err) {
   console.log(err);
   return;
  }
  app.listen(port, function() {
   console.log('server listening on port ' + port);
  });
});

