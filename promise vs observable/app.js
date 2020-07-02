const { Observable } = require('rxjs');
const { takeWhile } = require('rxjs/operators');
console.clear();

/* The following example shows:
promises are eager and can handle only single value while
observables are lazy and can handle a stream of values*/

const promiseBehavior = new Promise(resolve => {
	let value = 0;
	console.log(`2. Promise:: Executing`);
	const promiseInterval = setInterval(() => {
		value++;
		if (value <= 5) {
			resolve(value);
		} else {
			clearInterval(promiseInterval);
		}
	}, 1000);
});

console.log(`1. Promise:: Subscribing`);
promiseBehavior.then(response => console.log(`3. Promise:: Result: ${response}`));

const observableBehavior = new Observable(observer => {
	let value = 0;
	console.log(`2. Observable:: Executing`);
	const observableInterval = setInterval(() => {
		value++;
		if (value <= 5) {
			observer.next(value);
		} else {
			clearInterval(observableInterval);
		}
	}, 1000);
});

console.log(`1. Observable:: Subscribing`);
observableBehavior.pipe(takeWhile(val => val <= 5)).subscribe(data => console.log(`3. Observable:: Result: ${data}`));
