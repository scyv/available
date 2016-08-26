import { Template } from 'meteor/templating';
import {projectsHandle} from './main';


Template.projects.helpers({
    projectsLoading() {
        return !projectsHandle.ready();
    },
    projects() {
        return Projects.find();
    }
});

Template.projects.events({
    'click .btnCreateProject'(event, instance) {
        Session.set('selectedProject', undefined);
        $('#dlgEditProject').modal('show');
        return false;
    },
    'click .btnEditProject'(event, instance) {
        Session.set('selectedProject', this._id);
        $('#dlgEditProject').modal('show');
        return false;
    },
    'click .btnOpenSprints'() {
        Router.go('sprints', { projectId: this._id });
        return false;
    },
    'click tr.projectRow'() {
        Router.go('sprints', { projectId: this._id });        
    }
});