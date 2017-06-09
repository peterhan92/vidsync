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
		$player.html('<iframe src="https://www60.playercdn.net/86/0/aZiMpb4G-v4JxBZPkmPuSQ/1497124563/170514/997ddFakys8jLEK.mp4" width="1000" height="500" frameborder="0" allowfullscreen></iframe>');
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
