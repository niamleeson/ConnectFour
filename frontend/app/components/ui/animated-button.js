import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['button'],
  classNameBindings: ['mouseOver', 'bigButton', 'buttonDisabled'],
  attributeBindings: ['style'],
  style: Ember.computed('fillColor', function() {
    return Ember.String.htmlSafe(`background-color:${this.get('fillColor')};`);
  }),
  fillColor: 'green',
  data: null,
  tooltipEnabled: false,
  tooltipText: null,
  buttonDisabled: false,

  // initTooltip: Ember.on('didRender', function() {
  //   if (this.get('tooltipEnabled')) {
  //     this.$().tooltip({title: this.get('tooltipText')});
  //   }
  // }),

  mouseEnter() {
    if (!this.get('buttonDisabled')) {
      this.set('mouseOver', true);
    }
  },
  mouseLeave() {
    if (!this.get('buttonDisabled')) {
      this.set('mouseOver', false);   
    } 
  },
  mouseDown() {
    if (!this.get('v')) {
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
