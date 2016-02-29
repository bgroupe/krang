var http = require('http');
var server = http.createServer(function(request,response){});

server.listen(1234, function(){
	console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;

var wsServer = new WebSocketServer({
	httpServer: server
});

var count = 0;
var clients = {};

wsServer.on('request', function(r){
 // connection code
 var connection = r.accept('echo-protocol', r.origin); 
 //client id and increment
 var id = count++;
 clients[id] = connection
 console.log((new Date()) + '\sConnection accepted [' + id + ']');


connection.on('message', function(message){
	//string message that was sent
	var msgString = message.utf8Data;
	//Loop through all the clients
	for(var i in clients){
		//send message to the client with the message
		clients[i].sendUTF(msgString);
	}
});

connection.on('close', function(reasonCode, description){
	delete clients[id];
	console.log((new Date()) + '\sPeer\s' + connection.remoteAddress + 'disconnected.');
});

});

