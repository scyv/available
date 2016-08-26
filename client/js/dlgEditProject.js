import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'

Template.dlgEditProject.helpers({
    project() {
        let selectedProject = Session.get('selectedProject');
        let project = undefined;
        if (selectedProject) {
            return Projects.findOne({ _id: selectedProject });
        }
        return {};
    }
});

Template.dlgEditProject.events({
    'click .btnSaveProject'(event, instance) {
        const name = $('#projectNameInput').val();
        if (this._id) {
            Projects.update({ _id: this._id }, { $set: { name: name } });
        } else {
            Projects.insert({ name: name });
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

$(document).on('shown.bs.modal', '#dlgEditProject', function () {
    $('#projectNameInput').focus();
});