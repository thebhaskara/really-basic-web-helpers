import { WatchEngineFactory } from "./watch-engine.mjs"
import assert from "assert" // Import assert

describe("WatchEngine", () => {
	/** @type {WatchEngineFactory} */
	let watchEngine
	/** @type {any} */
	let obj

	beforeEach(() => {
		watchEngine = new WatchEngineFactory()
		obj = {
			name: "John",
			age: 30,
		}
	})

	it("normal setting should work", (done) => {
		const watchedObj = watchEngine.watch(obj)

		// Change the name property
		watchedObj.name = "Jane"
		assert.strictEqual(obj.name, "Jane")

		// Change the age property
		watchedObj.age = 40
		assert.strictEqual(obj.age, 40)
		done()
	})

	it("should trigger watches when properties are accessed", (done) => {
		let i = 0
		const watchedObj = watchEngine.watch(obj)
		// console.log("🚀 ~ 34 watchEngine.trigger ~ watchedObj.name:", watchedObj.name)
		watchEngine.trigger(() => {
			// this will ensure that watchedObj.name is watched
			watchedObj.name
			if (i === 0) {
				assert.strictEqual(watchedObj.name, "John")
			}

			if (i === 1) {
				assert.strictEqual(watchedObj.name, "Busam")
				done()
			}
			i++
		})

		setTimeout(() => {
			watchedObj.name = "Busam"
		}, 1000)
	})
})
