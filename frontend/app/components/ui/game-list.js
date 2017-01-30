import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-list'],
  classNameBindings: ['selected'],
  selected: Ember.computed('selectedIndex', 'index', function () {
    if (this.get('selectedIndex') === this.get('index')) {
      return true;
    }
    return false;
  }),
  selectedIndex: null,
  index: null,
  board: null,
  click() {
    this.gameSelected(this.get('index'), this.get('board'));
  },

  actions: {
    deleteGame() {
      this.deleteGame(this.get('board'));
    }
  }
});
