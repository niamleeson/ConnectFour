import Ember from 'ember';

export default Ember.Component.extend({
  gameState: Ember.inject.service(),
  classNames: ['connect-four-board'],

  resetGame: Ember.observer('gameState.newGame', function() {
    if (this.get('gameState.newGame')) {
      this.$('#discs').empty();
    }
  }),

  insertDisc(index) {
    let openRows = this.get('gameState.openRows');
    let openRow = this.get('gameState.getOpenRow')(openRows, index);
    let color;

    if (this.get('gameState.newGame')) {
      this.set('gameState.newGame', false);
    }

    if (this.get('gameState.humanPlaying')) {
      color = '#D32F2F';
      this.set('gameState.humanPlaying', false);
      this.set('gameState.compPlaying', true);
    } else if (this.get('gameState.compPlaying')) {
      color = '#FFCA28';
      this.set('gameState.humanPlaying', true);
      this.set('gameState.compPlaying', false);
    }

    if (openRow >= 0) {
      let startX = index * 100 + 60;
      let startY = 60;
      let endY = openRow * 100 + 100;
      let duration = openRow * 100 + 50;
      openRows[index]--;
      this.set('gameState.openRows', openRows);

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
          console.log('disc animation ended');
          this.get('gameState').requestCompPosition(index);
        });
    }
  },

  actions: {
    columnClicked(index) {
      this.insertDisc(index);
    }
  }
});
