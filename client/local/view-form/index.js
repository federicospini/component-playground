
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
