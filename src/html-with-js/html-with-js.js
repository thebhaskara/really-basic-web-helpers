// @ts-check
import { classToStyle } from "../class-to-style/class-to-style.js"
import { execute } from "../string-executer/string-executer.js"
import { watcher } from "../watch-engine/watch-engine.js"

export function stringToDOM(str) {
	const template = document.createElement("template")
	template.innerHTML = str
	return template.content
}

export function stringToElementsList(str) {
	return Array.from(stringToDOM(str).childNodes)
}

/**
 * @param {ChildNode[] | Element} elements
 */
export function runHtmlWithJs(elements, data) {
	if (Array.isArray(elements)) {
		elements.forEach((el) => el instanceof Element && runHtmlWithJs(el, data))
		return
	}
	let element = elements
	if (element.nodeType !== Node.ELEMENT_NODE) return
	const attributes = Array.from(element.attributes)
	attributes.forEach((attribute) => {
		if (!attribute.name.startsWith("js")) return
		let $state = getState(data)
		let obj = { ...data, $el: element, $attr: attribute, $data: data, $state }

		simpleEventListener(attribute, element, obj) ||
			simpleTextBinder(attribute, element, obj) ||
			simpleAttributeBinder(attribute, element, obj) ||
			simpleClassBinder(attribute, obj, element) ||
			simpleStyleBinder(attribute, element, obj) ||
			simpleHtmlBinder(attribute, element, obj) ||
			simpleIfBinder(attribute, element, obj) ||
			simpleForBinder(attribute, element, obj) ||
			simpleSwitchBinder(attribute, element, obj) ||
			simpleImportBinder(attribute, element, obj) ||
			simpleJsExecute(attribute, element, obj)
		element.removeAttribute(attribute.name)
	})
	runHtmlWithJs([...element.children], data)
}

const stateWeakMap = new WeakMap()
function getState(data) {
	let $state = stateWeakMap.get(data?.$item ?? data)
	if (!$state) {
		$state = watcher.watch({ $parentState: data?.$state })
		stateWeakMap.set(data?.$item ?? data, $state)
	}
	return $state
}

function simpleImportBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-import")) return

	watcher.trigger(() => {
		let importDef = execute(attribute.value, obj)
		let html = typeof importDef === "string" ? importDef : importDef.html
		let js = typeof importDef === "string" ? undefined : importDef.js
		let absolutePathSplit = window.location.pathname.split("/").filter((s) => s)
		if (absolutePathSplit[absolutePathSplit.length - 1].endsWith(".html")) absolutePathSplit.pop()
		if (!html.endsWith(".html")) {
			let splits = html.split("/")
			let file = splits[splits.length - 1]
			for (const s of splits) {
				if (s === "..") absolutePathSplit.pop()
				else if (s === ".") {
				} else absolutePathSplit.push(s)
			}
			html = [window.location.origin, ...absolutePathSplit, `${file}.html`].join("/")
			js = [window.location.origin, ...absolutePathSplit, `${file}.js`].join("/")
		}
		async function importJs() {
			if (!js) return {}
			let module = await import(js)
			return module.default
		}
		async function importHtml() {
			if (!html) return ""
			let res = await fetch(html)
			return await res.text()
		}
		async function importHtmlAndJs() {
			let [html, js] = await Promise.all([importHtml(), importJs()])
			return { html, js }
		}
		async function importHtmlAndJsAndExecute() {
			let { html, js } = await importHtmlAndJs()
			let elements = stringToElementsList(html)
			runHtmlWithJs([...elements], { ...obj, $js: js })
			elements.forEach((e) => element.append(e))
		}
		importHtmlAndJsAndExecute()
	})

	return true
}

function simpleSwitchBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-switch")) return
	if (element.tagName !== "TEMPLATE") return

	const comment = document.createComment(` js-switch:${attribute.value} `)
	element.parentNode.insertBefore(comment, element)
	let html = element.innerHTML
	element.remove()
	let elements = []
	watcher.trigger(() => {
		elements.forEach((element) => element.remove())
		elements = []

		let value = execute(attribute.value, obj)
		let found = false
		Array.from(element.content.cloneNode(true).childNodes).forEach((element) => {
			if (element.tagName !== "TEMPLATE") return
			if (found) return
			let attr = element.getAttribute("js-case")
			if (attr === value) {
				found = true
				elements.push(...Array.from(element.content.cloneNode(true).childNodes))
				runHtmlWithJs(elements, { ...obj })
				elements.forEach((element) => comment.after(element))
			}
		})
	})

	return true
}

function simpleForBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-for")) return
	if (element.tagName !== "TEMPLATE") return

	const comment = document.createComment(` js-for:${attribute.value} `)
	element.parentNode.insertBefore(comment, element)
	element.remove()
	let elements = []
	watcher.trigger(() => {
		elements.forEach((element) => element.remove())
		elements = []

		let arr = execute(attribute.value, obj)
		if (!Array.isArray(arr)) return
		arr.reverse()
		for (let $index = 0; $index < arr.length; $index++) {
			let $item = arr[$index]
			const items = Array.from(element.content.cloneNode(true).childNodes)
			runHtmlWithJs(items, { ...obj, $item, $index })
			items.forEach((element) => comment.after(element))
			elements.push(...items)
		}
	})

	return true
}

function simpleIfBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-if")) return
	if (element.tagName !== "TEMPLATE") return

	const comment = document.createComment(` js-if:${attribute.value} `)
	element.parentNode.insertBefore(comment, element)
	let html = element.innerHTML
	element.remove()
	let elements = []
	watcher.trigger(() => {
		elements.forEach((element) => element.remove())
		elements = []

		if (!execute(attribute.value, obj)) return

		// elements = stringToElementsList(html)
		elements = Array.from(element.content.cloneNode(true).childNodes)
		runHtmlWithJs(elements, { ...obj })
		elements.reverse().forEach((element) => comment.after(element))
	})

	return true
}

function simpleHtmlBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-html")) return
	watcher.trigger(() => {
		element.innerHTML = execute(attribute.value, obj)
	})

	return true
}

function simpleStyleBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-style")) return
	let style = attribute.name.replace("js-style-", "")
	watcher.trigger(() => {
		element.style[style] = execute(attribute.value, obj)
	})

	return true
}

function simpleClassBinder(attribute, obj, element) {
	if (!attribute.name.startsWith("js-class")) return
	let className = attribute.name.replace("js-class-", "")
	watcher.trigger(() => {
		if (execute(attribute.value, obj)) {
			element.classList.add(className)
		} else {
			element.classList.remove(className)
		}
	})

	return true
}

function simpleAttributeBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-attr")) return
	let attr = attribute.name.replace("js-attr-", "")
	watcher.trigger(() => {
		let value = execute(attribute.value, obj)
		if (value === true) {
			element.setAttribute(attr, "")
		} else if (value === false || value == null || value === undefined) {
			element.removeAttribute(attr)
		} else {
			element.setAttribute(attr, value)
		}
	})

	return true
}

function simpleTextBinder(attribute, element, obj) {
	if (!attribute.name.startsWith("js-text")) return
	watcher.trigger(() => {
		element.innerText = execute(attribute.value, obj) ?? ""
	})

	return true
}

function simpleEventListener(attribute, element, obj) {
	if (!attribute.name.startsWith("js-on")) return
	let event = attribute.name.replace("js-on-", "")
	element.addEventListener(event, (e) => {
		execute(attribute.value, { ...obj, $event: e })
	})

	return true
}

function simpleJsExecute(attribute, element, obj) {
	if (!attribute.name.startsWith("js")) return
	watcher.trigger(() => {
		execute(attribute.value, obj)
	})

	return true
}

/**
 * @param {Element | string} ref
 */
export async function convertToWebComponent(ref) {
	if (typeof ref === "string") {
		let res = await fetch(`${refprefix}${ref}`)
		let html = await res.text()
		let elements = stringToElementsList(html)
		for (const element of elements) {
			if (element instanceof Element) {
				convertToWebComponent(element)
			}
		}
		return
	}
	let name = ref.tagName.toLowerCase()
	let attributes = [...ref.attributes]
	let htmlContent = ref.innerHTML

	customElements.define(
		name,
		class extends HTMLElement {
			_data = watcher.watch({})

			constructor() {
				super()
				this.attachShadow({ mode: "open" })
				if (!this.shadowRoot) return
				this.shadowRoot.innerHTML = htmlContent
				attributes.forEach((attr) => {
					if (this[attr.name] != null) this._data[attr.name] = this[attr.name]
					else if (this.getAttribute(attr.name) != null) this._data[attr.name] = this.getAttribute(attr.name)
					Object.defineProperty(this, attr.name, {
						get: () => this._data[attr.name],
						set: (value) => (this._data[attr.name] = value),
					})
				})
				runHtmlWithJs([...this.shadowRoot.children], this._data)
				classToStyle(this.shadowRoot)
			}

			connectedCallback() {
				attributes.forEach((attr) => {
					if (this[attr.name] != this._data[attr.name] && this._data[attr.name] != null) {
						this._data[attr.name] = this[attr.name]
					} else if (
						this._data[attr.name] != this.getAttribute(attr.name) &&
						this.getAttribute(attr.name) != null
					) {
						this._data[attr.name] = this.getAttribute(attr.name)
					}
				})
			}

			attributeChangedCallback(name, oldValue, newValue) {
				this._data[name] = newValue
			}
		}
	)
}
