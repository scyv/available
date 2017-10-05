import { Template } from "meteor/templating";
import {sprintsHandle} from "./main";
import {projectsHandle} from "./main";
import { SessionProps} from "./sessionProperties"

function sumAvailabilities(sprintId) {
    return Availabilities.find({sprintId})
        .fetch()
        .reduce((pre, av) => (Math.abs(pre) + Math.abs(av.availability)), 0);
}

function getVelocityWindow() {
    const selectedSprint = Sprints.findOne(Session.get(SessionProps.SELECTED_SPRINT));
    if (selectedSprint) {
        return selectedSprint.velocityWindow;
    }
    return undefined;
}

function calculatePossibleStoryPoints(sprint) {
    let sumVelocity = 0;
    let count = 0;
    let velocityWindow = sprint.velocityWindow;
    let collectedSprints = [];
    let velocityWindowIndex = 3;
    const project = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    Sprints.find({stop: {$lt: sprint.start}}, {sort: {start: -1}}).forEach((otherSprint) => {
        if (otherSprint.burnedSPs > 0) {
            if (velocityWindow) {
                if (velocityWindow.indexOf(otherSprint._id) < 0) {
                    return;
                }
            } else {
                if (velocityWindowIndex-- <= 0) {
                    return;
                }
                collectedSprints.push(otherSprint._id);
            }
            const availabilities = sumAvailabilities(otherSprint._id);
            if (availabilities > 0) {
                sumVelocity += otherSprint.burnedSPs / availabilities * project.hoursPerDay;
                count++;
            }
        }
    });
    if (count == 0) {
        sumVelocity = 1;
        count = 1;
    }
    const averageVelocity = sumVelocity / count;
    if (!velocityWindow) {
        updateVelocityWindow(sprint._id, collectedSprints);
    }
    if (sprint.averageVelocity !== averageVelocity) {
        updateAverageVelocity(sprint._id, averageVelocity);
    }
    const velocity = " (V: " + averageVelocity.toFixed(2) + ")";
    return ((averageVelocity * sumAvailabilities(sprint._id) / project.hoursPerDay).toFixed(2)) + velocity;
}

function updateVelocityWindow(sprintId, velocityWindow) {
    Sprints.update({_id: sprintId}, {$set: {velocityWindow: velocityWindow}}, (err)=> {
        if (err) {
            console.warn(err);
        }
    });
}

function updateAverageVelocity(sprintId, averageVelocity) {
    Sprints.update({_id: sprintId}, {$set: {averageVelocity: averageVelocity}}, (err)=> {
        if (err) {
            console.warn(err);
        }
    });
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
        if (Session.get("SPRINT_VIEW_RENDERED")) {
            return calculatePossibleStoryPoints(this);
        }
        return 0;
    },
    velocity() {
        const availabilities = sumAvailabilities(this._id);
        if (availabilities > 0) {
            return (this.burnedSPs * 8 / availabilities).toFixed(2);
        }
        return (0).toFixed(2);
    },
    useForVelocityCalculation() {
        let isUsedForCalculation = false;
        const velocityWindow = getVelocityWindow();
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
    "click .btnOpenAvailabilities"() {
        Session.set(SessionProps.SELECTED_SPRINT, this._id);
        Router.go("availabilities", {sprintId: this._id});
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
    }
});
