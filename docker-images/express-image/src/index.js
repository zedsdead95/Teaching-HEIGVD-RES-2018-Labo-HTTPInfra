var Chance = require('chance');
var chance = new Chance();

console.log("Salutations " + chance.name() + " utilisateur de docker !");

var express = require('express');
var app = express();

app.get('/',function(req,res){
	res.send(generateDockerContainerName());	
});

app.listen(3000,function(){
	console.log("Acception HTTP request on port 3000")
});

function generateDockerContainerName(){
	var numberOfDockerContainer = chance.integer({
		min: 2, max: 10
	});
	console.log("You have actually " + numberOfDockerContainer + " docker containers running ");
	var containers = [];
	for(var i =0; i < numberOfDockerContainer; i++){
		var animal = chance.animal();
		var hash = chance.hash({
			length: 20,
		});
		containers.push({
			containerName : animal,
			containerHash : hash,
		});
	};
	console.log(containers);
	return containers;
}