import { Template } from 'meteor/templating';
import {sprintsHandle} from './main';

const sumAvailabilities = (sprintId) => {
    return Availabilities.find({sprintId})
        .fetch()
        .reduce((pre, av) => (Math.abs(pre) + Math.abs(av.availability)), 0);
};

Template.sprints.helpers({
    selectedProject() {
        return Projects.findOne(Session.get('selectedProject'));
    },
    sprintsLoading() {
        return !sprintsHandle.ready();
    },
    isSprintSelected() {
        return Session.get("selectedSprint") === this._id;
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
        let velocityWindow = Session.get("velocityWindow-" + this._id);
        let collectedSprints = [];
        let velocityWindowIndex = 3;
        const project = Projects.findOne(Session.get("selectedProject"));
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
            Session.set("velocityWindow-" + this._id, collectedSprints);
        }
        const averageVelocity = sumVelocity / count;
        return (averageVelocity * sumAvailabilities(this._id) / project.hoursPerDay).toFixed(2);
    },
    velocity() {
        const availabilities = sumAvailabilities(this._id);
        if (availabilities > 0) {
            return (this.burnedSPs * 8 / availabilities).toFixed(2);
        }
        return (0).toFixed(2);
    },
    useForVelocityCalculation() {
        let velocityWindow = Session.get("velocityWindow-" + Session.get("selectedSprint"));
        if (!velocityWindow) return false;
        return velocityWindow.indexOf(this._id) >= 0;
    }
});

Template.sprints.events({
    'click .btnCreateSprint'() {
        Session.set('selectedSprint', undefined);
        $('#dlgEditSprint').modal('show');
        return false;
    },
    'click .btnEditSprint'() {
        Session.set('selectedSprint', this._id);
        $('#dlgEditSprint').modal('show');
        return false;
    },
    'click .btnOpenAvailabilities'() {
        Router.go('availabilities', {sprintId: this._id});
        return false;
    },
    'change .selectSprint'() {
        Session.set("selectedSprint", this._id);
    },
    'change .checkForVelocity'(evt) {
        let velocityWindow = Session.get("velocityWindow-" + Session.get("selectedSprint"));
        if(evt.target.checked) {
            velocityWindow.push(this._id);
        } else {
            velocityWindow = _.without(velocityWindow, this._id);
        }
        Session.set("velocityWindow-" + Session.get("selectedSprint"), velocityWindow);
    }
});