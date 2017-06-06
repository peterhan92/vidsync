var Rx = require("rxjs");

Rx.Observable.prototype.safeSubscribe = function(next, error, complete) {
	const subscription = this.subscribe(
		item => {
			try {
				next(item);
			} catch (e) {
				console.error(e.stack || e);
				subscription.unsubscribe();
			}
		}, error, complete);

	return subscription;
}

const hot = Rx.Observable.interval(1000)
	.publish();

hot.connect();

hot.subscribe(i => console.log(`One: ${i}`));
hot.subscribe(i => console.log(`Two: ${i}`));

setTimeout(() => {
	hot.subscribe(i => console.log(`Three: ${i}`));
}, 3000);

setTimeout(() => {
	hot.safeSubscribe(() => {
		throw new Error("What Now!?");
	});
}, 6000);