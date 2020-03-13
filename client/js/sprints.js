import { Template } from "meteor/templating";
import { sprintsHandle } from "./main";
import { projectsHandle } from "./main";
import { SessionProps } from "./sessionProperties"

import { sumAvailabilities, calculatePossibleStoryPoints, updateVelocityWindow } from './calculation';

function getVelocityWindow() {
    const selectedSprint = Sprints.findOne(Session.get(SessionProps.SELECTED_SPRINT));
    if (selectedSprint) {
        return selectedSprint.velocityWindow;
    }
    return undefined;
}

function isUsedForCalculation(sprint) {
    let isUsedForCalculation = false;
    const velocityWindow = getVelocityWindow();
    if (velocityWindow) {
        isUsedForCalculation = velocityWindow.indexOf(sprint._id) >= 0;
    } else {
        isUsedForCalculation = false;
    }
    return isUsedForCalculation;
}

Template.sprints.helpers({
    selectedProject() {
        return Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    },
    sprintsLoading() {
        return !sprintsHandle.ready() || !projectsHandle.ready();
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
        return Sprints.find({}, { sort: { stop: -1 } });
    },
    availabilities() {
        const project = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
        return (sumAvailabilities(this._id) / project.hoursPerDay).toFixed(2);
    },
    noSps() {
        if (this.burnedSPs > 0) {
            return "";
        }
        return "noSps";
    },
    possibleSps() {
        if (Session.get("SPRINT_VIEW_RENDERED")) {
            const { velocity, possibleSP, fixed } = calculatePossibleStoryPoints(this);
            if (fixed) {
                return possibleSP.toFixed(2) + " (fixiert)";
            }
            return possibleSP.toFixed(2) + " (V: " + velocity.toFixed(2) + ")";
        }
        return 0;
    },
    velocity() {
        if (this.fixedPlanning) {
            return (this.burnedSPs / this.fixedPlanning).toFixed(2);
        } else {
            const project = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
            const availabilities = sumAvailabilities(this._id);
            if (availabilities > 0) {
                return (this.burnedSPs * project.hoursPerDay / availabilities / this.averageVelocity).toFixed(2);
            }
            return (0).toFixed(2);
        }
    },
    forCalcClass() {
        if (isUsedForCalculation(this)) {
            return "for-calculation";
        };
        return null;
    },
    useForVelocityCalculation() {
        return isUsedForCalculation(this);
    },
    checkForVelocityEnabled() {
        const selectedSprint = Session.get(SessionProps.SELECTED_SPRINT);
        if (selectedSprint) {
            return !!!Sprints.findOne(selectedSprint).fixedPlanning;
        }
        return false;
    },
    isFixed() {
        return !!this.fixedPlanning;
    }
});

Template.sprints.onRendered(() => {
    window.setTimeout(() => {
        const selectedSprintId = Session.get(SessionProps.SELECTED_SPRINT);
        if (selectedSprintId) {
            const selectedSprintElement = $(".sprint-" + selectedSprintId);
            selectedSprintElement.addClass("selected");
            const velocityWindow = getVelocityWindow();
            if (velocityWindow) {
                _.each(velocityWindow, (id) => {
                    const rowElement = $(".sprint-" + id);
                    rowElement.addClass("for-calculation");
                });
            }
        }

        // THIS IS A WORKAROUND FOR AN ISSUE IN THE BLAZE ENGINE
        Session.set("SPRINT_VIEW_RENDERED", true);
    }, 500);
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
    "click .btnFixPlanning"() {
        Session.set(SessionProps.SELECTED_SPRINT, this._id);
        $("#dlgFixPlanning").modal("show");
        return false;
    },
    "click .btnOpenAvailabilities"() {
        Session.set(SessionProps.SELECTED_SPRINT, this._id);
        Router.go("availabilities", { sprintId: this._id });
        return false;
    },
    "change .selectSprint"() {
        Session.set(SessionProps.SELECTED_SPRINT, this._id);
    },
    "change .checkForVelocity"(evt) {
        let velocityWindow = getVelocityWindow() || [];
        if (evt.target.checked) {
            velocityWindow.push(this._id);
        } else {
            velocityWindow = _.without(velocityWindow, this._id);
        }
        const selectedSprintId = Session.get(SessionProps.SELECTED_SPRINT);
        updateVelocityWindow(selectedSprintId, velocityWindow);
    },
    "click .btnReleaseFix"() {
        Meteor.call('fixPlanning', this._id, "");
    }
});
