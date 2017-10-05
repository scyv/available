import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    Projects.update({hoursPerDay: undefined}, {$set: {hoursPerDay: 8}}, {multi: true});
});

Meteor.publish("projects", function (projectId) {
    if (projectId) {
        return Projects.find({_id: projectId});
    }
    return Projects.find({owner: this.userId}); //, {fields: {secretInfo: 0}});
});

Meteor.publish("sprints", function (projectId) {
    return Sprints.find({projectId}); //, {fields: {secretInfo: 0}});
});

Meteor.publish("singleSprint", function (sprintId) {
    return Sprints.find({_id: sprintId}); //, {fields: {secretInfo: 0}});
});

Meteor.publish("availabilities", function (projectId) {
    return Availabilities.find({projectId}); //, {fields: {secretInfo: 0}});
});

const allowInsertUpdate = {
    'insert': function (userId, doc) {
        return true;
    },
    'update': function (userId, doc) {
        return true;
    }
};
Projects.allow(allowInsertUpdate);
Sprints.allow(allowInsertUpdate);
Availabilities.allow(allowInsertUpdate);
