//L.T. Marasinghe - IT 15 0190 28 - Weekend Batch
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors());

//Database logic
var students = require('./models/students');

//Database connection
mongoose.connect('mongodb://localhost/university');

//Database schemas for deparment and program objects
var departments = mongoose.model('departments', {id: String, name: String});
var programs = mongoose.model('programs', {id: String, name: String});

//Server Startup
app.listen(8080, function(error){
	console.log("[INFO] DEPARTEMENT API RUNNING ON http://localhost:8080/");
});

//Fetches all the departments
app.get("/departments", function(req, res){
	console.log("[ROUTE CALLED][GET] /departments");
	departments.find(function(error, departments){
		if(error){
			console.log("[ERROR] FETCHING DEPARTMENTS FROM DATABASE FAILED");
			res.end();
		}
		console.log("[DB] FETCHING DEPARTMENTS FROM DATABASE SUCCESS");
		res.json(departments);
	});
});

//Returns one department by the ID
app.get("/departments/:id", function(req, res){
	var reqId = req.params.id;
	console.log("[ROUTE CALLED][GET] /departments/" + reqId);
	departments.findOne({id: reqId}, function(error, departments){
		if(error){
			console.log("[ERROR] FETCHING ONE DEPARTMENT FROM DATABASE FAILED");
			res.end();
		}
		console.log("[DB] FETCHING ONE DEPARTMENT FROM DATABASE SUCCESS");
		res.json(departments);
	});
});

//Adds new department
app.post("/departments", function(req, res){
	console.log("[ROUTE CALLED][POST] /departments");

	var newDepartment = new departments(req.body);
	
	newDepartment.save(function (error, newDepartment){
		if(error){
			console.log("[ERROR] ADDING A NEW DEPARTMENT TO DATABASE FAILED");
			res.end();
		}
		console.log("[DB] ADDING A NEW DEPARTMENT TO DATABASE SUCCESS");
		res.json(newDepartment);
	});
});

//Returns programs belonging to a specific department
app.get("/departments/programs/:departmentId", function(req, res){
	var reqId = req.params.departmentId;
	console.log("[ROUTE CALLED][GET] /departments/programs/" + reqId);
	programs.find({dept: reqId}, function(error, departments){
		if(error){
			console.log("[ERROR] FETCHING PROGRAMS FROM DATABASE FAILED");
			res.end();
		}
		console.log("[DB] FETCHING PROGRAMS FROM DATABASE SUCCESS");
		res.json(departments);
	});
});

//Deletes on department
app.delete("/departments/:departmentId", function(req, res){
	var reqId = req.params.departmentId;
	console.log("[ROUTE CALLED][DELETE] /departments/" + reqId);
	departments.remove({id: reqId}, function(error){
		if(error){
			res.status(500);
			res.end();
		}
		res.status(200);
		res.end();
	});
});

//Updates department
app.put("/departments/:departmentId", function(req, res){
	var reqId = req.params.departmentId;
	console.log("[ROUTE CALLED][PUT] /departments/" + reqId);
	departments.findOne({id: reqId}, function(error, department){
		if(error){
			res.status(500)
			res.end();
		}
		department.name = req.body.name;
		department.save(function(error, department){
			if(error){
				res.status(500).end();
			}
			res.json(department);
		});
	});
});

//Returns all the students
app.get("/students", function(req, res){
	console.log("[ROUTE CALLED][GET] /students");
	students.getAllStudents(res);
});

//Add new student
app.post("/students", function(req, res){
	console.log("[ROUTE CALLED][POST] /students");
	students.addNewStudent(req.body, res);
});

app.get("/hello", function(req, res){
	//console.log("[ROUTE CALLED][POST] /hello");
	res.end("Hello World");
});

