const http = require('http');

var url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req,res) => {
	//console.log(url.parse(req.url).pathname);
	if (url.parse(req.url).pathname == '/favicon.ico') {
		res.statusCode = 204;
	} else {
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/plain');

		// error handling
		// incorrect json, incorrect fields

		try {
			// read json object from url
			reqJSON = JSON.parse(decodeURIComponent(url.parse(req.url).pathname.split('/')[1]));
		} catch(err) {
			console.error({"Error":"Could not decode request: JSON parsing failed"});
			res.end(JSON.stringify({"Error":"Could not decode request: JSON parsing failed"}));
			return ;
		}

		try {
			// payload has an array of property objects
			result = {"response":[]};
			if (reqJSON.payload == undefined) {
				throw "Missing payload object.";
			}
			reqJSON.payload.forEach(function(property) {
				if (property.type == undefined || property.workflow == undefined || property.address == undefined) {
					throw "Invalid property fields.";
				}
				if (property.type == "htv" && property.workflow == "completed") {
					// concat address
					var concatAddress = "";
					for (var field in property.address) {
						concatAddress += property.address[field] + " ";
					}
					concatAddress = concatAddress.trim();
					var temp = {"concartaddress":concatAddress,
						"type":"htv",
						"workflow":"completed"
					};
					result.response.push(temp);
				}
			})

			// return response
			console.log(result);
			res.end(JSON.stringify(result));
		} catch(err) {
			console.error({"Error":"Could not decode request: Incorrect fields"});
			res.end(JSON.stringify({"Error":"Could not decode request: Incorrect fields"}));
			return ;
		}

	}
});

server.listen(process.env.PORT || port, hostname, () => {
	console.log('server started');
});