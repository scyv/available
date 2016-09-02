import { Meteor } from 'meteor/meteor'

Router.configure({
    layoutTemplate: 'layout',
});

Router.route('/', function () {
    if (Meteor.userId()) {
        this.render('projects');
    } else {
        this.render('login');
    }
}, { name: 'projects' });

Router.route('/login', function () {
    this.render('login');
}, { name: 'login' });

Router.route('/project/:projectId', function () {
    const projectId = this.params.projectId;
    if (!Meteor.userId()) {
        Meteor.subscribe("projects", projectId);
    }
    Session.set('selectedProject', projectId);
    this.render('sprints');
}, { name: 'sprints' });

Router.route('/sprint/:sprintId', function () {
    const sprintId = this.params.sprintId;
    if (!Meteor.userId()) {
        Meteor.subscribe("singleSprint", sprintId, () => {
            const projectId = Sprints.findOne().projectId;
            console.log(projectId);
            Meteor.subscribe("projects", projectId, () => {
                Session.set('selectedProject', projectId);
            });
        });
    }
    Session.set('selectedSprint', sprintId);
    this.render('availabilities');
}, { name: 'availabilities' });