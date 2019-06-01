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
			console.log( req.socket.remoteAddress+" "+req.method+" "+req.url );
			if( req.method == 'GET' ){
				switch( parsed.pathname ){
					case "/":
						if( ytdl.validateID( parsed.query.id ) ){
							ytdl.getInfo( parsed.query.id , ( err, info )=>{
								if( err ){
									console.log( err );
								} else {
									try{
										let video = ytdl.chooseFormat(info.formats, { quality: 'highest' });
										let audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
										if( video ){
											res.writeHead( 200, {'Content-Type' : 'text/html'} );
											res.write("<style>body{text-align:center;}</style>");
											res.write("<p><video src='"+video.url+"' controls></video></p>");
											res.write("<p><audio src='"+audio.url+"' controls/></p>");
											res.write("<p>Download video: <a href='"+video.url+"'>"+info.title+"</a></p>");
											res.write("<p>Download audio: <a href='"+audio.url+"'>"+info.title+"</a></p>");
											res.end();
										}
									}catch(err){
										console.log( err );
									}
								}
							} );
						} else {
							res.writeHead( 200, {'Content-Type' : 'text/html'} );
							res.write("<style>body{text-align:center;}</style>");
							res.write("<p><a href='/?id=PMGY8fLwess'>./?id=PMGY8fLwess</a></p>");
							res.end();
						}
					break;
					default:
						res.writeHead( 200, {'Content-Type' : 'text/html'} );
						res.write("<style>body{text-align:center;}</style>");
						res.write("<p><a href='/?id=PMGY8fLwess'>./?id=PMGY8fLwess</a></p>");
						res.end();
					break;
				}
			}
		});
	}
}