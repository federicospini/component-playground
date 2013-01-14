/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("component-domify/index.js", function(module, exports, require){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

});
require.register("component-emitter/index.js", function(module, exports, require){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-mvc-attribute/index.js", function(module, exports, require){

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

});
require.register("component-mvc-model/index.js", function(module, exports, require){
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
});
require.register("component-mvc-event-manager/index.js", function(module, exports, require){
/*
 * event-manager
 * Event manager
 *
 * Copyright 2012 Enrico Marino and Federico Spini
 * MIT License
 */ 

/*
 * Expose `Manager`
 */

module.exports = EventManager;

/*
 * EventManager
 * Create an event manager.
 *
 * @param {Element} `target` object which events will be bound to
 * @param {Object} `obj` which will receive method calls
 * @return {Manager} the event manager
 */

function EventManager(target, obj) {
  if (!(this instanceof EventManager)) {
    return new EventManager(target, obj);
  }

  this.target = target;
  this.obj = obj;
  this._bindings = {};
}

/**
 * bind
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * @example
 *    events.bind('login') // implies "onlogin"
 *    events.bind('login', 'onLogin')
 *
 * @param {String} event `event` name
 * @param {String} [method] `method` name
 * @return {EventManager} the event manager, for chaining
 * @api public
 */

EventManager.prototype.bind = function(event, method) {
  var target = this.target;
  var obj = this.obj;
  var bindings = this._bindings;
  var method = method || 'on' + event;
  var fn = obj[method].bind(obj);

  target.on(event, fn);

  bindings[event] = bindings[event] || {};
  bindings[event][method] = fn;

  return this;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * @example
 *     events.unbind('login', 'onLogin')
 *     events.unbind('login')
 *     events.unbind()
 *
 * @param {String} [event]
 * @param {String} [method]
 * @return {EventManager} the event manager, for chaining
 * @api public
 */

EventManager.prototype.unbind = function(event, method) {
  if (0 == arguments.length) {
    return this.unbind_all();
  }
  if (1 == arguments.length) {
    return this.unbind_all_of(event);
  }
  
  var target = this.target;
  var bindings = this._bindings;
  var method = method || 'on' + event;
  var fn = bindings[event][method];

  if (fn) {
    target.off(event, fn);
    delete bindings[event][method];
  }
  
  return this;
};

/**
 * unbind_all
 * Unbind all events.
 *
 * @api private
 */

EventManager.prototype.unbind_all = function() {
  var bindings = this._bindings;
  var event;
  
  for (event in bindings) {
    this.unbind_all_of(event);
  }

  return this;
};

/**
 * unbind_all_of
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

EventManager.prototype.unbind_all_of = function(event) {
  var bindings = this._bindings[event];
  var method;

  if (!bindings) return;

  for (method in bindings) {
    this.unbind(event, method);
  }
  delete this._bindings[event];

  return this;
};

});
require.register("component-matches-selector/index.js", function(module, exports, require){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
});
require.register("component-event/index.js", function(module, exports, require){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("component-delegate/index.js", function(module, exports, require){

/**
 * Module dependencies.
 */

var matches = require('matches-selector')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    if (matches(e.target, selector)) fn(e);
  }, capture);
  return callback;
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

});
require.register("component-mvc-delegate-manager/index.js", function(module, exports, require){
/*
 * delegate-manager
 * Delegate manager
 *
 * Copyright 2012 Enrico Marino and Federico Spini
 * MIT License
 */ 

/*
 * Expose `Manager`
 */

module.exports = DelegateManager;

/* 
 * Module dependencies
 */

var delegate = require('delegate');

/*
 * DelegateManager
 * Create an event manager.
 *
 * @param {Element} `target` object which events will be bound to
 * @param {Object} `obj` which will receive method calls
 * @return {Manager} the event manager
 */

function DelegateManager(target, obj) {
  if (!(this instanceof DelegateManager)) {
    return new DelegateManager(target, obj);
  }

  this.target = target;
  this.obj = obj;
  this._bindings = {};
}

/**
 * bind
 * Bind to `event` with optional `method` name.
 * When `method` is undefined it becomes `event`
 * with the "on" prefix.
 *
 * @example
 *    events.bind('login') // implies "onlogin"
 *    events.bind('login', 'onLogin')
 *
 * @param {String} event `event` name
 * @param {String} [method] `method` name
 * @return {DelegateManager} the event manager, for chaining
 * @api public
 */

DelegateManager.prototype.bind = function(str, method) {
  var target = this.target;
  var obj = this.obj;
  var bindings = this._bindings;
  var event = parse(str);
  var name = event.name;
  var selector = event.selector;
  var method = method || 'on' + name;
  var fn = obj[method].bind(obj);
  var callback;

  if (selector !== '') {
    callback = delegate.bind(target, selector, name, fn, false); 
  } else {
    target.addEventListener(name, fn, false);
    callback = fn;
  }

  bindings[name] = bindings[name] || {};
  bindings[name][method] = callback;

  return this;
};

/**
 * Unbind a single binding, all bindings for `event`,
 * or all bindings within the manager.
 *
 * @example
 *     events.unbind('login', 'onLogin')
 *     events.unbind('login')
 *     events.unbind()
 *
 * @param {String} [event]
 * @param {String} [method]
 * @return {DelegateManager} the event manager, for chaining
 * @api public
 */

DelegateManager.prototype.unbind = function(str, method) {
  if (0 == arguments.length) {
    return this.unbind_all();
  }
  if (1 == arguments.length) {
    return this.unbind_all_of(event);
  }
  
  var target = this.target;
  var bindings = this._bindings;
  var event = parse(str);
  var name = event.name;
  var selector = event.selector;
  var method = method || 'on' + name;
  var fn = bindings[name][method];

  if (fn) {
    delegate.unbind(target, name, fn, false);
    delete bindings[name][method];
  }
  
  return this;
};

/**
 * unbind_all
 * Unbind all events.
 *
 * @api private
 */

DelegateManager.prototype.unbind_all = function() {
  var bindings = this._bindings;
  var event;
  
  for (event in bindings) {
    this.unbind_all_of(event);
  }

  return this;
};

/**
 * unbind_all_of
 * Unbind all events for `event`.
 *
 * @param {String} event
 * @api private
 */

DelegateManager.prototype.unbind_all_of = function(event) {
  var bindings = this._bindings[event];
  var method;

  if (!bindings) return;

  for (method in bindings) {
    this.unbind(event, method);
  }
  delete this._bindings[event];

  return this;
};


/**
 * Parse event / selector string.
 *
 * @param {String} string
 * @return {Object}
 * @api private
 */

function parse(str) {
  var parts = str.split(' ');
  var event = parts.shift();
  var selector = parts.join(' ');

  return { name: event, selector: selector };
}

});
require.register("component-mvc-viewmodel/index.js", function(module, exports, require){
/*
 * viewmodel
 * ViewModel component
 *
 * @copyright 2012 Enrico Marino and Federico Spini
 * @license MIT
 */ 

/*
 * Expose `ViewModel`
 */

module.exports = ViewModel;

/*
 * Module dependencies
 */

var events = require('event-manager');
var delegates = require('delegate-manager');
var Model = require('model');

/*
 * ViewModel
 * Create a viewmodel.
 * 
 * @param {Object} options
 *   @param {Element} [options.el] element
 *   @param {Object} [options.model] model
 * @return {ViewModel} a viewmodel
 */

function ViewModel(options) {
  if (!(this instanceof ViewModel)) {
    return new ViewModel(options);
  }
  options = options || {};
  this.el = options.el || document.createElement('div');
  this.model = options.model || new Model();
  this.events = delegates(this.el, this);
  this.messages = events(this.model, this);
}

});
require.register("view-formitem/index.js", function(module, exports, require){

/* !
 * component-playground
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2012 Enrico Marino and Federico Spini
 * @licence MIT
 */

/**
 * Component dependencies.
 */

var ViewModel = require('viewmodel');
var domify = require('domify');
var template = require('./template.js');

/**
 * Expose `ViewFromItem`.
 */

module.exports = ViewFormItem;

/**
 * ViewFormItem
 *
 * @param {Object} options options
 * @param {Element} [options.el] element
 * @param {Collection} [options.collection] collection
 * @api public
 */

function ViewFormItem(options) {
  options = options || {};
  options.el = domify(template)[0];
  ViewModel.call(this, options);

  this.events
    .bind('click .remove-dependency', 'onremove');
  
  this.view_form = options.view_form;
}

/**
 * Inherit from `ViewModel.prototype`
 */

ViewFormItem.prototype = new ViewModel;
ViewFormItem.prototype.constructor = ViewFormItem;

/**
 * onremove
 *
 * @param {Event} event
 */

ViewFormItem.prototype.onremove = function(event) {
  event.preventDefault();
  console.log('remove component dependency');
  var item = new ViewFormItem();
  this.view_form.remove(this);
};

});
require.register("view-formitem/template.js", function(module, exports, require){
module.exports = '<div>\n  <input type="text" class="dependency" name="dependencies" placeholder="author/repo" /><button class=\'button remove-dependency\'>remove</button>\n</div>';
});
require.register("view-form/index.js", function(module, exports, require){

/* !
 * component-playground
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2012 Enrico Marino and Federico Spini
 * @licence MIT
 */

/**
 * Component dependencies.
 */

var ViewModel = require('viewmodel');
var domify = require('domify');
var template = require('./template.js');
var ViewFormItem = require('view-formitem');

/**
 * Expose `ViewFrom`.
 */

module.exports = ViewForm;

/**
 * ViewForm
 *
 * @param {Object} options options
 * @param {Element} [options.el] element
 * @param {Model} [options.model] model
 * @api public
 */

function ViewForm(options) {
  options = options || {};
  options.el = domify(template)[0];
  ViewModel.call(this, options);

  this.events
    .bind('click #button-add', 'onadd');
  
  this.form_items = [];
  this.anchor = options.el.querySelector('#form-anchor');
}

/**
 * Inherit from `ViewModel.prototype`
 */

ViewForm.prototype = new ViewModel;
ViewForm.prototype.constructor = ViewForm;

/**
 * onadd
 *
 * @param {Event} event 
 */

ViewForm.prototype.onadd = function(event) {
  event.preventDefault();
  console.log('add component dependency');
  var item = new ViewFormItem({view_form: this});
  this.form_items.push(item);
  this.anchor.parentElement.appendChild(item.el);
};

/**
 * remove
 *
 * @param {ViewFormItem} item 
 */

ViewForm.prototype.remove = function(item) {
  var form_items = this.form_items;
  var i = form_items.indexOf(item);
  form_items.splice(i, 1);
  this.anchor.parentElement.removeChild(item.el);
};

});
require.register("view-form/template.js", function(module, exports, require){
module.exports = '<form method="post" action="build" id="component-form">\n  <fieldset>\n    <div class="label">dependencies</div>    \n  </fieldset>\n  <fieldset>\n    <button id="button-add" class="button long-button">add component</button>\n  </fieldset>\n  <fieldset>\n    <div>\n      <input type=text class="dependency first" name="dependencies" placeholder="author/repo"/>\n    </div>\n    <script type="template/html" id="form-anchor"></script>\n  </fieldset>\n  \n  <fieldset>\n    <div class="label">custom HTML</div>    \n  </fieldset>\n  <fieldset>\n    <div>\n      <textarea cols=80 rows=15 name="html" form="component-form" placeholder="put your custom HTML code here. Be sure to link `build/build.css` and `build/build.js`."></textarea>\n    </div>\n  </fieldset>\n  <fieldset>\n    <input type="submit" value="build" class="button long-button" />\n  </fieldset>\n</form>';
});
require.register("app/index.js", function(module, exports, require){

/* !
 * component-playground
 *
 * @author Enrico Marino and Federico Spini
 * @copyright 2012 Enrico Marino and Federico Spini
 * @licence MIT
 */

/**
 * Component dependencies.
 */

var ViewModel = require('viewmodel');
var domify = require('domify');
var template = require('./template.js');
var ViewForm = require('view-form');

/**
 * Expose `App`.
 */

module.exports = App;

/**
 * App
 *
 * @param {Object} options options
 * @param {Element} [options.el] element
 * @param {Model} [options.model] model
 * @api public
 */

function App(options) {
  options = options || {};
  options.el = domify(template)[0];
  ViewModel.call(this, options);
  
  this.anchor = options.el.querySelector('#app-anchor');
  this.view_form = new ViewForm();
  this.anchor.parentElement.appendChild(this.view_form.el);
}

/**
 * Inherit from `ViewModel.prototype`
 */

App.prototype = new ViewModel;
App.prototype.constructor = App;

// /**
//  * onadd
//  *
//  * @param {Mixed} item added item
//  */
// 
// ViewLibrary.prototype.onadd = function(item) {
//   var subview = new ViewLibraryItem({model: item});
//   this.el.appendChild(subview.el);
// };
// 
// /**
//  * onclick
//  *
//  * @param {Mixed} item added item
//  */
// 
// ViewLibrary.prototype.onclick = function(event) {
//   console.log(event);
// };

});
require.register("app/template.js", function(module, exports, require){
module.exports = '<div class="content">\n  <div class="title">Component playground</div>\n  <section>\n    <script type="template/html" id="app-anchor"></script>\n  </section>\n</div>';
});
require.alias("app/index.js", "undefined/deps/app/index.js");
require.alias("app/template.js", "undefined/deps/app/template.js");
require.alias("component-domify/index.js", "app/deps/domify/index.js");

