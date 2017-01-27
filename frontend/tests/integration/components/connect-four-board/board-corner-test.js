import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('connect-four-board/board-corner', 'Integration | Component | connect four board/board corner', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{connect-four-board/board-corner}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#connect-four-board/board-corner}}
      template block text
    {{/connect-four-board/board-corner}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
