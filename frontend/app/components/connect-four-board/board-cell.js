import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'g',
  attributeBindings: ['style'],
  style: Ember.computed('left', 'top', function() {
    let left = this.get('left') || 0;
    let top = this.get('top') || 0;

    return Ember.String.htmlSafe(`transform:translate(${left}px,${top}px)`);
  }),

  fillColor: 'red',
  color: Ember.computed('fillColor', function() {
    return Ember.String.htmlSafe(`fill:${this.get('fillColor')};`);
  })
});
