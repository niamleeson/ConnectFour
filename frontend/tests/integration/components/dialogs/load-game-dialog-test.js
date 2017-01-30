import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dialogs/load-game-dialog', 'Integration | Component | dialogs/load game dialog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{dialogs/load-game-dialog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#dialogs/load-game-dialog}}
      template block text
    {{/dialogs/load-game-dialog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
