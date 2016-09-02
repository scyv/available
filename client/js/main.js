import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Template } from 'meteor/templating';

export let projectsHandle;
export let sprintsHandle;
export let availabilitiesHandle; 

UI.registerHelper('formattedDate', (date) => {
    if (!date) {
        return '-';
    }
    return moment(date).format('DD.MM.YYYY');
});

Template.layout.events({
    'click .btn-logout'() {
        Meteor.logout();
    }
}),

Meteor.startup(() => {
    moment.locale('de');

    Tracker.autorun(() => {
        projectsHandle = Meteor.subscribe("projects");
        sprintsHandle = Meteor.subscribe("sprints", Session.get('selectedProject'));
        availabilitiesHandle = Meteor.subscribe("availabilities", Session.get('selectedProject'));
    });
});