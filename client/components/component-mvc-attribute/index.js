
/* !
 * attribute
 * Attribute setter/getter component.
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2012 Enrico Marino and Federico Spini
 * @licence MIT
 */

/*
 * Module dependencies.
 */

var Emitter = require('emitter');

/*
 * Expose `Attribute`.
 */

module.exports = Attribute;

/*
 * Mixin emitter.
 */

Emitter(Attribute.prototype);

/*
 * Initialize a new `Attribute`.
 *
 * @api public
 */

function Attribute(obj) {
  if (obj) return mixin(obj);
}

/*
 * Mixin the Attribute properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  var proto = Attribute.prototype;
  var key;

  for (key in proto) {
    obj[key] = proto[key];
  }

  return obj;
}

/*
 * get
 * Get the attribute value.
 *
 * @param {String} key attribute name
 * @return {Any}
 * @api public
 */

Attribute.prototype.get = function(key) {
  this._attributes = this._attributes || {};
  return this._attributes[key];
};

/*
 * set
 * Set the attribute value.
 *
 * @param {String} key attribute name
 * @param {*} value attribute value
 * @param {Object} options options
 *   @param {Boolean} [options.silent]
 * @return {Object} this, for chaining
 * @api public
 */

Attribute.prototype.set = function(key, value, options) {
  this._attributes = this._attributes || {};
  
  if (key == null) {
    return this;
  }
  if (typeof key === 'object') {
    return this.set_all(key, value);
  }

  var attributes = this._attributes;
  var silent = options && options.silent;
  var previous = attributes[key];
  var created = !(key in attributes);
  var changed = created || previous !== value;

  if (changed) {
    attributes[key] = value;
  }
  if (changed && !silent) {
    this.emit('change:' + key, this, value, previous);
    this.emit('change', this);
  }

  return this;
};

/*
 * set_all
 * Set the attribute values.
 *
 * @param {Object} values attribute values
 * @param {Object} options options
 *   @param {Boolean} [options.silent]
 * @return {Object} this, for chaining
 * @api public
 */

Attribute.prototype.set_all = function(values, options) {
  this._attributes = this._attributes || {};
  
  if (values == null) {
    return this;
  }

  var silent = options && options.silent;
  var attributes = this._attributes;
  var key;
  var value;
  var previous;
  var changed;
  var created;
  var emitted;
  
  for (key in values) {
    previous = attributes[key];
    value = values[key];    
    created = !(key in attributes);
    changed = created || previous !== value;

    if (changed) {
      attributes[key] = value;
    }
    if (changed && !silent) {
      this.emit('change:' + key, this, value, previous);
      emitted = true;
    }
  }

  if (emitted) {
    this.emit('change', this);
  }

  return this;
};


/*
 * del
 * Delete attribute `key`.
 *
 * @param {String} key key
 * @param {Object} options options
 *   @param {Boolean} [options.silent]
 * @return {Attribute} this, for chaining.
 * @api public
 */

Attribute.prototype.del = function(key, options) {
  this._attributes = this._attributes || {};

  var attributes = this._attributes;
  var silent = options && options.silent;
  var value = attributes[key];
  var present = value != null;

  if (present) {
    delete attributes[key];
  }
  if (present && !silent) {
    this.emit('delete:' + key, this, value);
  }

  return this;
};

/*
 * has
 * Return `true` if attributes contains `key`, `false` otherwise.
 *
 * @param {String} key key
 * @return {Boolean} `true` if attributes contains `key`, `false` otherwise.
 * @api public
 */

Attribute.prototype.has = function(key) {
  this._attributes = this._attributes || {};
  return this._attributes[key] != null;
};
