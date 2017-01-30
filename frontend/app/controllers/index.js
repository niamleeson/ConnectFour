import Ember from 'ember';

export default Ember.Controller.extend({
  appState: Ember.inject.service(),
  modalDialog: Ember.inject.service(),
  gameState: Ember.inject.service(),
  session: Ember.inject.service(),

  notAuthenticated: Ember.computed('session.isAuthenticated', function() {
    return !this.get('session.isAuthenticated');
  }),

  tooltipText: 'Please sign in to use this feature',

  actions: {
    openDifficultyDialog() {
      this.get('modalDialog').openDialog('difficulty-dialog')
        .then((difficulty) => {
          this.set('appState.flashMessage', `Difficulty Changed To ${difficulty}`);
          this.set('appState.flashMessageType', 'success');
          this.set('appState.flashMessageShown', true);
        })
    },
    openConfirmationDialog() {
      this.get('modalDialog').openDialog('confirmation-dialog')
        .then(() => {
          this.get('gameState').createNewGame();
          this.set('appState.flashMessage', 'New Game Created');
          this.set('appState.flashMessageType', 'success');
          this.set('appState.flashMessageShown', true);
        });
    },
    openLoginDialog() {
      this.get('modalDialog').openDialog('login-dialog')
        .then(() => {
          this.set('appState.flashMessage', 'Login Successful');
          this.set('appState.flashMessageType', 'success');
          this.set('appState.flashMessageShown', true);
        })
    },
    closeDialog() {
      this.get('modalDialog').closeDialog();
    },
    invalidateSession() {
      this.get('session').invalidate();
    },
    openSaveGameDialog() {
      this.get('modalDialog').openDialog('save-game-dialog');
    },
    openLoadGameDialog() {
      this.get('modalDialog').openDialog('load-game-dialog');
    }
  }
});
