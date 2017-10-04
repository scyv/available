import { Template } from 'meteor/templating';
import {availabilitiesHandle} from './main';
import { SessionProps} from "./sessionProperties"


function getSelectedSprint() {
    return Sprints.findOne(Session.get(SessionProps.SELECTED_SPRINT));
}

function getSprintVelocity() {
    getSelectedSprint().averageVelocity.toFixed(2);
}

Template.availabilities.helpers({
    selectedProject() {
        return Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    },
    selectedSprint() {
        return getSelectedSprint();
    },
    availabilitiesLoading() {
        return !availabilitiesHandle.ready();
    },
    availabilities() {
        return Availabilities.find({sprintId: Session.get(SessionProps.SELECTED_SPRINT)});
    },
    sprintVelocityDataAvailable() {
        return getSprintVelocity() !== undefined;
    },
    sprintVelocity() {
        return getSprintVelocity();
    },
    possibleSP() {
        const sprintVelocity = getSprintVelocity();
        const selectedProject = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));

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