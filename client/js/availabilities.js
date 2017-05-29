import { Template } from 'meteor/templating';
import {availabilitiesHandle} from './main';
import { SessionProps} from "./sessionProperties"


Template.availabilities.helpers({
    selectedProject() {
        return Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    },
    selectedSprint() {
        return Sprints.findOne(Session.get(SessionProps.SELECTED_SPRINT));
    },
    availabilitiesLoading() {
        return !availabilitiesHandle.ready();
    },
    availabilities() {
        return Availabilities.find({sprintId: Session.get(SessionProps.SELECTED_SPRINT)});
    }
});

Template.availabilities.events({
    'click .btnAddAvailability'(event, instance) {
        Session.set(SessionProps.SELECTED_AVAILABILITY, undefined);
        $('#dlgEditAvailability').modal('show');
    },
    'click .btnEditAvailability'(event, instance) {
        Session.set(SessionProps.SELECTED_AVAILABILITY, this._id);
        $('#dlgEditAvailability').modal('show');
    }
});