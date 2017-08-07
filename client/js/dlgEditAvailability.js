import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating';
import { SessionProps} from "./sessionProperties"

Template.dlgEditAvailability.helpers({
    availabilityEntity() {
        $('#availabilityBaseHours').prop("checked", true);
        const selectedAvailability = Session.get(SessionProps.SELECTED_AVAILABILITY);
        let availability = {availability:0};
        if (selectedAvailability) {
            availability = Availabilities.findOne({ _id: selectedAvailability });
        }

        const sprint = Sprints.findOne({ _id: Session.get('selectedSprint') });
        if (sprint) {
            const project = Projects.findOne({ _id: Session.get('selectedProject') });
            availability.hoursPerDay = project.hoursPerDay;
            availability.sprintName = sprint.name;
            availability.sprintStart = sprint.start;
            availability.sprintEnd = sprint.stop;
        }
        return availability;
    }
});

Template.dlgEditAvailability.events({
    'change #availabilityBaseHours, change #availabilityBaseDays'() {
        const projectId = Session.get('selectedProject');
        const inputField = $('#availabilityInput');
        const availability = parseFloat(inputField.val());
        const project = Projects.findOne({ _id: projectId });
        if (project) {
            const hoursPerDay = project.hoursPerDay;
            if ($('#availabilityBaseHours').prop("checked")) {
                inputField.val((availability * hoursPerDay).toFixed(0));
            } else {
                inputField.val((availability / hoursPerDay).toFixed(0));
            }
        }
    },
    'click .btnSaveAvailability'() {
        const sprintId = Session.get('selectedSprint');
        const projectId = Session.get('selectedProject');

        const name = $('#developerNameInput').val();
        let availability = parseFloat($('#availabilityInput').val());

        if ($('#availabilityBaseDays').prop("checked")) {
            availability = availability * Projects.findOne({ _id: projectId }).hoursPerDay;
        }

        $('#availabilityBaseHours').prop("checked", true);

        const obj = { name, availability, sprintId, projectId };
        if (this._id) {
            Availabilities.update({ _id: this._id }, { $set: obj });
        } else {
            Availabilities.insert(obj);
        }
        $('#dlgEditAvailability').modal('hide');
    },
    'click .btnDelete'() {
        if (confirm("Wirklich löschen?")) {
            Meteor.call('removeAvailability', this._id);
            $('#dlgEditAvailability').modal('hide');
        }
    }
});

$(document).on('shown.bs.modal', '#dlgEditAvailability', () => {
    $('#developerNameInput').focus();
});