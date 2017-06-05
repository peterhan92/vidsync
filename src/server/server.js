import "source-map-support/register";

import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";
import {Observable} from "rxjs";

import {ObservableSocket} from "shared/observable-socket";

import {UsersModule} from "./modules/users";
import {PlaylistModule} from "./modules/playlist";
import {ChatModule} from "./modules/chat";

// --------------------------------------
// Setup
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

const isDevelopment = process.env.NODE_ENV !== "production";

// --------------------------------------
// Client Webpack
if (process.env.USE_WEBPACK === "true") {
	var webpackMiddleware = require("webpack-dev-middleware"),
		webpackHotMiddleware = require("webpack-hot-middleware"),
		webpack = require("webpack"),
		clientConfig = require("../../webpack.client");

	const compiler = webpack(clientConfig);
	app.use(webpackMiddleware(compiler, {
		publicPath: "/build/",
		stats: {
			colers: true,
			chunks: false,
			assets: false,
			timing: false,
			modules: false,
			hash: false,
			version: false
		}
	}));

	app.use(webpackHotMiddleware(compiler));
	console.log(chalk.bgRed("Using webPack Dev Middleware. This is for dev only!"));
}

// --------------------------------------
// Configure Express
app.set("view engine", "jade");
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
app.get("/", (req, res) => {
	res.render("index", { useExternalStyles });
});

// --------------------------------------
// Services
const videoServices = [];
const playlistRepository = {};


// --------------------------------------
// Modules
const users = new UsersModule(io);
const chat = new ChatModule(io, users);
const playlist = new PlaylistModule(io, users, playlistRepository, videoServices);
const modules = [users, chat, playlist];

// --------------------------------------
// Socket
io.on("connection", socket => {
	console.log(`Got connection from ${socket.request.connection.remoteAddress}`);

	const client = new ObservableSocket(socket);
	for (let mod of modules)
		mod.registerClient(client);

	for (let mod of modules)
		mod.clientRegistered(client);
});


// --------------------------------------
// Startup

const port = process.env.PORT || 3000;
function startServer() {
	server.listen(port, () => {
		console.log(`Started http server on ${port}`);
	});
}

Observable.merge(...modules.map(m => m.init$()))
	.subscribe({
		complete() {
			startServer();
		},

		error(error) {
			console.error(`Could not init module: ${error.stack || error}`);
		}
	});
