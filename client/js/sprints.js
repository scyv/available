import { Template } from 'meteor/templating';
import {sprintsHandle} from './main';


Template.sprints.helpers({
    sprintsLoading() {
        return !sprintsHandle.ready();
    },
    sprints() {
        return Sprints.find();
    },
    availabilities() {
        const sprintId = this._id;
        return Availabilities.find({ sprintId })
            .fetch()
            .reduce((pre, av) => (Math.abs(pre) + Math.abs(av.availability)), 0);
    },
    possibleSps() {
        return 0;
    },
    velocity() {
        return 0;
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