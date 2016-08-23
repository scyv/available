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
            sumVelocity += sprint.velocity;
            count++;
        });
        if (count == 0) {
            sumVelocity = 1;
            count = 1;
        }
        const averageVelocity = sumVelocity / count;
        return averageVelocity * sumAvailabilities(this._id);
    },
    velocity() {
        return 1;
    }
});

Template.sprints.events({
    'click .btnCreateSprint'(event, instance) {
        Session.set('selectedSprint', undefined);
        $('#dlgEditSprint').modal('show');
    },
    'click .btnEditSprint'(event, instance) {
        Session.set('selectedSprint', this._id);
        $('#dlgEditSprint').modal('show');
    },
    'click .btnOpenAvailabilities'() {
        Router.go('availabilities', { sprintId: this._id });
    }
});