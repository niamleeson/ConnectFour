import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  ajax: Ember.inject.service(),
  humanPlaying: true,
  compPlaying: false,
  disabled: false,
  playerInputDisabled: false,
  compWins: false,
  humanWins: false,
  player: 1,
  computer: 2,

  difficulty: 4,
  board: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  openCols: [5, 5, 5, 5, 5, 5, 5],

  getOpenCol(openCols, column) {
    return openCols[column];
  },
  newGame: true,

  createNewGame() {
    this.set('board', [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]);
    this.set('openCols', [5, 5, 5, 5, 5, 5, 5]);
    this.set('newGame', true);
    this.set('humanPlaying', true);
    this.set('compPlaying', false);
    this.set('disabled', false);
    this.set('compWins', false);
    this.set('humanWins', false);
    this.set('playerInputDisabled', false);
  },

  checkWinState() {
    return this.get('compWins') || this.get('humanWins');
  },

  setGameStatusToCompPlaying() {
    this.set('humanPlaying', false);
    this.set('compPlaying', true);
    this.set('disabled', true);
    this.set('playerInputDisabled', true);
  },

  setGameStatusToHumanPlaying() {
    this.set('humanPlaying', true);
    this.set('compPlaying', false);
    this.set('disabled', false);
    this.set('playerInputDisabled', false);
  },

  gameStateText: Ember.computed('disabled', 'compWins', 'humanWins', function () {
    if (this.get('compWins')) {
      return 'Computer wins';
    } else if (this.get('humanWins')) {
      return 'Player wins';
    } else {
      if (this.get('disabled')) {
        return 'Computer is thinking';
      } else {
        return 'It is your turn to play';
      }
    }
  }),

  sendGameState(colIndex) {
    if (this.get('session.isAuthenticated')) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
          const headers = {};
          headers[headerName] = headerValue;
          let data = {
            column: colIndex,
            board: this.get('board'),
            open_cols: this.get('openCols'),
            difficulty: this.get('difficulty'),
            last_move: colIndex
          };

          this.get('ajax').request('/solve', {
            headers,
            method: 'POST',
            data: data
          })
            .then((data) => {
              resolve(data);
            })
            .catch(() => {
              reject();
            });
        });
      });
    } else {
      return new Ember.RSVP.Promise((resolve, reject) => {
        // const headers = {};
        // headers[headerName] = headerValue;
        let data = {
          column: colIndex,
          board: this.get('board'),
          open_cols: this.get('openCols'),
          difficulty: this.get('difficulty'),
          last_move: colIndex
        };

        this.get('ajax').request('/solve', {
          // headers,
          method: 'POST',
          data: data
        })
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject();
          });
      });
    }
  }
});
