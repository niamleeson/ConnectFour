import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('dialogs/save-game-dialog', 'Integration | Component | dialogs/save game dialog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{dialogs/save-game-dialog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#dialogs/save-game-dialog}}
      template block text
    {{/dialogs/save-game-dialog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
