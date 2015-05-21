var fs = require("fs");
var express = require('express');
var bodyParser = require("body-parser");
var exec = require('child_process').exec;
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(request, response) {
	response.sendFile('./public/index.html');
});

app.post('/',function(req,res){
	var id = makeid();
	fs.writeFile("./public/" + id, req.body.code, function(err){
		if(err) {
			console.error(err);
		} else {
			exec("AStyle "+"./public/"+id, function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
				fs.readFile("./public/"+id, function (err, data) {
					err?console.error(err):res.end(data, function(){
						fs.unlink("./public/"+id, function(err){
							if (err){
								console.error(err);
							} else {
								fs.unlink("./public/"+id+".orig", function(err){
									console.error(err);
								});
							}
						});
					});
				});
			});
		}
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});

function makeid()
{
	return Math.random().toString(36).substring(7);
}

// , function(){
// 				// fs.unlink("./public/"+id, function(err){
// 				// 	if (err) console.log(err);
// 				// });
// 				}