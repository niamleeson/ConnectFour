import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  currentUser: Ember.inject.service(),
  session: Ember.inject.service(),
  appState: Ember.inject.service(),
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
          this.get('currentUser').load();
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
      let credentials = {
        identification: newUser.get('email'),
        password: newUser.get('password')
      }

      newUser.save()
        .then((data) => {
          this.set('appState.currentUser', newUser);
          this.get('session')
            .authenticate('authenticator:jwt', credentials).then(() => {
              this.closeDialog();
            })
            .catch((reason) => {
              this.set('errorMessage', reason.error);
            });
        })
        .catch((error) => {
          this.set('errorMessage', 'User Already Exists');
        });
    }
  }
});
