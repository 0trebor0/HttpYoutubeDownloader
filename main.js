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
		switch( req.method ){
			case "GET":
				//console.log( parsed );
				if( parsed.pathname == '/video' ){
					if( ytdl.validateID( parsed.query.id ) ){
						//ytdl.getInfo( parsed.query.id, ( err, info )=>{} );
						//res.writeHead( 206, {'Content-Type' : 'video/mp4'} );
						//ytdl( "https://www.youtube.com/watch?v="+parsed.query.id ).pipe( res );
						//ytdl( parsed.query.mp4 ).pipe( fs.createWriteStream('./video.mp4') );
					} else if( ytdl.validateURL( parsed.query.url ) ){
						//ytdl.getInfo( parsed.query.id, ( err, info )=>{} );
						res.writeHead( 200, {'Content-Type' : 'video/mp4'} );
						ytdl( parsed.query.url ).pipe( res );
						//ytdl( parsed.query.mp4 ).pipe( fs.createWriteStream('./video.mp4') );
					}
				} else if( parsed.pathname == '/music' ){
					if( ytdl.validateID( parsed.query.id ) ){
						//res.writeHead( 206, {'Content-Type' : 'audio/mpeg'} );
						//ytdl( "https://www.youtube.com/watch?v="+parsed.query.id, { filter: 'audioonly' } ).pipe( res );
					} else if( ytdl.validateURL( parsed.query.url ) ){
						res.writeHead( 200, {'Content-Type' : 'audio/mpeg'} );
						ytdl( parsed.query.url, { filter: 'audioonly' } ).pipe( res );
					}
				} else {
					res.writeHead( 404, {'Content-Type' : 'text/html'} );
					res.write("hello");
					res.end();
				}
			break;
			case "POST":
				req.on( 'data', ( chunk )=>{} );
				req.on( 'end', ()=>{} );
			break;
			default:
				res.writeHead( 404, {'Content-Type' : 'text/html'} );
				res.write("hello");
				res.end();
			break;
		}
	} );
}catch( err ){
	console.log( err );
}