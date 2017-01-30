import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  gameState: Ember.inject.service(),
  difficulty: Ember.computed.alias('gameState.difficulty'),
  
  oneColor: Ember.computed('difficulty', function () {
    if (this.get('difficulty') === 1) {
      return Ember.String.htmlSafe('#D32F2F');
    }
    return Ember.String.htmlSafe('#E0E0E0');
  }),
  twoColor: Ember.computed('difficulty', function () {
    if (this.get('difficulty') === 2) {
      return Ember.String.htmlSafe('#D32F2F');
    }
    return Ember.String.htmlSafe('#E0E0E0');
  }),
  threeColor: Ember.computed('difficulty', function () {
    if (this.get('difficulty') === 3) {
      return Ember.String.htmlSafe('#D32F2F');
    }
    return Ember.String.htmlSafe('#E0E0E0');
  }),
  fourColor: Ember.computed('difficulty', function () {
    if (this.get('difficulty') === 4) {
      return Ember.String.htmlSafe('#D32F2F');
    }
    return Ember.String.htmlSafe('#E0E0E0');
  }),
  fiveColor: Ember.computed('difficulty', function () {
    if (this.get('difficulty') === 5) {
      return Ember.String.htmlSafe('#D32F2F');
    }
    return Ember.String.htmlSafe('#E0E0E0');
  }),

  actions: {
    difficultySelected(difficulty) {
      this.set('gameState.difficulty', difficulty);
      //maybe create a new game?
      this.closeDialog(difficulty);
    },
    cancel() {
      this.closeDialogAndReject();
    }
  }
});
