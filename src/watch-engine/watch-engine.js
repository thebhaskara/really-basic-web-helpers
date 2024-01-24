// @ts-check
export class WatchEngineFactory {
	watch(obj) {
		return new Proxy(obj, {
			get: (target, path) => {
				this.#addWatchesFor(target, path)
				return target[path]
			},
			set: (target, path, value) => {
				target[path] = value
				this.#triggerWatchesFor(target, path)
				return true
			},
		})
	}

	/** @type {Function[]} */
	#globalCallbackStack = []

	/** @type {WeakMap<Function, Set<Function>>} */
	#clearCallbacksByWrappedCallback = new WeakMap()

	trigger(cb) {
		/** @type {Set<Function>} */
		const clearCallbacks = new Set()

		const clear = () => {
			clearCallbacks.forEach((cb) => cb())
			clearCallbacks.clear()
		}

		const wrappedCallback = () => {
			clear()
			this.#globalCallbackStack.push(wrappedCallback)
			const ret = cb()
			if (ret && typeof ret === "function") {
				clearCallbacks.add(ret)
			}
			this.#globalCallbackStack.pop()
		}
		this.#clearCallbacksByWrappedCallback.set(wrappedCallback, clearCallbacks)
		this.#queueCallbacksToExecute(wrappedCallback)

		return clear
	}

	/** @type {WeakMap<any, Map<string|symbol, Function[]>>} */
	#wrappedCallbackByTargetByPath = new WeakMap()

	/**
	 *
	 * @param {any} target
	 * @param {string | symbol} path
	 */
	#addWatchesFor(target, path) {
		if (this.#globalCallbackStack.length === 0) return

		const wrappedCallback = this.#globalCallbackStack[this.#globalCallbackStack.length - 1]
		if (!wrappedCallback) return

		/** @type {Map<string|symbol, Function[]>} */
		const wrappedCallbackByTarget = this.#wrappedCallbackByTargetByPath.get(target) ?? new Map()
		this.#wrappedCallbackByTargetByPath.set(target, wrappedCallbackByTarget)

		const callbacks = wrappedCallbackByTarget.get(path) ?? []
		callbacks.push(wrappedCallback)
		wrappedCallbackByTarget.set(path, callbacks)

		const clearCallbacks = this.#clearCallbacksByWrappedCallback.get(wrappedCallback)
		if (clearCallbacks) {
			clearCallbacks.add(() => {
				callbacks.splice(callbacks.indexOf(wrappedCallback), 1)
				if (callbacks.length > 0) return
				wrappedCallbackByTarget.delete(path)
				if (wrappedCallbackByTarget.size > 0) return
				this.#wrappedCallbackByTargetByPath.delete(target)
			})
		}
	}

	/**
	 *
	 * @param {any} target
	 * @param {string | symbol} path
	 */
	#triggerWatchesFor(target, path) {
		const wrappedCallbackByTarget = this.#wrappedCallbackByTargetByPath.get(target)
		if (!wrappedCallbackByTarget) return
		const callbacks = wrappedCallbackByTarget.get(path)
		if (!callbacks) return
		this.#queueCallbacksToExecute(callbacks)
	}

	/** @type {Set<Function>} */
	#callbacksToExecute = new Set()
	#isExecutionQueued = false

	/**
	 *
	 * @param {Set<Function>|Function[]|Function} callbacks
	 */
	#queueCallbacksToExecute(callbacks) {
		if (typeof callbacks === "function") {
			this.#callbacksToExecute.add(callbacks)
		} else if (callbacks.forEach) {
			callbacks.forEach((cb) => {
				this.#callbacksToExecute.add(cb)
			})
		}
		if (this.#isExecutionQueued) return
		this.#isExecutionQueued = true
		queueMicrotask(() => {
			this.#callbacksToExecute.forEach((cb) => {
				try {
					cb()
				} catch (e) {
					console.error(e)
				}
			})
			this.#callbacksToExecute.clear()
			this.#isExecutionQueued = false
		})
	}
}

export const WatchEngine = new WatchEngineFactory()
export const watcher = WatchEngine
export const w = WatchEngine
