import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  appState: Ember.inject.service(),
  gameState: Ember.inject.service(),
  ajax: Ember.inject.service(),
  saveObj: {},
  createTmpSaveObj: Ember.on('didReceiveAttrs', function () {
    this.set('saveObj', { name: null });
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
        // let board = this.get('store').createRecord('board', {
        //   boardState: this.get('board'),
        //   openCols: this.get('openCols')
        // });

        this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          let data = {
            board_state: this.get('gameState.board'),
            open_cols: this.get('gameState.openCols')
          };

          this.get('ajax').request('/save_game', {
            headers,
            method: 'POST',
            data: data
          })
            .then((data) => {
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