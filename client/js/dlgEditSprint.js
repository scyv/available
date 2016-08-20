import { Template } from 'meteor/templating';

Template.dlgEditSprint.helpers({
    sprint() {
        let selectedSprint = Session.get('selectedSprint');
        let sprint = undefined;
        if (selectedSprint) {
            return Sprints.findOne({ _id: selectedSprint });
        }
        return {name: 'Sprint X', burnedSPs:0};
    }
});

Template.dlgEditSprint.events({
    'click .btnSaveSprint'(event, instance) {
        const dateRange = $('#dateRangeInput').data('daterangepicker');
        const name = $('#sprintNameInput').val();
        const start = (dateRange.startDate).format();
        const stop = (dateRange.endDate).format();
        const burnedSPs = $('#burnedSPsInput').val();
        const projectId = Session.get('selectedProject');

        const obj = { name, start, stop, burnedSPs, projectId };

        console.log(obj);
        
        if (this._id) {
            Sprints.update({ _id: this._id }, { $set: obj });
        } else {
            Sprints.insert(obj);
        }
        $('#dlgEditSprint').modal('hide');
    }
});

$(document).on('shown.bs.modal', '#dlgEditSprint', function () {
    $('#sprintNameInput').focus();
});

Template.dlgEditSprint.onRendered(() => {
    $('#dateRangeInput').daterangepicker({
        "showWeekNumbers": true,
        "locale": {
            "format": "DD.MM.YYYY",
            "separator": " - ",
            "applyLabel": "Ok",
            "cancelLabel": "Abbruch",
            "fromLabel": "Von",
            "toLabel": "Bis",
            "customRangeLabel": "Benutzerdef.",
            "weekLabel": "W",
            "daysOfWeek": [
                "So",
                "Mo",
                "Di",
                "Mi",
                "Do",
                "Fr",
                "Sa"
            ],
            "monthNames": [
                "Januar",
                "Februar",
                "März",
                "April",
                "Mai",
                "Juni",
                "Juli",
                "August",
                "September",
                "Oktober",
                "November",
                "Dezember"
            ],
            "firstDay": 1
        }
    });
});
