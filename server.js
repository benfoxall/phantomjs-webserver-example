var server = require('webserver').create(),
	system = require('system'),
	port   = system.env.PORT || 8080;

var service = server.listen(port, function(request, response) {
    response.statusCode = 200;
    response.write('<html><body>Hello!</body></html>');
    response.close();
});