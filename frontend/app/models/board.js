import DS from 'ember-data';

export default DS.Model.extend({
  boardState: DS.attr(),
  openCols: DS.attr()
});
