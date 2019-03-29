import { Meteor } from "meteor/meteor"
import { Template } from "meteor/templating";
import { SessionProps} from "./sessionProperties";
import {availabilitiesHandle} from "./main";

Template.dlgEditAvailability.helpers({
    availabilitiesLoading() {
        return !availabilitiesHandle.ready();
    },
    availabilityEntity() {
        const selectedAvailability = Session.get(SessionProps.SELECTED_AVAILABILITY);
        let availability = {availability: 0};
        if (selectedAvailability) {
            availability = Availabilities.findOne({_id: selectedAvailability});
        }
        const sprint = Sprints.findOne({_id: Session.get(SessionProps.SELECTED_SPRINT)});
        if (sprint) {
            const project = Projects.findOne({_id: Session.get(SessionProps.SELECTED_PROJECT)});
            availability.hoursPerDay = project.hoursPerDay;
            availability.sprintName = sprint.name;
            availability.sprintStart = sprint.start;
            availability.sprintEnd = sprint.stop;
            availability.availability = availability.availability / project.hoursPerDay;
        }
        return availability;
    }
});

Template.dlgEditAvailability.events({
    "click .btnSaveAvailability"() {
        const sprintId = Session.get(SessionProps.SELECTED_SPRINT);
        const projectId = Session.get(SessionProps.SELECTED_PROJECT);

        const name = $("#developerNameInput").val();
        let availability = parseFloat($("#availabilityInput").val());        
        availability = availability * Projects.findOne({_id: projectId}).hoursPerDay;
        
        const obj = {name, availability, sprintId, projectId};
        if (this._id) {
            Availabilities.update({_id: this._id}, {$set: obj});
        } else {
            Availabilities.insert(obj);
        }
        $("#dlgEditAvailability").modal("hide");
    },
    "click .btnDelete"() {
        if (confirm("Wirklich löschen?")) {
            Meteor.call("removeAvailability", this._id);
            $("#dlgEditAvailability").modal("hide");
        }
    }
});

$(document).on("shown.bs.modal", "#dlgEditAvailability", () => {
    $("#developerNameInput").focus();
});