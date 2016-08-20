import { Template } from 'meteor/templating';
import {availabilitiesHandle} from './main';


Template.availabilities.helpers({
    availabilitiesLoading() {
        return !availabilitiesHandle.ready();
    },
    availabilities() {
        return Availabilities.find();
    }
});

Template.availabilities.events({
    'click .btnAddAvailability'(event, instance) {
        Session.set('selectedAvailability', undefined);
        $('#dlgEditAvailability').modal('show');
    },
    'click .btnEditAvailability'(event, instance) {
        Session.set('selectedAvailability', this._id);
        $('#dlgEditAvailability').modal('show');
    }
});