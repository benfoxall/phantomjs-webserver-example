var server = require('webserver').create(),
	system = require('system'),
	fs     = require('fs'),
	port   = system.env.PORT || 8080;

var service = server.listen(port, function(request, response) {
    response.statusCode = 200;
    response.write(fs.read('index.html'));
    response.close();
});

