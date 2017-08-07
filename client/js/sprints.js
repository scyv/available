import { Template } from "meteor/templating";
import {sprintsHandle} from "./main";
import { SessionProps} from "./sessionProperties"

const sumAvailabilities = (sprintId) => {
    return Availabilities.find({sprintId})
        .fetch()
        .reduce((pre, av) => (Math.abs(pre) + Math.abs(av.availability)), 0);
};

Template.sprints.helpers({
    selectedProject() {
        return Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    },
    sprintsLoading() {
        return !sprintsHandle.ready();
    },
    isSprintSelected() {
        const isSelected = Session.get(SessionProps.SELECTED_SPRINT) === this._id;
        const rowElement = $(".sprint-" + this._id);
        if (isSelected) {
            rowElement.addClass("selected");
        } else {
            rowElement.removeClass("selected");
        }
        return isSelected;
    },
    sprints() {
        return Sprints.find({}, {sort: {stop: -1}});
    },
    availabilities() {
        return sumAvailabilities(this._id);
    },
    noSps() {
        if (this.burnedSPs > 0) {
            return "";
        }
        return "noSps";
    },
    possibleSps() {
        let sumVelocity = 0;
        let count = 0;
        let velocityWindow = Session.get(SessionProps.VELOCITY_WINDOW + this._id);
        let collectedSprints = [];
        let velocityWindowIndex = 3;
        const project = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
        Sprints.find({stop: {$lt: this.start}}, {sort: {start: -1}}).forEach((sprint) => {
            if (sprint.burnedSPs > 0) {
                if (velocityWindow) {
                    if (velocityWindow.indexOf(sprint._id) < 0) {
                        return;
                    }
                } else {
                    if (velocityWindowIndex-- <= 0) {
                        return;
                    }
                    collectedSprints.push(sprint._id);
                }
                const availabilities = sumAvailabilities(sprint._id);
                if (availabilities > 0) {
                    sumVelocity += sprint.burnedSPs / availabilities * project.hoursPerDay;
                    count++;
                }
            }
        });
        if (count == 0) {
            sumVelocity = 1;
            count = 1;
        }
        if (!velocityWindow) {
            Session.set(SessionProps.VELOCITY_WINDOW + this._id, collectedSprints);
        }
        const averageVelocity = sumVelocity / count;
        const velocity = " (V: " + averageVelocity.toFixed(2) + ")";
        Session.set(SessionProps.SPRINT_VELOCITY + this._id, averageVelocity);
        return ((averageVelocity * sumAvailabilities(this._id) / project.hoursPerDay).toFixed(2)) + velocity;
    },
    velocity() {
        const availabilities = sumAvailabilities(this._id);
        if (availabilities > 0) {
            return (this.burnedSPs * 8 / availabilities).toFixed(2);
        }
        return (0).toFixed(2);
    },
    useForVelocityCalculation() {
        let velocityWindow = Session.get(SessionProps.VELOCITY_WINDOW
            + Session.get(SessionProps.SELECTED_SPRINT));
        let isUsedForCalculation = false;
        if (velocityWindow) {
            isUsedForCalculation = velocityWindow.indexOf(this._id) >= 0;
        } else {
            isUsedForCalculation = false;
        }

        const rowElement = $(".sprint-" + this._id);
        if (isUsedForCalculation) {
            rowElement.addClass("for-calculation");
        } else {
            rowElement.removeClass("for-calculation");
        }

        return isUsedForCalculation;
    }
});

Template.sprints.onRendered(() => {
    window.setTimeout(()=> {
        const selectedSprint = Session.get(SessionProps.SELECTED_SPRINT);
        const selectedSprintElement = $(".sprint-" + selectedSprint);
        selectedSprintElement.addClass("selected");
        const velocityWindow = Session.get(SessionProps.SELECTED_SPRINT + selectedSprint);
        _.each(velocityWindow, (id) => {
            const rowElement = $(".sprint-" + id);
            rowElement.addClass("for-calculation");
        });
    }, 100);
});

Template.sprints.events({
    "click .btnCreateSprint"() {
        Session.set(SessionProps.SELECTED_SPRINT, undefined);
        $("#dlgEditSprint").modal("show");
        return false;
    },
    "click .btnEditSprint"() {
        Session.set(SessionProps.SELECTED_SPRINT, this._id);
        $("#dlgEditSprint").modal("show");
        return false;
    },
    "click .btnOpenAvailabilities"() {
        Router.go("availabilities", {sprintId: this._id});
        return false;
    },
    "change .selectSprint"() {
        Session.set(SessionProps.SELECTED_SPRINT, this._id);
    },
    "change .checkForVelocity"(evt) {
        const selectedSprint = Session.get(SessionProps.SELECTED_SPRINT);
        let velocityWindow = Session.get(SessionProps.VELOCITY_WINDOW + selectedSprint);
        if (evt.target.checked) {
            velocityWindow.push(this._id);
        } else {
            velocityWindow = _.without(velocityWindow, this._id);
        }
        Session.set(SessionProps.VELOCITY_WINDOW + selectedSprint, velocityWindow);
    }
});
