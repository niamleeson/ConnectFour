import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['button'],
  classNameBindings: ['mouseOver', 'bigButton', 'smallButton', 'buttonDisabled'],
  attributeBindings: ['style'],
  style: Ember.computed('fillColor', function() {
    return Ember.String.htmlSafe(`background-color:${this.get('fillColor')};`);
  }),
  fillColor: 'green',
  data: null,
  tooltipEnabled: false,
  tooltipText: null,
  buttonDisabled: false,

  mouseEnter() {
    if (!this.get('buttonDisabled')) {
      this.set('mouseOver', true);
    } else {
      if (this.get('tooltipEnabled')) {
        this.set('showTooltip', true);
      }
    }
  },
  mouseLeave() {
    if (!this.get('buttonDisabled')) {
      this.set('mouseOver', false);   
    } else {
      if (this.get('tooltipEnabled')) {
        this.set('showTooltip', false);
      }
    } 
  },
  mouseDown() {
    if (!this.get('buttonDisabled')) {
      this.set('mouseOver', false);
      if (Ember.isPresent(this.get('clicked'))) {
        if (Ember.isPresent(this.get('data'))){
          this.get('clicked')(this.get('data'));
        } else {
          this.get('clicked')();
        }
      }
    }
  },
  mouseUp() {
    if (!this.get('buttonDisabled')) {
      this.set('mouseOver', true);
    }
  }
});
