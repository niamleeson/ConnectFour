import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  appState: Ember.inject.service(),
  boards: [],
  board: null,

  loadBoards: Ember.on('didReceiveAttrs', function () {
    let user = this.get('currentUser.user');

    this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
      const headers = {};
      headers[headerName] = headerValue;
      let data = {
        user_id: this.get('currentUser.user.id')
      }
      this.get('ajax').request('/load_games', {
        method: 'GET',
        data
      })
        .then((data) => {
          this.get('store').pushPayload(data);
          this.set('boards', this.get('store').peekAll('board'));
          this.set('appState.flashMessage', 'Games Loaded');
          this.set('appState.flashMessageType', 'success');
          this.set('appState.flashMessageShown', true);
        })
        .catch(() => {
          this.set('appState.flashMessage', 'Something went wrong :(');
          this.set('appState.flashMessageType', 'error');
          this.set('appState.flashMessageShown', true);
        });
    });
  }),

  actions: {
    confirm() {
      this.closeDialog();
    },
    cancel() {
      this.closeDialogAndReject();
    },
    loadGame() {
      let board = this.get('board');

      
    },
    gameSelected(index, board) {
      this.set('selectedIndex', index);
      this.set('board', board);
    }
  }
});
