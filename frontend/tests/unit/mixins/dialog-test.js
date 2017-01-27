import Ember from 'ember';
import DialogMixin from 'frontend/mixins/dialog';
import { module, test } from 'qunit';

module('Unit | Mixin | dialog');

// Replace this with your real tests.
test('it works', function(assert) {
  let DialogObject = Ember.Object.extend(DialogMixin);
  let subject = DialogObject.create();
  assert.ok(subject);
});
