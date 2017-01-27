import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'g',
  attributeBindings: ['style'],
  style: Ember.computed('left', function() {
    let left = this.get('left') || 0;

    return Ember.String.htmlSafe(`transform:translate(${left}px);`);
  }),
  fillColor: 'red',
  radius: Ember.computed('cornerRadius', function () {
    let cornerRadius = this.get('cornerRadius') || 40;

    return Ember.String.htmlSafe(cornerRadius);
  }),
  color: Ember.computed('fillColor', function () {
    return Ember.String.htmlSafe(`fill:${this.get('fillColor')};`);
  }) 
});
