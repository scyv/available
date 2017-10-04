import { Meteor } from "meteor/meteor"
import { SessionProps} from "./sessionProperties"

Router.configure({
    layoutTemplate: "layout"
});

Router.route("/", function () {
    if (Meteor.userId()) {
        this.render("projects");
    } else {
        this.render("login");
    }
}, {name: "projects"});

Router.route("/login", function () {
    this.render("login");
}, {name: "login"});

Router.route("/project/:projectId", function () {
    const projectId = this.params.projectId;
    Meteor.subscribe("projects", projectId, () => {
        Session.set(SessionProps.SELECTED_PROJECT, projectId);
    });
    this.render("sprints");
}, {name: "sprints"});

Router.route("/sprint/:sprintId", function () {
    const sprintId = this.params.sprintId;
    Meteor.subscribe("singleSprint", sprintId, () => {
        const projectId = Sprints.findOne().projectId;
        Meteor.subscribe("projects", projectId, () => {
            Session.set(SessionProps.SELECTED_PROJECT, projectId);
            Session.set(SessionProps.SELECTED_SPRINT, sprintId);
        });
    });
    this.render("availabilities");
}, {name: "availabilities"});