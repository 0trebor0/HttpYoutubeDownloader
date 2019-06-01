const http = require('http');
const fs = require('fs');
const ytdl = require('ytdl-core');
const url = require('url');
const mime = require('mime-types');
try{
	const server = http.createServer();
	server.listen( 80 );
	server.on( 'listening', ()=>{
		console.log( "server started on port 80" );
	} );
	server.on( 'request', ( req, res )=>{
		let parsed = url.parse( req.url, true );
		console.log( req.socket.remoteAddress+" "+req.method+" "+req.url );
		switch( parsed.pathname ){
			case "/":
				res.writeHead( 404, {'Content-Type' : 'text/html'} );
				res.write("hello");
				res.end();
			break;
			default:
			break;
		}
	} );
}catch( err ){
	console.log( err );
}