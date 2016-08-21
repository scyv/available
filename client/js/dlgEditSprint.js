import { Template } from 'meteor/templating';

const getSelectedSprint = () => {
    let selectedSprintId = Session.get('selectedSprint');
    let sprint = undefined;
    if (selectedSprintId) {
        sprint = Sprints.findOne({ _id: selectedSprintId });
    }
    return sprint;
};

Template.dlgEditSprint.helpers({
    sprint() {
        let sprint = getSelectedSprint();
        if (sprint) {
            return sprint;
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

        if (this._id) {
            Sprints.update({ _id: this._id }, { $set: obj });
        } else {
            Sprints.insert(obj);
        }
        $('#dlgEditSprint').modal('hide');
    }
});

$(document).on('show.bs.modal', '#dlgEditSprint', () => {
    const sprint = getSelectedSprint();
        const dateRange = $('#dateRangeInput').data('daterangepicker');
    if (sprint) {
        const format = dateRange.locale.format;
        const separator = dateRange.locale.separator;
        dateRange.startDate = moment(sprint.start);
        dateRange.endDate = moment(sprint.stop);
        $('#dateRangeInput').val(moment(sprint.start).format(format) + separator + moment(sprint.stop).format(format));
    } else {
        $('#dateRangeInput').val('');
        dateRange.startDate = moment();
        dateRange.endDate = moment();
    }
});

$(document).on('shown.bs.modal', '#dlgEditSprint', () => {
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
