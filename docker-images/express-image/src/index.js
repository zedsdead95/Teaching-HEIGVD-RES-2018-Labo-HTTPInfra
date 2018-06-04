var Chance = require('chance');
var chance = new Chance();

console.log("Bonjour " + chance.name());

var express = require('express');
var app = express();

app.get('/',function(req,res){
	res.send(generateStudents());	
});

app.listen(3000,function(){
	console.log("Acception HTTP request on port 3000")
});

function generateStudents(){
	var numberOfStudents = chance.integer({
		min: 0, max: 10
	});
	console.log(numberOfStudents);
	var students = [];
	for(var i =0; i < numberOfStudents; i++){
		var gender = chance.gender();
		var birthYear = chance.year({
			min: 1986, max :1996
		});
		students.push({
			firstName: chance.first({
				gender: gender
			}),
			lastname : chance.last(), gender: gender,
			birthday: chance.birthday({
				year: birthYear
			})
		});
	};
	console.log(students);
	return students;
}