import $ from "jquery";
import {ElementComponent} from "../../lib/component";

import "./player.scss";

class PlayerComponent extends ElementComponent {
	constructor() {
		super();
	}

	_onAttach() {
		const $title = this._$mount.find("h1");
		$title.text("Video player");

		const $player = this._$mount.find("div");
		$player.html('<iframe src="https://r2---sn-8xgp1vo-xfgd.googlevideo.com/videoplayback?id=23393a2587921ca1&itag=22&source=webdrive&requiressl=yes&ttl=transient&pl=18&ei=VdQ6WcDFO8K2qwWTtKTwDg&driveid=0ByEy7t4B9PtcYlFLdVhBR003Nlk&mime=video/mp4&lmt=1491044996515158&ip=2604:a880:0:1010::1b81:f001&ipbits=0&expire=1497042069&sparams=driveid,ei,expire,id,ip,ipbits,itag,lmt,mime,mip,mm,mn,ms,mv,pl,requiressl,source,ttl&signature=406B365E43C8775583892D5FF8400A90C4636009.143B9B535F9887267490F6178F298127A981E6F2&key=cms1&app=explorer&jparams=MTA4LjI3LjgyLjc=&upx=TW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTBfNSkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzU4LjAuMzAyOS4xMTAgU2FmYXJpLzUzNy4zNg&tr=2&cms_redirect=yes&mip=108.27.82.7&mm=31&mn=sn-8xgp1vo-xfgd&ms=au&mt=1497036458&mv=m#12" width="1000" height="500" frameborder="0" allowfullscreen></iframe>');
	}
}

let component;
try {
	component = new PlayerComponent();
	component.attach($("section.player"));
} catch (e) {
	console.error(e);
	if (component)
		component.detach();
}
finally {
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => component && component.detach());
	}
}
