!function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return e[n].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function i(){m.listen(U,function(){console.log("Started http server on "+U)})}r(1);var s=r(2),u=n(s),a=r(3),c=n(a),l=r(4),f=n(l),d=r(5),p=n(d),h=r(6);r(7);var v=r(8),b=r(9),y=r(14),_=r(15),g=(0,u.default)(),m=new c.default.Server(g),w=(0,f.default)(m),k="production"!==process.env.NODE_ENV;if("true"===process.env.USE_WEBPACK){var O=r(17),j=r(18),M=r(19),C=r(20),x=M(C);g.use(O(x,{publicPath:"/build/",stats:{colers:!0,chunks:!1,assets:!1,timing:!1,modules:!1,hash:!1,version:!1}})),g.use(j(x)),console.log(p.default.bgRed("Using webPack Dev Middleware. This is for dev only!"))}g.set("view engine","jade"),g.use(u.default.static("public"));var E=!k;g.get("/",function(e,t){t.render("index",{useExternalStyles:E})});var P=[],S={},q=new b.UsersModule(w),R=new _.ChatModule(w,q),$=new y.PlaylistModule(w,q,S,P),A=[q,R,$];w.on("connection",function(e){console.log("Got connection from "+e.request.connection.remoteAddress);var t=new v.ObservableSocket(e),r=!0,n=!1,o=void 0;try{for(var i,s=A[Symbol.iterator]();!(r=(i=s.next()).done);r=!0){var u=i.value;u.registerClient(t)}}catch(e){n=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(n)throw o}}var a=!0,c=!1,l=void 0;try{for(var f,d=A[Symbol.iterator]();!(a=(f=d.next()).done);a=!0){var p=f.value;p.clientRegistered(t)}}catch(e){c=!0,l=e}finally{try{!a&&d.return&&d.return()}finally{if(c)throw l}}});var U=process.env.PORT||3e3;h.Observable.merge.apply(h.Observable,o(A.map(function(e){return e.init$()}))).subscribe({complete:function(){i()},error:function(e){console.error("Could not init module: "+(e.stack||e))}})},function(e,t){e.exports=require("source-map-support/register")},function(e,t){e.exports=require("express")},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("socket.io")},function(e,t){e.exports=require("chalk")},function(e,t){e.exports=require("rxjs")},function(e,t,r){"use strict";var n=r(6);n.Observable.prototype.safeSubscribe=function(e,t,r){var n=this.subscribe(function(t){try{e(t)}catch(e){console.error(e.stack||e),n.unsubscribe()}},t,r);return n},n.Observable.prototype.catchWrap=function(){return this.catch(function(e){return n.Observable.of({error:e})})}},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e){var t=new Error(e);return t.clientMessage=e,t}function i(e){return a.Observable.throw({clientMessage:e})}function s(){return c}Object.defineProperty(t,"__esModule",{value:!0}),t.ObservableSocket=void 0;var u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}();t.clientMessage=o,t.fail=i,t.success=s;var a=r(6),c=a.Observable.empty();t.ObservableSocket=function(){function e(t){var r=this;n(this,e),this._socket=t,this._state={},this._actionCallbacks={},this._requests={},this._nextRequestId=0,this.status$=a.Observable.merge(this.on$("connect").map(function(){return{isConnected:!0}}),this.on$("disconnect").map(function(){return{isConnected:!1}}),this.on$("reconnecting").map(function(e){return{isConnected:!1,isReconnecting:!0,attempt:e}}),this.on$("reconnect_fail").map(function(){return{isConnected:!1,isReconnecting:!1}})).publishReplay(1).refCount(),this.status$.subscribe(function(e){return r._state=e})}return u(e,[{key:"isConnected",get:function(){return this._state.isConnected}},{key:"isReconnecting",get:function(){return this._state.isReconnecting}},{key:"isTotallyDead",get:function(){return!this.isConnected&&!this.isReconnecting}}]),u(e,[{key:"on$",value:function(e){return a.Observable.fromEvent(this._socket,e)}},{key:"on",value:function(e,t){this._socket.on(e,t)}},{key:"off",value:function(e,t){this._socket.off(e,t)}},{key:"emit",value:function(e,t){this._socket.emit(e,t)}},{key:"emitAction$",value:function(e,t){var r=this._nextRequestId++;this._registerCallbacks(e);var n=this._requests[r]=new a.ReplaySubject(1);return this._socket.emit(e,t,r),n}},{key:"_registerCallbacks",value:function(e){var t=this;this._actionCallbacks.hasOwnProperty(e)||(this._socket.on(e,function(e,r){var n=t._popRequest(r);n&&(n.next(e),n.complete())}),this._socket.on(e+":fail",function(e,r){var n=t._popRequest(r);n&&n.error(e)}),this._actionCallbacks[e]=!0)}},{key:"_popRequest",value:function(e){this._requests.hasOwnProperty(e)||console.error("Event with "+e+" was returned twice, or the server did not send back an ID");var t=this._requests[e];return delete this._requests[e],t}},{key:"onAction",value:function(e,t){var r=this;this._socket.on(e,function(n,o){try{var i=t(n);if(!i)return void r._socket.emit(e,null,o);if("function"!=typeof i.subscribe)return void r._socket.emit(e,i,o);var s=!1;i.subscribe({next:function(t){if(s)throw new Error("Action "+e+" produced more than one value");r._socket.emit(e,t,o),s=!0},error:function(t){r._emitError(e,o,t),console.error(t.stack||t)},complete:function(){s||r._socket.emit(e,null,o)}})}catch(t){"undefined"!=typeof o&&r._emitError(e,o,t),console.error(t.stack||t)}})}},{key:"onActions",value:function(e){for(var t in e)e.hasOwnProperty(t)&&this.onAction(t,e[t])}},{key:"_emitError",value:function(e,t,r){var n=r&&r.clientMessage||"Fatal Error";this._socket.emit(e+":fail",{message:n},t)}}]),e}()},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function s(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.UsersModule=void 0;var u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=r(10),c=n(a),l=r(6),f=r(11),d=r(12),p=r(8),h=Symbol("AuthContext");t.UsersModule=function(e){function t(e){o(this,t);var r=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return r._io=e,r._userList=[],r._users={},r}return s(t,e),u(t,[{key:"getColorForUsername",value:function(e){var t=c.default.reduce(e,function(e,t){return t.charCodeAt(0)+(e<<6)+(e<<16)-e},0);t=Math.abs(t);var r=t%360,n=t%25+70,o=100-(t%15+35);return"hsl("+r+", "+n+"%, "+o+"%)"}},{key:"getUserForClient",value:function(e){var t=e[h];return t&&t.isLoggedIn?t:null}},{key:"loginClient$",value:function(e,t){t=t.trim();var r=(0,d.validateLogin)(t);if(!r.isValid)return r.throw$();if(this._users.hasOwnProperty(t))return(0,p.fail)("Username "+t+" is already taken");var n=e[h]||(e[h]={});return n.isLoggedIn?(0,p.fail)("You are already logged in"):(n.name=t,n.color=this.getColorForUsername(t),n.isLoggedIn=!0,this._users[t]=e,this._userList.push(n),this._io.emit("users:added",n),console.log("User "+t+" logged in"),l.Observable.of(n))}},{key:"logoutClient",value:function(e){var t=this.getUserForClient(e);if(t){var r=this._userList.indexOf(t);this._userList.splice(r,1),delete this._users[t.name],delete e[h],this._io.emit("users:removed",t),console.log("User "+t.name+" logged out")}}},{key:"registerClient",value:function(e){var t=this;e.onActions({"users:list":function(){return t._userList},"auth:login":function(r){var n=r.name;return t.loginClient$(e,n)},"auth:logout":function(){t.logoutClient(e)}}),e.on("disconnect",function(){t.logoutClient(e)})}}]),t}(f.ModuleBase)},function(e,t){e.exports=require("lodash")},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.ModuleBase=void 0;var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(6);t.ModuleBase=function(){function e(){n(this,e)}return o(e,[{key:"init$",value:function(){return i.Observable.empty()}},{key:"registerClient",value:function(e){}},{key:"clientRegistered",value:function(e){}}]),e}()},function(e,t,r){"use strict";function n(e){var t=new o.Validator;return e.length>=10&&t.error("Username must be fewer than 10 characters"),i.test(e)||t.error("Username can only contain numbers, digits, underscores and dashes"),t}Object.defineProperty(t,"__esModule",{value:!0}),t.USERNAME_REGEX=void 0,t.validateLogin=n;var o=r(13),i=t.USERNAME_REGEX=/^[\w\d_-]+$/},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.Validator=void 0;var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(6);t.Validator=function(){function e(){n(this,e),this._errors=[]}return o(e,[{key:"isValid",get:function(){return!this._errors.length}},{key:"errors",get:function(){return this._errors}},{key:"message",get:function(){return this._errors.join(", ")}}]),o(e,[{key:"error",value:function(e){this._errors.push(e)}},{key:"toObject",value:function(){return this.isValid?{}:{errors:this._errors,message:this.message}}},{key:"throw$",value:function(){return i.Observable.throw({clientMessage:this.message})}}]),e}()},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.PlaylistModule=void 0;var s=r(11);t.PlaylistModule=function(e){function t(e,r,i,s){n(this,t);var u=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return u._io=e,u._users=r,u._repository=i,u._services=s,u}return i(t,e),t}(s.ModuleBase)},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.ChatModule=void 0;var s=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),u=r(11),a=r(16),c=r(8),l=100,f=10;t.ChatModule=function(e){function t(e,r){n(this,t);var i=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return i._io=e,i._users=r,i._chatLog=[],i}return i(t,e),s(t,[{key:"sendMessage",value:function(e,t,r){t=t.trim();var n=(0,a.validateSendMessage)(e,t,r);if(!n.isValid)return n.throw$();var o={user:{name:e.name,color:e.color},message:t,time:(new Date).getTime(),type:r};this._chatLog.push(o),this._chatLog.length>=l&&this._chatLog.splice(0,f),this._io.emit("chat:added",o)}},{key:"registerClient",value:function(e){var t=this;e.onActions({"chat:list":function(){return t._chatLog},"chat:add":function(r){var n=r.message,o=r.type;o=o||"normal";var i=t._users.getUserForClient(e);return i?void t.sendMessage(i,n,o):(0,c.fail)("You must be logged in")}})}}]),t}(u.ModuleBase)},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t,r){var n=new u.Validator;return t.length>100&&n.error("Message must be smaller than 100 characters"),0===t.trim().length&&n.error("Message cannot be empty"),s.default.includes(a,r)||n.error("Invalid message type "+r),n}Object.defineProperty(t,"__esModule",{value:!0}),t.MESSAGE_TYPES=void 0,t.validateSendMessage=o;var i=r(10),s=n(i),u=r(13),a=t.MESSAGE_TYPES=["normal"]},function(e,t){e.exports=require("webpack-dev-middleware")},function(e,t){e.exports=require("webpack-hot-middleware")},function(e,t){e.exports=require("webpack")},function(e,t,r){"use strict";function n(e){var t=e?"eval-source-map":"source-map",r=[new i.optimize.CommonsChunkPlugin("vendor","vendor.js")],n={test:/\.css$/,loader:"style!css"},c={test:/\.scss$/,loader:"style!css!sass"},l=["./src/client/application.js"];return e?(r.push(new i.HotModuleReplacementPlugin),l.splice(0,0,"webpack-hot-middleware/client")):(r.push(new i.optimize.UglifyJsPlugin),r.push(new s("[name].css")),n.loader=s.extract("style","css"),c.loader=s.extract("style","css!sass")),{devtool:t,entry:{application:l,vendor:u},output:{path:o.join(a,"public","build"),filename:"[name].js",publicPath:"/build/"},resolve:{alias:{shared:o.join(a,"src","shared")}},module:{loaders:[{test:/\.js$/,loader:"babel",exclude:/node_modules/},{test:/\.js$/,loader:"eslint",exclude:/node_modules/},{test:/\.(png|jpg|jpeg|gif|woff|ttf|eot|svg|woff2)/,loader:"url-loader?limit=1024"},n,c]},plugins:r}}var o=r(21),i=r(19),s=r(22),u=["jquery","lodash","socket.io-client","rxjs","moment"],a=o.resolve("./");e.exports=n(!0),e.exports.create=n},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("extract-text-webpack-plugin")}]);
//# sourceMappingURL=server.js.map