import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { SessionProps } from "./sessionProperties"
import {sprintsHandle} from "./main";
import {projectsHandle} from "./main";

import {calculatePossibleStoryPoints} from  './calculation';

const getSelectedSprint = () => {
    const selectedSprintId = Session.get(SessionProps.SELECTED_SPRINT);
    let sprint = undefined;
    if (selectedSprintId) {
        sprint = Sprints.findOne({ _id: selectedSprintId });
    }
    return sprint;
};

Template.dlgFixPlanning.helpers({
    sprintsLoading() {
        return !sprintsHandle.ready() || !projectsHandle.ready();
    },
    sprint() {
        const sprint = getSelectedSprint();
        if (sprint) {
            return sprint;
        }
        return { name: 'Sprint X', burnedSPs: 0 };
    },
    plannedSp() {
        if (this.fixedPlanning) {
            return this.fixedPlanning;
        } else {
            const sprint = getSelectedSprint();
            if (!sprint) {
                return 0;
            }
            return calculatePossibleStoryPoints(sprint).possibleSP.toFixed(0);
        }
    }
});

Template.dlgFixPlanning.events({
    'click .btnFixPlanning'() {
        const plannedSp = $('#planningInput').val();
        if (this._id) {
            Meteor.call('fixPlanning', this._id, plannedSp)
        }
        $('#dlgFixPlanning').modal('hide');
    }
});

$(document).on('show.bs.modal', '#dlgFixPlanning', () => {
    const sprint = getSelectedSprint();
    if (sprint) {
        $('#planningInput').val();
    }
});

$(document).on('shown.bs.modal', '#dlgFixPlanning', () => {
    $('#planningInput').focus();
});


