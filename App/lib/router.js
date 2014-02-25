
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { /*return Meteor.subscribe('posts');*/ }
});


Router.map(function() {
  this.route('home', {path: '/'});
  this.route('play', {path: '/play'});
  this.route('about', {path: '/about'});
});