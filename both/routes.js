Router.configure({
    layoutTemplate: 'layout',
});

Router.route('/', function () {
    this.render('projects');
}, {name: 'projects'});

Router.route('/project/:projectId', function () {
    const projectId = this.params.projectId;
    Session.set('selectedProject', projectId);
    this.render('sprints');
}, { name: 'sprints' });

Router.route('/sprint/:sprintId', function () {
    const sprintId = this.params.sprintId;
    Session.set('selectedSprint', sprintId);
    this.render('availabilities');
}, { name: 'availabilities' });