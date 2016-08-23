import { Template } from 'meteor/templating';
import {availabilitiesHandle} from './main';


Template.availabilities.helpers({
    selectedProject() {
        return Projects.findOne(Session.get('selectedProject'));
    },
    selectedSprint() {
        return Sprints.findOne(Session.get('selectedSprint'));
    },
    availabilitiesLoading() {
        return !availabilitiesHandle.ready();
    },
    availabilities() {
        return Availabilities.find({sprintId: Session.get('selectedSprint')});
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