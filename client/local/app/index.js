
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
