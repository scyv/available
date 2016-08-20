import { Template } from 'meteor/templating';

Template.dlgEditAvailability.helpers({
    availabilityEntity() {
        let selectedAvailability = Session.get('selectedAvailability');
        let availability = undefined;
        if (selectedAvailability) {
            return Availabilities.findOne({ _id: selectedAvailability });
        }
        return {availability:0};
    }
});

Template.dlgEditAvailability.events({
    'click .btnSaveAvailability'(event, instance) {
        const name = $('#developerNameInput').val();
        const availability = $('#availabilityInput').val();
        const sprintId = Session.get('selectedSprint');
        const obj = { name, availability, sprintId };
        if (this._id) {
            Availabilities.update({ _id: this._id }, { $set: obj });
        } else {
            Availabilities.insert(obj);
        }
        $('#dlgEditAvailability').modal('hide');
    }
});

$(document).on('shown.bs.modal', '#dlgEditAvailability', function () {
    $('#developerNameInput').focus();
});