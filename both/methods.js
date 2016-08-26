import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'removeProject'(projectId) {
        Availabilities.remove({projectId: projectId});
        Sprints.remove({projectId: projectId});
        Projects.remove(projectId);
    },
    'removeSprint'(sprintId) {
        Availabilities.remove({sprintId: sprintId});
        Sprints.remove(sprintId);
    },
    'removeAvailability'(availabilityId) {
        Availabilities.remove(availabilityId);
    }
});