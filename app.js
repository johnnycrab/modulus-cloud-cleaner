
http = require('http');
fs = require('fs');
path = require('path');

root = process.env.CLOUD_DIR;

http.createServer(function (req, res) {

	// list
	if (req.url == '/') {
		res.writeHead(200, {'Content-Type': 'text/html'});

		var response = '<pre>FILES IN ' + process.env.CLOUD_DIR + ': \n';
		response += '------------------\n\n';

		var readDir = function (dpath) {
			var filenames = fs.readdirSync(dpath);
			filenames.forEach(function (filename) {
				var thePath = path.join(dpath, filename);
				if (fs.lstatSync(thePath).isDirectory()) {
					response += '\n\n' + thePath.toUpperCase() + '\n';
					response += '\n';
					readDir(thePath);
				} else {
					response += filename + '\n';
				}
			});
		};

		readDir(root);
		 
		response += '</pre>\n\n<a href="/clean">Clean it up!</a>';

		res.end(response);

	//delete
	} else if (req.url == '/clean') {
	
		res.writeHead(200, {'Content-Type': 'text/plain'});

		var deleteDir = function (dpath) {
			var filenames = fs.readdirSync(dpath);
			filenames.forEach(function (filename) {
				var thePath = path.join(dpath, filename);
				if (fs.lstatSync(thePath).isDirectory()) {
					deleteDir(thePath);
					fs.rmdirSync(thePath);
				} else {
					fs.unlinkSync(thePath);
				}
			});
			
		};

		deleteDir(root);

		res.end('Done.');
	}

  
}).listen(process.env.PORT);