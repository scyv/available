import { Template } from 'meteor/templating';
import {sprintsHandle} from './main';

const sumAvailabilities = (sprintId) => {
    return Availabilities.find({ sprintId })
        .fetch()
        .reduce((pre, av) => (Math.abs(pre) + Math.abs(av.availability)), 0);    
}

Template.sprints.helpers({
    selectedProject() {
        return Projects.findOne(Session.get('selectedProject'));
    },
    sprintsLoading() {
        return !sprintsHandle.ready();
    },
    sprints() {
        return Sprints.find({}, { sort: {stop: -1}});
    },
    availabilities() {
        return sumAvailabilities(this._id);
    },
    possibleSps() {
        let sumVelocity = 0;
        let count = 0;
        Sprints.find({ stop: { $lt: this.start } }).forEach((sprint) => {
            const availabilities = sumAvailabilities(sprint._id);
            if (availabilities > 0) {
                sumVelocity += sprint.burnedSPs / availabilities * 8;
                count++;
            }
        });
        if (count == 0) {
            sumVelocity = 1;
            count = 1;
        }
        const averageVelocity = sumVelocity / count;
        return (averageVelocity * sumAvailabilities(this._id) / 8).toFixed(2);
    },
    velocity() {
        const availabilities = sumAvailabilities(this._id);
        if (availabilities > 0) {
            return (this.burnedSPs * 8 / availabilities).toFixed(2);
        }
        return (0.00).toFixed(2);
    }
});

Template.sprints.events({
    'click .btnCreateSprint'(event, instance) {
        Session.set('selectedSprint', undefined);
        $('#dlgEditSprint').modal('show');
        return false;
    },
    'click .btnEditSprint'(event, instance) {
        Session.set('selectedSprint', this._id);
        $('#dlgEditSprint').modal('show');
        return false;
    },
    'click .btnOpenAvailabilities'() {
        Router.go('availabilities', { sprintId: this._id });
        return false;
    },
    'click tr.sprintRow'() {
        Router.go('availabilities', { sprintId: this._id });        
    }
});