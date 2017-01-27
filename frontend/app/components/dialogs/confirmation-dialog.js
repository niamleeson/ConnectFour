import Ember from 'ember';
import Dialog from 'frontend/mixins/dialog';

export default Ember.Component.extend(Dialog, {
  actions: {
    confirm() {
      this.closeDialog();
    },
    cancel() {
      this.closeDialogAndReject();
    }
  }
});
