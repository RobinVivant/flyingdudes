
 Router.configure({
     layoutTemplate: 'layout',
     loadingTemplate: 'loading',
     waitOn: function() { }
 });

 Router.map(function() {
     this.route('home', {path: '/'});
     this.route('play', {path: '/play'});
     this.route('about', {path: '/about'});
     this.route('leroux', {path: '/leroux'});
 });
