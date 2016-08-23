import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

export let projectsHandle;
export let sprintsHandle;
export let availabilitiesHandle; 

UI.registerHelper('formattedDate', (date) => {
    if (!date) {
        return '-';
    }
    return moment(date).format('DD.MM.YYYY');
});


Meteor.startup(() => {
    moment.locale('de');

    Tracker.autorun(() => {
        projectsHandle = Meteor.subscribe("projects");
        sprintsHandle = Meteor.subscribe("sprints", Session.get('selectedProject'));
        availabilitiesHandle = Meteor.subscribe("availabilities", Session.get('selectedProject'));
    });
});