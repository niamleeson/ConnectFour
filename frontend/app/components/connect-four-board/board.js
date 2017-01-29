import Ember from 'ember';

export default Ember.Component.extend({
  gameState: Ember.inject.service(),
  classNames: ['connect-four-board'],
  classNameBindings: ['boardDisabled'],
  playerColor: '#D32F2F',
  playerWinColor: '#FF1744',
  compColor: '#FFCA28',
  compWinColor: '#FFFF00',

  boardDisabled: Ember.computed('gameState.disabled', function () {
    return this.get('gameState.disabled');
  }),

  resetGame: Ember.observer('gameState.newGame', function () {
    if (this.get('gameState.newGame')) {
      this.$('#discs').empty();
    }
  }),

  insertDisc(col) {
    let openCols = this.get('gameState.openCols');
    let row = this.get('gameState.getOpenCol')(openCols, col);
    let board = this.get('gameState.board');
    let color, player;

    if (this.get('gameState.newGame')) {
      this.set('gameState.newGame', false);
    }

    if (this.get('gameState.humanPlaying')) {
      color = this.get('playerColor');
      player = 1;
      this.set('gameState.playerInputDisabled', true);
    } else if (this.get('gameState.compPlaying')) {
      color = this.get('compColor');
      player = 2;
      this.set('gameState.playerInputDisabled', true);
    }

    if (row >= 0) {
      let startX = col * 100 + 60;
      let startY = 60;
      let endY = row * 100 + 100;
      let duration = row * 100 + 50;

      board[row][col] = player;
      openCols[col]--;
      this.set('gameState.openCols', openCols);
      this.set('gameState.board', board);

      d3.select('#discs').append('circle')
        .attr('id', `disc-${row}-${col}`)
        .attr('cx', startX)
        .attr('cy', startY)
        .attr('r', 45)
        .attr('fill', color)
        .transition()
        .duration(duration)
        .ease(d3.easeCubicIn)
        .attrTween('transform', (d, i, a) => {
          return d3.interpolateString(`translate(0, ${startY})`, `translate(0, ${endY})`);
        })
        .on('end', () => {
          if (this.get('gameState.humanPlaying')) {
            this.get('gameState').setGameStatusToCompPlaying();

            this.get('gameState').sendGameState(col)
              .then((data) => {
                if (data.win_status === 1) {
                  this.set('gameState.humanWins', true);
                  this.set('gameState.playerInputDisabled', true);
                  this.highlightDiscs(data.winning_combo, 'player');
                } else if (data.win_status === 2) {
                  this.set('gameState.compWins', true);
                  this.set('gameState.playerInputDisabled', true);
                  this.highlightDiscs(data.winning_combo, 'comp');
                }
                this.insertDisc(data.best_move);
                this.set('gameState.disabled', false);
              })
              .catch(() => {
                // when something errored, give control back to the player. kind of pointless though.
                this.get('gameState').setGameStatusToHumanPlaying();
              });
          } else if (this.get('gameState.compPlaying')) {
            this.get('gameState').setGameStatusToHumanPlaying();
            this.get('gameState').sendGameState(col)
              .then((data) => {
                if (data.win_status === 1) {
                  this.set('gameState.humanWins', true);
                  this.set('gameState.playerInputDisabled', true);
                  this.highlightDiscs(data.winning_combo, 'player');
                } else if (data.win_status === 2) {
                  this.set('gameState.compWins', true);
                  this.set('gameState.playerInputDisabled', true);
                  this.highlightDiscs(data.winning_combo, 'comp');
                }
                this.set('gameState.disabled', false);
              })
              .catch(() => {
                this.get('gameState').setGameStatusToHumanPlaying();
              });
          }
        });
    }
  },

  highlightDiscs(winning_combo, player) {
    if (winning_combo.length) {
      let color;

      if (player === 'player') {
        color = this.get('playerWinColor');
      } else if (player === 'comp') {
        color = this.get('compWinColor');
      }

      for (let i = 0; i < winning_combo.length; i++) {
        let id = `#disc-${winning_combo[i][0]}-${winning_combo[i][1]}`;
        d3.select(`#discs ${id}`)
          .attr('fill', color);
        console.log(id);
      }
    }
  },

  actions: {
    columnClicked(index) {
      if (!this.get('gameState.disabled') &&
        !this.get('gameState.playerInputDisabled') &&
        !this.get('gameState.compWins') &&
        !this.get('gameState.humanWins')) {
        this.insertDisc(index);
      }
    }
  }
});
