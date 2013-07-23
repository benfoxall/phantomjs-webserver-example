var server = require('webserver').create();

var service = server.listen(8080, function(request, response) {
    response.statusCode = 200;
    response.write('<html><body>Hello!</body></html>');
    response.close();
});