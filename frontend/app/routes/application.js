import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

const { service } = Ember.inject;

export default Ember.Route.extend(ApplicationRouteMixin, {
  currentUser: service(),

  beforeModel() {
    return this.loadCurrentUser();
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this.loadCurrentUser().catch(() => this.get('session').invalidate());
  },

  loadCurrentUser() {
    return this.get('currentUser').load();
  }
});