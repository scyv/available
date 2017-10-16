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
    this.wait(Meteor.subscribe("projects", projectId, () => {
        Session.set(SessionProps.SELECTED_PROJECT, projectId);
        Session.set("SPRINT_VIEW_RENDERED", false);
    }));
    if (this.ready()) {
        this.render("sprints");
    } else {
        this.render("loading");
    }

}, {name: "sprints"});

Router.route("/sprint/:sprintId", function () {
    const sprintId = this.params.sprintId;
    this.wait(Meteor.subscribe("singleSprint", sprintId, () => {
        const projectId = Sprints.findOne().projectId;
        this.wait(Meteor.subscribe("projects", projectId, () => {
            Session.set(SessionProps.SELECTED_PROJECT, projectId);
            Session.set(SessionProps.SELECTED_SPRINT, sprintId);
        }));
    }));
    if (this.ready()) {
        this.render("availabilities");
    } else {
        this.render("loading");
    }
}, {name: "availabilities"});