
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// DB Configuration
var conn = mongoose.connect('mongodb://spinidb:zxcpoimongohq@staff.mongohq.com:10023/subscriptions');

var StudentSchema = new Schema ({
  name: String
, surname: String
, email: String
, id: String
, gihub: String
, courses: {
    cg: Boolean, 
    bio: Boolean
  }
});

conn.model('student', StudentSchema);

var Student = mongoose.model('student');

// WebServer Configuration
var server = module.exports = express.createServer();

server.configure(function(){
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(express.static(__dirname + '/public'));
});

server.configure('development', function(){
  server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  server.listen(3000);
});

server.configure('production', function(){
  server.use(express.errorHandler());
  server.listen(80);
});

server.post('/register', function (req, res) {
  var student = req.body.student;
  student.courses = student.courses || {}; 
  student.courses.cg = !!student.courses.cg;
  student.courses.bio = !!student.courses.bio;

  student = new Student(student);
  
  student.save(function (err) {
    if (!err) res.redirect('/success.html');
    else console.log(err);
  });
});

console.log("Express server listening on port %d in %s mode", server.address().port, server.settings.env);
