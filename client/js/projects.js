import { Template } from 'meteor/templating';
import {projectsHandle} from './main';


Template.projects.helpers({
    projectsLoading() {
        return !projectsHandle.ready();
    },
    sps() {
        return Sprints.find({ projectId: this._id }).fetch()
        .reduce((pre, sprint) => (Math.abs(pre) + Math.abs(sprint.burnedSPs)), 0);
    },
    projects() {
        return Projects.find();
    }
});

Template.projects.events({
    'click .btnCreateProject'(event, instance) {
        Session.set('selectedProject', undefined);
        $('#dlgEditProject').modal('show');
    },
    'click .btnEditProject'(event, instance) {
        Session.set('selectedProject', this._id);
        $('#dlgEditProject').modal('show');
    },
    'click .btnOpenSprints'() {
        Router.go('sprints', { projectId: this._id });
    }
});