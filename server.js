var server = require('webserver').create(),
	system = require('system'),
	fs     = require('fs'),
	port   = system.env.PORT || 8080;

var service = server.listen(port, function(request, response) {

	if(request.method == 'POST'){
		var url = request.post.url;
		response.statusCode = 200;
		// todo: stuff
		response.write("ok: " + url);
		response.close();

	} else {
		response.statusCode = 200;
		response.write(fs.read('index.html'));
		response.close();
	}

});

if(service) console.log("server started - http://localhost:" + server.port)