import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  registering: false,
  user: null,

  actions: {
    confirm() {
      this.closeDialog();
    },
    cancel() {
      this.closeDialogAndReject();
    },
    signIn() {
      let credentials = this.getProperties('identification', 'password');
      let authenticator = 'authenticator:jwt';

      this.get('session').authenticate(authenticator, credentials)
        .then(() => {
          this.closeDialog();
        })
        .catch((reason) => {
          this.set('errorMessage', reason.error || reason);
        });
    },
    signOut() {
      this.get('session').invalidate();
      this.closeDialog();
    },
    openRegisterForm() {
      this.set('registering', true);
      this.set('user', this.get('store').createRecord('user'));
    },
    saveNewUser() {
      let newUser = this.get('user');
      console.log(newUser);

      newUser.save()
        .then(() => {
          this.get('session')
            .authenticate('authenticator:jwt', newUser.get('email'), newUser.get('password'))
            .catch((reason) => {
              this.set('errorMessage', reason.error || reason);
            });
        })
        .catch((error) => {
          this.set('errorMessage', error);
        });
    }
  }
});
