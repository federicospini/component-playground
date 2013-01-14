/*
 * model
 * client-side MVC Model component
 *
 * @copyright 2012 Enrico Marino and Federico Spini
 * @license MIT
 */

/*
 * Expose `Model`
 */

module.exports = Model;

/*
 * Module dependencies
 */

var Attribute = require('attribute');

/**
 * Mixin attribute.
 */

Attribute(Model.prototype);

/*
 * Initialize a new `Model`
 *
 * @param {Object} attrs attributes
 * @return {Model} a model
 */

function Model(obj) {
  if (obj) return mixin(obj);
}

/*
 * Mixin the Model properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  var proto = Model.prototype;
  var key;

  for (key in proto) {
    obj[key] = proto[key];
  }

  return obj;
}