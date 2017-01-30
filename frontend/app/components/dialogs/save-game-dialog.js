import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  appState: Ember.inject.service(),
  gameState: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  saveObj: {},
  createTmpSaveObj: Ember.on('didReceiveAttrs', function () {
    this.set('saveObj', { name: `game-${new Date().toJSON().substr(0, 19)}` });
  }),

  actions: {
    confirm() {
      this.closeDialog();
    },
    cancel() {
      this.closeDialogAndReject();
    },
    saveGame() {
      if (this.get('session.isAuthenticated')) {
        let board = this.get('store').createRecord('board', {
          name: this.get('saveObj.name'),
          boardState: this.get('gameState.board'),
          openCols: this.get('gameState.openCols'),
          user: this.get('currentUser.user')
        });

        this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          board.save()
            .then((data) => {
              console.log(data);
              this.closeDialog(data);
              this.set('appState.flashMessage', 'Game Saved');
              this.set('appState.flashMessageType', 'success');
              this.set('appState.flashMessageShown', true);
            })
            .catch(() => {
              this.closeDialogAndReject();
              this.set('appState.flashMessage', 'Something went wrong :(');
              this.set('appState.flashMessageType', 'error');
              this.set('appState.flashMessageShown', true);
            });
        });
      }
    }
  }
});