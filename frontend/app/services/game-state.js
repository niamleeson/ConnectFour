import Ember from 'ember';

export default Ember.Service.extend({
  ajax: Ember.inject.service(),
  humanPlaying: true,
  compPlaying: false,
  difficulty: 3,
  board: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  openRows: [5, 5, 5, 5, 5, 5, 5],

  getOpenRow(openRows, column) {
    return openRows[column];
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
    this.set('openRows', [5, 5, 5, 5, 5, 5, 5]);
    this.set('newGame', true);
  },

  requestCompPosition(colIndex) {
    
  }
});
