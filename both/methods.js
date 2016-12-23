import { Meteor } from 'meteor/meteor'

Meteor.methods({
    'updateProject'(projectId, name, hoursPerDay) {
        Projects.update({ _id: projectId, owner: this.userId }, { $set: { name: name, hoursPerDay: hoursPerDay } });
    },
    'removeProject'(projectId) {
        const project = Projects.findOne({ _id: projectId, owner: this.userId });
        if (project) {
            Availabilities.remove({ projectId: projectId });
            Sprints.remove({ projectId: projectId });
            Projects.remove(projectId);
        }
    },
    'removeSprint'(sprintId) {
        const project = Projects.findOne({ _id: Sprints.findOne(sprintId).projectId, owner: this.userId });
        if (project) {
            Availabilities.remove({ sprintId: sprintId });
            Sprints.remove(sprintId);
        }
    },
    'removeAvailability'(availabilityId) {
        const project = Projects.findOne({ _id: Availabilities.findOne(availabilityId).projectId, owner: this.userId });
        if (project) {
            Availabilities.remove(availabilityId);
        }            
    }
});