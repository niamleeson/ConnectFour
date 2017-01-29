import Ember from 'ember';

export default Ember.Component.extend({
  gameState: Ember.inject.service(),
  classNames: ['connect-four-board'],
  classNameBindings: ['boardDisabled'],
  boardDisabled: Ember.computed('gameState.disabled', function () {
    return this.get('gameState.disabled');
  }),

  resetGame: Ember.observer('gameState.newGame', function () {
    if (this.get('gameState.newGame')) {
      this.$('#discs').empty();
    }
  }),

  insertDisc(index) {
    let openCols = this.get('gameState.openCols');
    let openCol = this.get('gameState.getOpenCol')(openCols, index);
    let board = this.get('gameState.board');
    let color, player;

    if (this.get('gameState.newGame')) {
      this.set('gameState.newGame', false);
    }

    if (this.get('gameState.humanPlaying')) {
      color = '#D32F2F';
      player = 1;
      this.set('gameState.playerInputDisabled', true);
    } else if (this.get('gameState.compPlaying')) {
      color = '#FFCA28';
      player = 2;
      this.set('gameState.playerInputDisabled', true);
    }

    if (openCol >= 0) {
      let startX = index * 100 + 60;
      let startY = 60;
      let endY = openCol * 100 + 100;
      let duration = openCol * 100 + 50;

      board[openCol][index] = player;
      openCols[index]--;
      this.set('gameState.openCols', openCols);
      this.set('gameState.board', board);

      d3.select('#discs').append('circle')
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

            this.get('gameState').requestCompPosition(index)
              .then((data) => {
                if (data.win_status === 1) {
                  this.set('gameState.humanWins', true);
                  this.set('gameState.playerInputDisabled', true);
                } else if (data.win_status === 2) {
                  this.set('gameState.compWins', true);
                  this.set('gameState.playerInputDisabled', true);
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
          }
        });
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
