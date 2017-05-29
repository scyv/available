import { Template } from 'meteor/templating';
import {projectsHandle} from './main';
import { SessionProps} from "./sessionProperties"


Template.projects.helpers({
    projectsLoading() {
        return !projectsHandle.ready();
    },
    projects() {
        return Projects.find();
    }
});

Template.projects.events({
    'click .btnCreateProject'() {
        Session.set(SessionProps.SELECTED_PROJECT, undefined);
        $('#dlgEditProject').modal('show');
        return false;
    },
    'click .btnEditProject'() {
        Session.set(SessionProps.SELECTED_PROJECT, this._id);
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