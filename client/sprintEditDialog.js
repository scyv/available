import { Template } from 'meteor/templating';
import "./sprintEditDialog.html";

Template.sprintEditDialog.onRendered(() => {
    $('#dateRange').daterangepicker({
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

Template.sprintEditDialog.events({
    'click button' (event, instance) {
        const dr = $('#dateRange').data('daterangepicker');
        console.log(dr.startDate);
        console.log(dr.endDate);
    },
});