require.alias("component-mvc-viewmodel/index.js", "app/deps/viewmodel/index.js");
require.alias("component-mvc-model/index.js", "component-mvc-viewmodel/deps/model/index.js");
require.alias("component-mvc-attribute/index.js", "component-mvc-model/deps/attribute/index.js");
require.alias("component-mvc-attribute/index.js", "component-mvc-model/deps/attribute/index.js");
require.alias("component-emitter/index.js", "component-mvc-attribute/deps/emitter/index.js");

require.alias("component-mvc-event-manager/index.js", "component-mvc-viewmodel/deps/event-manager/index.js");

require.alias("component-mvc-delegate-manager/index.js", "component-mvc-viewmodel/deps/delegate-manager/index.js");
require.alias("component-delegate/index.js", "component-mvc-delegate-manager/deps/delegate/index.js");
require.alias("component-matches-selector/index.js", "component-delegate/deps/matches-selector/index.js");

require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("view-form/index.js", "app/deps/view-form/index.js");
require.alias("view-form/template.js", "app/deps/view-form/template.js");
require.alias("component-domify/index.js", "view-form/deps/domify/index.js");

require.alias("component-mvc-viewmodel/index.js", "view-form/deps/viewmodel/index.js");
require.alias("component-mvc-model/index.js", "component-mvc-viewmodel/deps/model/index.js");
require.alias("component-mvc-attribute/index.js", "component-mvc-model/deps/attribute/index.js");
require.alias("component-mvc-attribute/index.js", "component-mvc-model/deps/attribute/index.js");
require.alias("component-emitter/index.js", "component-mvc-attribute/deps/emitter/index.js");

