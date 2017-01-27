import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['button'],
  classNameBindings: ['mouseOver', 'bigButton'],
  attributeBindings: ['style'],
  style: Ember.computed('fillColor', function() {
    return Ember.String.htmlSafe(`background-color:${this.get('fillColor')};`);
  }),
  fillColor: 'green',
  data: null,

  mouseEnter() {
    this.set('mouseOver', true);
  },
  mouseLeave() {
    this.set('mouseOver', false);    
  },
  mouseDown() {
    this.set('mouseOver', false);
    if (Ember.isPresent(this.get('clicked'))) {
      if (Ember.isPresent(this.get('data'))){
        this.get('clicked')(this.get('data'));
      } else {
        this.get('clicked')();
      }
    }
  },
  mouseUp() {
    this.set('mouseOver', true);
  }
});
