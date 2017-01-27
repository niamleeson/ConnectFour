import Ember from 'ember';

export default Ember.Controller.extend({
  modalDialog: Ember.inject.service(),
  gameState: Ember.inject.service(),
  session: Ember.inject.service('session'),

  actions: {
    chooseDifficulty() {
      this.get('modalDialog').openDialog('difficulty-dialog');
    },
    createNewGame() {
      this.get('modalDialog').openDialog('confirmation-dialog')
        .then(() => {
          this.get('gameState').createNewGame();
        });
    },
    closeDialog() {
      this.get('modalDialog').closeDialog();
    },
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
