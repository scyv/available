import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { SessionProps} from "./sessionProperties"

Template.dlgEditProject.helpers({
    project() {
        const selectedProject = Session.get(SessionProps.SELECTED_PROJECT);
        if (selectedProject) {
            return Projects.findOne({ _id: selectedProject });
        }
        return {name: undefined, hoursPerDay: 8};
    }
});

Template.dlgEditProject.events({
    'click .btnSaveProject'() {
        const name = $('#projectNameInput').val();
        const hoursPerDay = parseInt($('#hoursPerDayInput').val());
        if (this._id) {
            Meteor.call('updateProject', this._id, name, hoursPerDay);
        } else {
            Projects.insert({ name: name, hoursPerDay: hoursPerDay, owner: Meteor.userId() });
        }
        $('#dlgEditProject').modal('hide');
    },
    'click .btnDelete'() {
        if (confirm("Wirklich löschen?")) {
            Meteor.call('removeProject', this._id);
            $('#dlgEditProject').modal('hide');
        }
    }
});

$(document).on('shown.bs.modal', '#dlgEditProject', () => {
    $('#projectNameInput').focus();
});