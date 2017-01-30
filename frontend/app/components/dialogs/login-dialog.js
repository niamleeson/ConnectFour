import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  store: Ember.inject.service(),
  currentUser: Ember.inject.service(),
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
          this.get('currentUser').load();
      //     this.get('session').authorize('authorizer:custom', (headerName, headerValue) => {
      //     const headers = {};
      //     headers[headerName] = headerValue;
      //     let data = {
            
      //     };

      //     this.get('ajax').request('/users', {
      //       headers,
      //       method: 'GET',
      //       data: data
      //     })
      //       .then((data) => {
      //         this.closeDialog(data);
      //         this.set('appState.flashMessage', 'Game Saved');
      //         this.set('appState.flashMessageType', 'success');
      //         this.set('appState.flashMessageShown', true);
      //       })
      //       .catch(() => {
      //         this.closeDialogAndReject();
      //         this.set('appState.flashMessage', 'Something went wrong :(');
      //         this.set('appState.flashMessageType', 'error');
      //         this.set('appState.flashMessageShown', true);
      //       });
      //   });

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
              this.set('errorMessage', reason.error || reason);
            });
        })
        .catch((error) => {
          this.set('errorMessage', error);
        });
    }
  }
});
