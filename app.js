const http = require('http');
const fs = require('fs');
const ytdl = require('ytdl-core');
const url = require('url');
const mime = require('mime-types');
module.exports = {
	init:function( config ){
		this.server = http.createServer();
		this.server.listen( config.port );
		this.server.on( 'listening', ()=>{
			console.log( "server started on port "+config.port );
		} );
		this.server.on( 'request', ( req, res )=>{
			let parsed = url.parse( req.url, true );
			let postArray = {};
			console.log( req.socket.remoteAddress+" "+req.method+" "+req.url );
			if( req.method == 'GET' ){
				fs.createReadStream( __dirname+"/index.html" ).pipe( res );
			} else if( req.method == 'POST' ){
				req.on( 'data', ( chunk )=>{
					postArray[ req.socket.remoteAddress ] = [];
					postArray[ req.socket.remoteAddress ].push( chunk );
				} );
				req.on( 'end', ()=>{
					postArray[ req.socket.remoteAddress ] = JSON.parse( postArray[ req.socket.remoteAddress ] );
					console.log( postArray[ req.socket.remoteAddress ] );
					if( postArray[ req.socket.remoteAddress ].url == null || postArray[ req.socket.remoteAddress ].url == '' ){
						res.writeHead( 200, {'Content-Type' : 'application/json'} );
						res.write( JSON.stringify({"type":"error","msg":"invalid Format"}) );
						res.end();
					} else {
						if( ytdl.validateID( ytdl.getURLVideoID( postArray[ req.socket.remoteAddress ].url ) ) ){
							ytdl.getInfo( ytdl.getURLVideoID( postArray[ req.socket.remoteAddress ].url ) , ( err, info )=>{
								if( err ){
									console.log( err );
									res.writeHead( 200, {'Content-Type' : 'application/json'} );
									res.write( JSON.stringify({"type":"error","msg":err}) );
									res.end();
								} else {
									try{
										let video = ytdl.chooseFormat(info.formats, { quality: 'highest' });
										let audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
										if( video ){
											res.writeHead( 200, {'Content-Type' : 'application/json'} );
											res.write( JSON.stringify( {"video":[{"url":video.url,"resolution":video.resolution,"encoding":video.encoding}],"audio":[{"url":audio.url,"audioEncoding":audio.audioEncoding,"audioBitrate":audio.audioBitrate}]} ) );
											res.end();
											delete postArray[ req.socket.remoteAddress ];
										}
									}catch(err){
										console.log( err );
										res.writeHead( 200, {'Content-Type' : 'application/json'} );
										res.write( JSON.stringify({"type":"error","msg":err}) );
										res.end();
									}
								}
							} );
						}
					}
				} );
			}
		});
	}
}