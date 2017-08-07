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
    },
    sprintVelocity() {
      return Session.get(SessionProps.SPRINT_VELOCITY +
          Session.get(SessionProps.SELECTED_SPRINT)).toFixed(2);
    },
    possibleSP() {
        const sprintVelocity = Session.get(SessionProps.SPRINT_VELOCITY +
            Session.get(SessionProps.SELECTED_SPRINT));
        const selectedProject= Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));

        return ((this.availability / selectedProject.hoursPerDay) * sprintVelocity).toFixed(2);
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