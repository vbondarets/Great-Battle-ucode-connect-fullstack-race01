let WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'vbondaretskpostavnyiezubovych';
const Deck = require("./models/deck");
const PlayRoom = require('./playroom');


class PlayServer {
	rooms;
	clients;
	host;
	queuedClient;

	constructor(server) {
		let playServer = this;
		this.clients = new Map();
		this.rooms = new Set();
		this.host = new WebSocket.Server(server);
		this.host.on('connection', function(socket, req) {

			socket.user = req.user;
			socket.onclose = function (e) {
				if(socket == playServer.queuedClient) {
					playServer.queuedClient = undefined;
				}
			}
			socket.onmessage = function(e) {
				let message = e.data.toString();
				if(typeof message !== "string") {
					console.warn(`Invalid handshake message type: "${typeof message}" !== "string"`);
					return;
				};

				jwt.verify(message, accessTokenSecret, (err, user) => {
					if(err) {
						console.warn(err);
						return;
					}

					socket.user = user;
					playServer.clients.set(socket.user.id, socket);
					console.log(`User ${socket.user.login}#${socket.user.id} joined play server`);
					socket.onmessage = undefined;
					if(playServer.queuedClient) {
						new PlayRoom(playServer.queuedClient, socket);
						playServer.queuedClient = undefined;
					} else {
						playServer.queuedClient = socket;
					}
				});
			}
		});
	}
}

module.exports = PlayServer;