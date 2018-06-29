# webpack-worker-wrapper

You need [**worker-loader**](https://www.npmjs.com/package/worker-loader).
### Motivation
This wrapper can you help, when you need use your worker methods `async / await` style.
### How to use
**Install**:
npm - `npm install webpack-worker-wrapper --save`
yarn - `yarn add webpack-worker-wrapper`

**Example**:
```
// my.worker.js

function pow(num, exp) {
	return Math.pow(num, exp)
}

function sum(num1, num2) {
	return num1 + num2
}

self.addEventListener('message',  (event)  =>  {
	// message = { id: string, data: any, type: string }
	const message = event.data
	switch(message.type) {
		// type for identify function
		case 'pow':
			self.postMessage({
				id: message.id,
				success: true, // for resolve or reject for your async/await
				data: pow(...message.data), // if you send array, you can do such
			})
			break
		case 'sum':
			self.postMessage({
				id: message.id,
				success: true, // for resolve or reject for your async/await
				data: sum(...message.data), // if you send array, you can do such
			})
			break
	}
})

```
```
// example.js
import wrapper from 'webpack-worker-wrapper'
import MyWorker from './my.worker'

const worker = wrapper(MyWorker)

const example = async () => {
	console.log('start')
	console.log(
		await worker.postMessage({
			type: 'pow', // type for case
			data: [3, 7], // 3^7
		})
	)
	console.log(
		await worker.postMessage({
			type: 'sum', // type for case
			data: [3435, 6834], // 3435 + 6834
		})
	)
	console.log('end')
}

example()

```

**Options**
| Name | Type | Default | Description |
|--|--|--|--|
| timout | number | 60000 | How much need wait while send reject (in ms)
| logging | boolean | true | Need send to console log from the wrapper