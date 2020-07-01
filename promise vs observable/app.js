const { Observable } = require('rxjs');
const { takeWhile } = require('rxjs/operators');

const promiseBehavior = () => {
	let value = 0;
	return new Promise(resolve => {
		const promiseInterval = setInterval(() => {
			value++;
			if (value <= 5) {
				resolve(value);
			} else {
				clearInterval(promiseInterval);
			}
		}, 1000);
	});
};

promiseBehavior().then(response => console.log(`Promise Log: ${response}`));

const observableBehavior = () => {
	let value = 0;
	return new Observable(observer => {
		const observableInterval = setInterval(() => {
			value++;
			if (value <= 5) {
				observer.next(value);
			} else {
				clearInterval(observableInterval);
			}
		}, 1000);
	});
};

observableBehavior().pipe(takeWhile(val => val <= 5)).subscribe(data => console.log(`Observable Log: ${data}`));
