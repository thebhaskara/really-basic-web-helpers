/**
 * @class StoreByRef
 * @description
 * Store objects by reference.
 * @type {StoreByRef<T>}
 */
export class StoreByRef {
	/**
	 * @param {T} obj
	 */
	constructor(obj) {
		this.store = new WeakMap()
	}

	/**
	 * @param {any} ref
	 */
	get(ref) {
		return this.store.get(ref)
	}

	/**
	 * @param {any} ref
	 * @param {T} obj
	 */
	set(ref, obj) {
		this.store.set(ref, obj)
	}
}
