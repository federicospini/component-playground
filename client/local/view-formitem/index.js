
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
