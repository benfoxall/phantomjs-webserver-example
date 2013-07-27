var server = require('webserver').create(),
	system = require('system'),
	fs     = require('fs'),
	port   = system.env.PORT || 8080;

server.listen(port, function(request, response) {

	if(request.method == 'POST'){
		var url = request.post.url;
		
		load(url, function(properties, imageuri){
			response.statusCode = 200;
			response.write(JSON.stringify(properties));	
			response.write("\n");	
			response.write(imageuri);
			response.close();
		})

	} else {
		response.statusCode = 200;
		response.write(fs.read('index.html'));
		response.close();
	}

});

if(service) console.log("server started - http://localhost:" + server.port);

function load(url, callback){
	var page = new WebPage();

	page.onLoadStarted = function () {
		console.log('loading:' + url);
	};

	page.onLoadFinished = function (status) {
		console.log('loaded:' + url);

		var properties = page.evaluate(function () {
			return {
				title:document.title,
				links:Object.keys(
						[].reduce.call(
							document.querySelectorAll('a'), 
							function(memo, a){
								if(link.protocol.indexOf('http') === 0)memo[a.href] = true;
								return memo;
							}
						,{})
					)
			}
		});

		var imageuri = 'data:image/png;base64,' + page.renderBase64('png');

		callback(properties,imageuri);

		page.close();
	};
  page.open(url);

}
