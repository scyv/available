import { Meteor } from "meteor/meteor"
import { Template } from "meteor/templating"
import { SessionProps} from "./sessionProperties"

export let projectsHandle;
export let sprintsHandle;
export let availabilitiesHandle;

UI.registerHelper("formattedDate", (date) => {
    if (!date) {
        return "-";
    }
    return moment(date).format("DD.MM.YYYY");
});

Template.layout.events({
    "click .btn-logout"() {
        Meteor.logout();
    }
});

Meteor.startup(() => {
    moment.locale("de");

    Tracker.autorun(() => {
        const selectedProject = Session.get(SessionProps.SELECTED_PROJECT);
        projectsHandle = Meteor.subscribe("projects");
        sprintsHandle = Meteor.subscribe("sprints", selectedProject);
        availabilitiesHandle = Meteor.subscribe("availabilities", selectedProject);
    });
});