import {Awesome as Awesome2, isThisAwesome } from 'src/test/awesome';

export type Awesome = Awesome2;

export default {
	test: () => { console.log("TEST"); },
	isThisAwesome
}
