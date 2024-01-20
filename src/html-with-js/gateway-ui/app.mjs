import { watcher } from "../../watch-engine/watch-engine.mjs";

export const App = watcher.watch({
	configurations: [{
		src: "sdfasdf",
		method: "asdfasdf",
	}],
	name: "Bhaskara"
})

export async function initApp() {
	let response = await fetch("http://localhost:3000/gateway/v1/configurations")
	let configurations = await response.json()
	// App.configurations = configurations
}