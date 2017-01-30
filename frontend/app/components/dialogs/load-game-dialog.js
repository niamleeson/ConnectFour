import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  ajax: Ember.inject.service(),
  appState: Ember.inject.service(),
  gameState: Ember.inject.service(),
  boards: [],
  board: null,
  confirmDelete: false,

  boardSelected: Ember.computed('board', function() {
    if (Ember.isPresent(this.get('board'))) {
      return true;
    }
    return false;
  }),
  boardNotSelected: Ember.computed('boardSelected', function() {
    return !this.get('boardSelected');
  }),

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
      if (Ember.isPresent(this.get('board'))) {
        let board = this.get('board');
        this.set('gameState.board', board.get('boardState'));
        this.set('gameState.openCols', board.get('openCols'));
        this.set('gameState.loadGame', true);
        this.closeDialog();
      }
    },
    gameSelected(index, board) {
      this.set('selectedIndex', index);
      this.set('board', board);
    },
    deleteGame(board) {
      this.set('confirmDelete', true);
      this.set('board', board);
    },
    commitDelete() {
      this.get('board').destroyRecord()
        .then(() => {
          this.set('appState.flashMessage', 'Games Deleted');
          this.set('appState.flashMessageType', 'success');
          this.set('appState.flashMessageShown', true);
          this.set('confirmDelete', false);
          this.set('board', null);
        })
        .catch(() => {
          this.set('appState.flashMessage', 'Something went wrong :(');
          this.set('appState.flashMessageType', 'error');
          this.set('appState.flashMessageShown', true);
        });
    },
    cancelDelete() {
      this.set('confirmDelete', false);
    }
  }
});
