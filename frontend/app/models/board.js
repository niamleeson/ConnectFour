import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  boardState: DS.attr(),
  openCols: DS.attr(),
  user: DS.belongsTo('user')
});
