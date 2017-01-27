import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'rect',
  attributeBindings: ['x', 'y', 'width', 'height', 'fill'],
  x: Ember.computed('left', function() {
    let left = this.get('left') || 0;

    return Ember.String.htmlSafe(left);
  }),
  y: Ember.computed('top', function() {
    let top = this.get('top') || 0;

    return Ember.String.htmlSafe(top);
  }),
  width: Ember.computed('edgeWidth', function () {
    let width = this.get('edgeWidth') || 40;

    return Ember.String.htmlSafe(width);
  }),
  height: Ember.computed('edgeHeight', function () {
    let height = this.get('edgeHeight') || 40;

    return Ember.String.htmlSafe(height);
  }),
  fillColor: 'red',
  fill: Ember.computed('fillColor', function () {
    return Ember.String.htmlSafe(this.get('fillColor'));
  })  
});
