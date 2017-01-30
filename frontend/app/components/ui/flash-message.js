import Ember from 'ember';

export default Ember.Component.extend({
  appState: Ember.inject.service(),
  classNames: ['flash-message'],
  classNameBindings: ['messageType', 'isShown'],

  messageType: Ember.computed('appState.flashMessageType', function() {
    return this.get('appState.flashMessageType');
  }),

  isShown: Ember.computed('appState.flashMessageShown', function() {
    if (this.get('appState.flashMessageShown')) {
      setTimeout(() => {
        this.set('appState.flashMessageShown', false);
      }, 2000);
      return true;
    }
  })
});
