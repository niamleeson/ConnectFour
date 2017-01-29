import Ember from 'ember';

export default Ember.Controller.extend({
  modalDialog: Ember.inject.service(),
  gameState: Ember.inject.service(),
  session: Ember.inject.service(),

  notAuthenticated: Ember.computed('session.isAuthenticated', function() {
    return !this.get('session.isAuthenticated');
  }),

  tooltipText: 'Please sign in to use this feature',

  actions: {
    openDifficultyDialog() {
      this.get('modalDialog').openDialog('difficulty-dialog');
    },
    openConfirmationDialog() {
      this.get('modalDialog').openDialog('confirmation-dialog')
        .then(() => {
          this.get('gameState').createNewGame();
        });
    },
    openLoginDialog() {
      this.get('modalDialog').openDialog('login-dialog')
        .then(() => {
          //login?
        })
    },
    closeDialog() {
      this.get('modalDialog').closeDialog();
    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
