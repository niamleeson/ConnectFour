import Ember from 'ember';

export default Ember.Service.extend({
  isShowingDialog: false,

  openDialog(dialogPath, dialogData) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.set('resolve', resolve);
      this.set('reject', reject);
      this.set('dialogData', dialogData);
      this.set('dialogPath', `dialogs/${dialogPath}`);
      this.set('isShowingDialog', true);
    })
  },
  
  closeDialog(returnData) {
    this.set('dialogData', null);
    this.set('dialogPath', null);
    this.set('isShowingDialog', false);
    this.get('resolve')(returnData);
  },

  closeDialogAndReject(returnData) {
    this.set('dialogData', null);
    this.set('dialogPath', null);
    this.set('isShowingDialog', false);
    this.get('reject')(returnData);
  }
});
