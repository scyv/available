import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish("projects", function () {
  return Projects.find({}); //, {fields: {secretInfo: 0}});
});

Meteor.publish("sprints", function (projectId) {
  return Sprints.find({projectId}); //, {fields: {secretInfo: 0}});
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