require.alias("component-mvc-event-manager/index.js", "component-mvc-viewmodel/deps/event-manager/index.js");

require.alias("component-mvc-delegate-manager/index.js", "component-mvc-viewmodel/deps/delegate-manager/index.js");
require.alias("component-delegate/index.js", "component-mvc-delegate-manager/deps/delegate/index.js");
require.alias("component-matches-selector/index.js", "component-delegate/deps/matches-selector/index.js");

require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("view-formitem/index.js", "view-form/deps/view-formitem/index.js");
require.alias("view-formitem/template.js", "view-form/deps/view-formitem/template.js");
require.alias("component-domify/index.js", "view-formitem/deps/domify/index.js");

require.alias("component-mvc-viewmodel/index.js", "view-formitem/deps/viewmodel/index.js");
require.alias("component-mvc-model/index.js", "component-mvc-viewmodel/deps/model/index.js");
require.alias("component-mvc-attribute/index.js", "component-mvc-model/deps/attribute/index.js");
require.alias("component-mvc-attribute/index.js", "component-mvc-model/deps/attribute/index.js");
require.alias("component-emitter/index.js", "component-mvc-attribute/deps/emitter/index.js");

require.alias("component-mvc-event-manager/index.js", "component-mvc-viewmodel/deps/event-manager/index.js");

require.alias("component-mvc-delegate-manager/index.js", "component-mvc-viewmodel/deps/delegate-manager/index.js");
require.alias("component-delegate/index.js", "component-mvc-delegate-manager/deps/delegate/index.js");
require.alias("component-matches-selector/index.js", "component-delegate/deps/matches-selector/index.js");

require.alias("component-event/index.js", "component-delegate/deps/event/index.js");
