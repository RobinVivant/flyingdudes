
Meteor.publish('balls', function() {
  return Balls.find();
});
