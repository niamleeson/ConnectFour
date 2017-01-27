import Ember from 'ember';

export default Ember.Mixin.create({
  modalDialog: Ember.inject.service(),

  closeDialog(returnData) {
    this.get('modalDialog').closeDialog(returnData);
  },

  closeDialogAndReject(returnData) {
    this.get('modalDialog').closeDialogAndReject(returnData);
  }
});
