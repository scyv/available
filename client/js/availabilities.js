import { Template } from 'meteor/templating';
import {availabilitiesHandle} from './main';
import { SessionProps} from "./sessionProperties"


function getSelectedSprint() {
    return Sprints.findOne(Session.get(SessionProps.SELECTED_SPRINT));
}

function getSprintVelocity() {
    const selectedSprint = getSelectedSprint();
    if (selectedSprint) {
        return selectedSprint.averageVelocity.toFixed(2);
    }
    return undefined;
}

Template.availabilities.helpers({
    selectedProject() {
        return Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
    },
    selectedSprint() {
        return getSelectedSprint();
    },
    availabilitiesLoading() {
        return !availabilitiesHandle.ready();
    },
    availabilities() {
        const availabilities = Availabilities.find({sprintId: Session.get(SessionProps.SELECTED_SPRINT)});
        const sprintVelocity = getSprintVelocity();
        const selectedProject = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
        let sumAvailability = 0;
        let sumPossibleStoryPoints = 0;
        availabilities.forEach((av)=> {
            const availabilityInDays = (av.availability / selectedProject.hoursPerDay);
            const possibleSP = (availabilityInDays * sprintVelocity);
            const avWindow = Session.get(SessionProps.AVAILABILITY_WINDOW);
            Session.set(SessionProps.AVAILABILITY_POSSIBLE_SP + av._id, possibleSP);

            if (avWindow.length === 0 || avWindow.includes(av._id)) {
                sumAvailability += availabilityInDays;
                sumPossibleStoryPoints += possibleSP;
            }
        });
        Session.set(SessionProps.AVAILABILITY_SUM,
            (selectedProject.hoursPerDay * sumAvailability).toFixed(0)
            + " / " + sumAvailability.toFixed(1));
        Session.set(SessionProps.AVAILABILITY_SP_SUM, sumPossibleStoryPoints.toFixed(2));

        return availabilities;
    },
    availability() {
        const selectedProject = Projects.findOne(Session.get(SessionProps.SELECTED_PROJECT));
        return this.availability + " / " + (this.availability / selectedProject.hoursPerDay).toFixed(1);
    },
    sprintVelocity() {
        return getSprintVelocity();
    },
    possibleSP() {
        const possibleSP = Session.get(SessionProps.AVAILABILITY_POSSIBLE_SP + this._id)
        if (!possibleSP) {
            return 0;
        }
        return possibleSP.toFixed(2);
    },
    availabilitySum() {
        return Session.get(SessionProps.AVAILABILITY_SUM);
    },
    storyPointSum() {
        return Session.get(SessionProps.AVAILABILITY_SP_SUM);
    }
});

Template.availabilities.onRendered(()=> {
    Session.set(SessionProps.AVAILABILITY_WINDOW, []);
});

Template.availabilities.events({
    'click .btnAddAvailability'(event, instance) {
        Session.set(SessionProps.SELECTED_AVAILABILITY, undefined);
        $('#dlgEditAvailability').modal('show');
    },
    'click .btnEditAvailability'(event, instance) {
        Session.set(SessionProps.SELECTED_AVAILABILITY, this._id);
        $('#dlgEditAvailability').modal('show');
    },
    'change .checkForSum'(evt) {
        let avWindow = Session.get(SessionProps.AVAILABILITY_WINDOW);
        if (evt.target.checked) {
            avWindow.push(this._id);
            $(evt.target).parentsUntil("tbody", "tr").addClass("for-calculation");
        } else {
            avWindow = _.without(avWindow, this._id);
            $(evt.target).parentsUntil("tbody", "tr").removeClass("for-calculation");
        }

        Session.set(SessionProps.AVAILABILITY_WINDOW, avWindow);
    },
    'click .btnSelectAll'() {
        $(".availabilityRow .checkForSum").not(":checked").click();
    },
    'click .btnSelectInvert'() {
        $(".availabilityRow .checkForSum").click();
    },
    'click .btnSelectNone'() {
        $(".availabilityRow .checkForSum:checked").click();
    }
});