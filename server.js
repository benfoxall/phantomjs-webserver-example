var server = require('webserver').create(),
	system = require('system'),
	fs     = require('fs'),
	port   = system.env.PORT || 8080;

var service = server.listen(port, function(request, response) {

	if(request.method == 'POST' && request.post.url){
		var url = request.post.url;

		request_page(url, function(properties, imageuri){
			response.statusCode = 200;
			response.write(JSON.stringify(properties));	
			response.write("\n");	
			response.write(imageuri);
			response.close();
		})

	} else {
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/html; charset=utf-8');
		response.write(fs.read('index.html'));
		response.close();
	}

});

if(service) console.log("server started - http://localhost:" + server.port);

function request_page(url, callback){

	var page = new WebPage();
	page.clipRect = { top: 0, left: 0, width: 700, height: 400 };
	page.viewportSize = { width: 700, height: 400 };

	page.onLoadStarted = function () {
		console.log('loading:' + url);
	};

	page.onLoadFinished = function (status) {
		console.log('loaded:' + url);

		var properties = {};

		properties.title = page.evaluate(function () {
			return document.title
		});

		properties.links = page.evaluate(function () {
			return Object.keys(
					[].reduce.call(
						document.querySelectorAll('a'), 
						function(memo, a){
							if(a.protocol.indexOf('http') === 0) memo[a.href] = true;
							return memo;
						}
					,{})
				)
		});

		properties.link_areas = page.evaluate(function () {
			var sizes = [].reduce.call(document.querySelectorAll('a'), function(memo, a){
				var bb = a.getBoundingClientRect(),
					area = bb.width * bb.height,
					href = a.getAttribute('href');
			 
				// update the map
				if(area){
					memo[href] = (memo[href] || 0) + area;
				}
			 
				return memo;
			},{});

			return Object.keys(sizes).map(function(url){
				return [url, sizes[url]];
			});
		})

		setTimeout(function(){
			var imageuri = 'data:image/png;base64,' + page.renderBase64('png');

			callback(properties,imageuri);

			page.close();
		},100)
	};

	page.open(url);
}